const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controllers');
const authJWT = require('../middleware/authJWT');

// 커피 메뉴 가져오기
router.get('/', authJWT, menuController.getMenu);

// 메뉴 상세 정보 가져오기
router.get('/:uid', authJWT, menuController.getMenuDetail);

module.exports = router;
