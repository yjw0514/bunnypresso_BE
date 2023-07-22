const { validationResult } = require('express-validator');
const { Menu } = require('../models/Menu');
const { OrderList } = require('../models/OrderList');
const { OrderHistory } = require('../models/OrderHistory');
const moment = require('moment');

// 주문하기
exports.takeOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { userId, menu, isHot, count } = req.body;
  // 주문한 메뉴의 이미지 url 가져오기
  const { img_url, price } = await Menu.findOne({ name: menu });
  const today = moment().format('YYYY-MM-DD');
  const newOrder = { date: today, ...req.body, total: price * count };

  // 1. 주문번호 생성
  const [todayOrderNum] = await OrderHistory.find({ date: today });
  // 초기 주문 번호 1로 세팅
  let orderNum = 1;
  if (todayOrderNum) {
    // 기존에 저장된 주문번호가 있으면 누적
    orderNum = todayOrderNum.orderNum + 1;
    await new OrderHistory({ ...newOrder, newOrder }).save();
  } else {
    await new OrderHistory({ ...newOrder, newOrder }).save();
  }

  // 2. 주문 내역 생성
  order = new OrderList({
    ...req.body,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    img_url,
    orderNum,
  });

  // 주문 내역 저장
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
