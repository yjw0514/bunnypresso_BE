const { validationResult } = require('express-validator');
const { Menu } = require('../models/Menu');
const { OrderList } = require('../models/OrderList');
const { OrderNumbers } = require('../models/OrderNumbers');
const moment = require('moment');

// 주문하기
exports.takeOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { userId, menu, isHot, count } = req.body;
  // 주문한 메뉴의 이미지 url 가져오기
  const { img_url } = await Menu.findOne({ name: menu });

  // 1. 주문번호 생성
  const today = moment().format('YYYY-MM-DD');
  const [todayOrderNum] = await OrderNumbers.find({ date: today });
  // 초기 주문 번호 1로 세팅
  let orderNum = 1;
  if (todayOrderNum) {
    // 기존에 저장된 주문번호가 있으면 누적
    orderNum = todayOrderNum.orderNum + 1;
    await new OrderNumbers({ date: today, orderNum, userId }).save();
  } else {
    await new OrderNumbers({ date: today, orderNum, userId }).save();
  }

  // 2. 주문 내역 생성
  order = new OrderList({
    userId,
    menu,
    isHot,
    count,
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
