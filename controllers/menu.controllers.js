const { validationResult } = require('express-validator');
const { Menu } = require('../models/Menu');
const { OrderList } = require('../models/OrderList');

// 메뉴 목록 가져오기
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.find();
    return res.status(200).json({
      menu,
    });
  } catch (err) {
    console.log(err);
  }
};

// 메뉴 상세 정보 가져오기
exports.getMenuDetail = async (req, res) => {
  try {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({
        message: '없음',
      });
    }

    const detail = await Menu.findOne({ _id: uid });
    return res.status(200).json({
      detail,
    });
  } catch (err) {
    console.log(err);
  }
};
