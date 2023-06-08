const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const usersController = require('../controllers/user.controllers');

//회원가입
router.post(
  '/signup',
  [
    check('name', 'name is required')
      .isLength({ min: 2, max: 10 })
      .withMessage('이름은 2~10자리어야 합니다.')
      .matches(/^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{1,10}$/)
      .withMessage('이름은 영어, 숫자, 한글만 입력이 가능합니다.'),
    check('password')
      .isLength({ min: 6, max: 10 })
      .withMessage('비밀번호는 6~10자리어야 합니다.')
      .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,10}$/)
      .withMessage('비밀번호는 숫자와 문자 조합을 입력해야 합니다. '),
  ],
  usersController.signup
);

//login
router.post('/login', usersController.login);

// 리프레쉬 토큰 체크
router.post('/refresh', usersController.verifyRefresh);
module.exports = router;
