const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { check } = require('express-validator');
const usersController = require('../controllers/user.controllers');
const authCheck = require('../middleware/authCheck');

//회원가입
router.post(
  '/signup',
  [
    check('email', 'email is required')
      .isEmail()
      .withMessage('이메일 형식이 올바르지 않습니다.'),
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

// 프로필 닉네임 변경
router.patch('/update-name', authCheck, usersController.updateProfileName);

// 프로필 사진 업로드
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, new Date().valueOf() + path.extname(file.originalname));
//     },
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 },
// });
// const uploadMiddleware = upload.single('file');

// router.patch(
//   '/update-file',
//   authCheck,
//   uploadMiddleware,
//   usersController.updateProfileImg
// );
router.patch('/update-file', authCheck, usersController.updateProfileImg);

router.get('/profile', authCheck, usersController.getProfileImg);

module.exports = router;
