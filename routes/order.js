const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controllers');
const authJWT = require('../middleware/authJWT');

// 메뉴 주문하기
router.post('/', authJWT, orderController.takeOrder);

// 주문 목록 가져오기
router.get('/list', authJWT, orderController.getOrderList);

module.exports = router;
