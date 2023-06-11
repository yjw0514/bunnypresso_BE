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
// app.listen(port, () => {
//   console.log(`server is running on port ${port}`);
// });

app.use('/', userRoutes);
app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);

const moment = require('moment');
const { OrderList } = require('./models/OrderList');

app.listen(port, () => {
  schedule.scheduleJob('*/3 * * * *', async function () {
    // 주문목록에 데이터가 있으면 3분마다 orderlist 하나씩 주문완료 처리(삭제)
    const leftOrders = await OrderList.find();
    if (leftOrders.length) {
      const [first] = leftOrders;
      const { _id } = first;
      await OrderList.deleteOne(_id);
      console.log('3분..', moment().format('YYYY-MM-DD HH:mm:ss'));
    }
  });
});
//token verify 필요한 경우 적용하기
