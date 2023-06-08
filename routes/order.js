const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controllers');
const authCheck = require('../middleware/authCheck');

// 메뉴 주문하기
router.post('/', authCheck, orderController.takeOrder);

// 주문 목록 가져오기
router.get('/list', authCheck, orderController.getOrderList);

module.exports = router;
