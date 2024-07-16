import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes/auth.route.js';

const PORT = process.env.PORT || 3005;

const app = express();

app.use(cors({
  origin: process.env.CLIENT_HOST,
  credentials: true
})); 

app.options('*', cors({
  origin: process.env.CLIENT_HOST,
  credentials: true
}));

app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log('server is running on the port:', PORT);
});