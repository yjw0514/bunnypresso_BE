const { validationResult } = require('express-validator');
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  //req에 에러 유무 확인
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { name, password } = req.body;
  try {
    let user = await User.findOne({ name });
    if (user) {
      return res.status(400).json({
        errors: { type: 'name', message: '이미 존재하는 닉네임입니다.' },
      });
    }

    user = new User({
      name,
      password,
    });

    //비밀번호 암호화 후에 save code 실행됨
    await user
      .save()
      .then((userInfo) => {
        return res.status(200).json({ success: true });
      })
      .catch((err) => res.json({ success: false, err }));
  } catch (err) {
    console.log(`Error ${err.message}`);
    res.status(400).send(err.message);
  }
};

exports.login = (req, res) => {
  const { name, password } = req.body;
  //1. database에서 요청한 이메일 찾기
  User.findOne({ name })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          loginSuccess: false,
          type: 'name',
          message: '존재하지 않는 닉네임입니다.',
        });
      }
      //2. 이름이 있으면 비밀번호가 맞는지 확인
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          return res.status(401).json({
            loginSuccess: false,
            type: 'password',
            message: '비밀번호가 틀렸습니다.',
          });
        }

        //3. 비밀번호가 맞으면 token 생성
        user.generateToken((err, data) => {
          const { user, accessToken } = data;
          if (err)
            return res.status(400).json({ loginSuccess: false, message: err });
          //쿠키에 토큰 저장
          // 쿠키 저장 시 httponly:true 속성을 적용하면 클라이언트에서 쿠키 접근이 불가함
          res.cookie('refreshToken', user.token);
          res.cookie('accessToken', accessToken);
          console.log(user.token);
          res.status(200).json({
            loginSuccess: true,
            userId: user._id,
            accessToken,
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//엑세스 토큰이 만료되었을 때 client쪽에서 엑세스 토큰 발급을 새로 요청할 때 실행.
exports.verifyRefresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (req.headers.authorization && refreshToken) {
    //user 정보로 refreshtoken 검증
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(401).json({
          message: '인증 정보가 만료되었습니다. 다시 로그인해 주세요.',
        });
      } else {
        const accessToken = jwt.sign(
          { id: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '1h',
          }
        );
        return res.status(200).json({
          accessToken,
          message: 'Access token이 발급되었습니다.',
        });
      }
    });
  } else {
    res.status(400).json({ message: '다시 로그인해 주세요.' });
  }
};
