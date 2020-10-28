import express from 'express';
import data from './data';
import dotenv from 'dotenv';
import config from './config';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import bodyParser from 'body-parser';
import path from 'path';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';

dotenv.config();

const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

  const app = express();
app.use(bodyParser.json());
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb' );
});

app.get('/', (req, res) => {
  res.send('Server is ready');
})

app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));

app.use(express.static(path.join(__dirname, '/../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});

app.listen(config.PORT, () => {
  console.log('Server started at http://localhost:5000');
});