const mongoose = require('mongoose');

//database 모델 생성
const OrderListSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  menu: {
    type: String,
  },
  isHot: {
    type: Boolean,
    required: false,
  },
  count: {
    type: Number,
  },
  createdAt: {
    type: String,
  },
  img_url: {
    type: String,
  },
  orderNum: {
    type: Number,
  },
});

const OrderList = mongoose.model('orderList', OrderListSchema);
module.exports = { OrderList };
