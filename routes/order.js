const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controllers');
const authCheck = require('../middleware/authCheck');

// 메뉴 주문하기
router.post('/', authCheck, orderController.takeOrder);

// 주문 목록 가져오기
router.get('/list', orderController.getOrderList);

// 나의 주문 내역 가져오기
router.get('/history', authCheck, orderController.getMyOrderHistory);
module.exports = router;
