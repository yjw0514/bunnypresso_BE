const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controllers');

// 커피 메뉴 가져오기
router.get('/', menuController.getMenu);

module.exports = router;
