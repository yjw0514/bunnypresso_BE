const mongoose = require('mongoose');

//database 모델 생성
const OrderHistorySchema = mongoose.Schema({
  orderNum: {
    type: Number,
  },
  userId: {
    type: String,
  },
  date: {
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
  total: {
    type: Number,
  },
});

const OrderHistory = mongoose.model('orderhistory', OrderHistorySchema);
module.exports = { OrderHistory };
