import 'dotenv/config';
import express from 'express';
import { router } from './routes/auth.route.js';

const PORT = process.env.PORT || 3004;

const app = express();

app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log('server is running on the port: ', PORT);
});
