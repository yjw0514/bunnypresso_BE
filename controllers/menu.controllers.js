const { Menu } = require('../models/Menu');

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
    const { id } = req.body;
    const detail = await Menu.findOne({ id });
    console.log('deatil', detail);
    return res.status(200).json({
      detail,
    });
  } catch (err) {
    console.log(err);
  }
};
