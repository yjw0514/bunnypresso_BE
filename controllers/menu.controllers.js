const { Menu } = require('../models/Menu');

exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.find();
    console.log(menu);
    return res.status(200).json({
      menu,
    });
  } catch (err) {
    console.log(err);
  }
};
