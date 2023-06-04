const { validationResult } = require('express-validator');
const { OrderList } = require('../models/OrderList');

// 주문하기
exports.takeOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { userId, menu, isHot, count } = req.body;
  order = new OrderList({
    userId,
    menu,
    isHot,
    count,
    createdAt: new Date(),
  });

  // order 저장
  await order
    .save()
    .then((orderInfo) => {
      return res.status(200).json({ success: true });
    })
    .catch((err) => res.json({ success: false, err }));
};

// 주문 목록 가져오기
exports.getOrderList = async (req, res) => {
  try {
    const orderList = await OrderList.find();
    return res.status(200).json({
      orderList,
    });
  } catch (err) {
    console.log(err);
  }
};
