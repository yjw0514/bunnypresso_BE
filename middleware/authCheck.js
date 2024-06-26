const jwt = require('jsonwebtoken');

//token verify 체크
const authCheck = (req, res, next) => {
  // header의 토큰 가져오기
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('Bearer ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        res.status(401).json({ message: 'token expired' });
      } else {
        req.userId = user.id;
        next();
      }
    });
  } else {
    res.status(401).json({ message: '토큰이 없습니다.' });
  }
};

module.exports = authCheck;
