const { validationResult } = require('express-validator');
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');

// 회원가입
exports.signup = async (req, res) => {
  //req에 에러 유무 확인
  const errors = validationResult(req);
  // user router에서 validation에서 에러나는 경우 핸들링
  if (errors) {
    const [{ msg, path }] = errors.errors;
    return res.status(401).json({
      success: false,
      type: path,
      message: msg,
    });
  }

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { email, name, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        success: false,
        type: 'email',
        message: '이미 존재하는 이메일입니다.',
      });
    }

    user = new User({
      email,
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

// 로그인
exports.login = (req, res) => {
  const { email, password } = req.body;
  //1. database에서 요청한 이메일 찾기
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          type: 'email',
          message: '존재하지 않는 이메일입니다.',
        });
      }
      //2. 이메일이 있으면 비밀번호가 맞는지 확인
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
          res.status(200).json({
            loginSuccess: true,
            userId: user._id,
            name: user.name,
            accessToken,
            refreshToken: user.token,
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

// 프로필 닉네임 변경
exports.updateProfileName = async (req, res) => {
  await User.updateOne({ _id: req.userId }, { $set: req.body });
  return res
    .status(200)
    .json({ message: '닉네임이 성공적으로 변경되었습니다.' });
};

// 프로필 사진 변경
exports.updateProfileImg = async (req, res) => {
  const file = req.body ? req.body.file : null;
  console.log(file);

  await User.updateOne({ _id: req.userId }, { $set: { file: file } });
  return res.status(200).json({ message: '성공적으로 변경되었습니다.' });
};

// 프로필 사진 가져오기
exports.getProfileImg = async (req, res) => {
  const user = await User.findById(req.userId);

  // const url = req.protocol + '://' + req.get('host');
  // const filePath = user.file ? url + '/' + user.file : null;

  return res
    .status(200)
    .json({ file: user.file ?? null, message: '성공적으로 가져왔습니다.' });
};
