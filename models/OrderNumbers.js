const mongoose = require('mongoose');

//database 모델 생성
const OrderNumberSchema = mongoose.Schema({
  orderNum: {
    type: Number,
  },
  userId: {
    type: String,
  },
  date: {
    type: String,
  },
});

const OrderNumbers = mongoose.model('ordernumbers', OrderNumberSchema);
module.exports = { OrderNumbers };
