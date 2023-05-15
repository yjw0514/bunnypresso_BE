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
      return res
        .status(400)
        .json({ errors: { message: '이미 존재하는 닉네임입니다.' } });
    }

    user = new User({
      name,
      password,
    });

    //비밀번호 암호화 후에 save code 실행됨
    user.save((err, userInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true });
    });
  } catch (err) {
    console.log(`Error ${err.message}`);
    res.status(400).send(err.message);
  }
};

exports.login = (req, res) => {
  //1. database에서 요청한 이메일 찾기
  User.findOne({ name: req.body.name }, (err, user) => {
    if (!user) {
      return res.status(401).json({
        loginSuccess: false,
        message: '존재하지 않는 닉네임입니다.',
      });
    }
    //2. 이메일이 있으면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(401).json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });
      }
    });
  });
};
