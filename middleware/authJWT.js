const jwt = require('jsonwebtoken');

//token verify 체크
const authJWT = (req, res, next) => {
  // header의 토큰 가져오기
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('Bearer ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(401).json({ message: 'token expired' });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: '권한이 없습니다.' });
  }
};

module.exports = authJWT;
