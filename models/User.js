const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();

//database 모델 생성
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 10,
  },
  password: {
    type: String,
    trim: true,
    minlength: 6,
  },
});

//Mongoose pre 메소드는 save메소드 전에 실행된다.
userSchema.pre('save', function (next) {
  //next()하면 save 실행되도록 함.

  const user = this; //server파일에서 회원가입 시 new User를 통해 body값을 user 객체로 생성한 것을 가리킨다.

  //user 필드에서 비밀번호가 변경될 때만 실행한다.
  if (user.isModified('password')) {
    //10자리의 salt를 생성하여 비밀번호를 암호화함
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hashedPassword) => {
        if (err) return next(err);
        user.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch); //err는 null이고 isMatch 전달
  });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
