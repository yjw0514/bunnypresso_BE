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
  },
  count: {
    type: Number,
  },
  createdAt: {
    type: Date,
  },
});

const OrderList = mongoose.model('orderList', OrderListSchema);
module.exports = { OrderList };
