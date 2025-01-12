import mongoose from 'mongoose';
import { DB_URL, DB_NAME } from '../constants/constants-info';
export class DBConnect {
  public connectedDb;

  constructor() {
    this.setupDb();
  }

  private setupDb(): void {
    if (!DB_URL) {
      process.exit(0);
    }
    mongoose
      .connect(DB_URL, {
        dbName: DB_NAME
      })
      .then((db) => {
        this.connectedDb = db;
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });
  }
}
