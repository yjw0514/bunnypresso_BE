const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/user');

const uri = process.env.ATLAS_URI;

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected ... '))
  .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('Hello World! 안녕하세요'));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.use('/', userRoutes);

//token verify 필요한 경우 적용하기
