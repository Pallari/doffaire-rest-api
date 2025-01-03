import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();
const server_url: string = process.env.SERVER_URL || 'localhost';
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.disable('x-powered-by'); //Reduce fingerprinting
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Invalid route');
});

app.get('*', (req, res) => {
  res.send('Invalid route');
});

app.listen(port, server_url, () => {
  console.info(`Server running on : ${server_url}:${port}`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log('server startup error: address already in use');
  } else {
    console.log(err);
  }
});