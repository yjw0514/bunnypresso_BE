const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const schedule = require('node-schedule');

const uri = process.env.ATLAS_URI;

const app = express();
const port = 8080;

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

app.use(
  cors({
    origin: [
      'https://bunnypresso-fe.vercel.app',
      'https://bunnypresso-fe-git-dev-yjw0514.vercel.app',
      'http://localhost:3000',
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use('/', userRoutes);
app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);

// To serve static files
app.use('/uploads', express.static('uploads'));

const moment = require('moment');
const { OrderList } = require('./models/OrderList');

app.listen(port, () => {
  schedule.scheduleJob('*/1 * * * *', async function () {
    // 주문목록에 데이터가 있으면 1분마다 orderlist 하나씩 주문완료 처리(삭제)
    const leftOrders = await OrderList.find();
    if (leftOrders.length) {
      const [first] = leftOrders;
      const { _id } = first;
      await OrderList.deleteOne(_id);
      console.log('1분..', moment().format('YYYY-MM-DD HH:mm:ss'));
    }
  });
});
