const mongoose = require('mongoose');

//database 모델 생성
const menuSchema = mongoose.Schema({
  name: {
    type: String,
  },
  img_url: {
    type: String,
  },
  price: {
    type: Number,
  },
  desc: {
    type: String,
  },
  en_name: {
    type: String,
  },
  category: {
    type: String,
  },
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = { Menu };
