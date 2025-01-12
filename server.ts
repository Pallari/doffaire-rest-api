import { config } from 'dotenv';
config();
import express from 'express';
import { Application } from 'express';
import { DBConnect } from './src/db/db';
import Server from './src/index';

const app: Application = express();
const server: Server = new Server(app);
const server_url: string = process.env.SERVER_URL || 'localhost';
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const database = new DBConnect();

app.disable('x-powered-by'); //Reduce fingerprinting
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, server_url, () => {
  console.info(`Server running on : ${server_url}:${port}`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log('server startup error: address already in use');
  } else {
    console.log(err);
  }
});
 