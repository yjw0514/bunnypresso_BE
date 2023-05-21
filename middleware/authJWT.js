const jwt = require('jsonwebtoken');

//token verify 체크
const authJWT = (req, res, next) => {
  // header의 토큰 가져오기
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split('Bearer ')[1];

  if (!token) return res.status(400);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.status(401).json({ message: 'token expired.' });
    req.user = user;
    next();
  });
};

module.exports = authJWT;
