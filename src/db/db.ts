import mongoose from 'mongoose';

const dbUrl: string = process.env.DB_URL || '';
const dbName: string = process.env.DB_NAME || '';
export class DBConnect {
  public connectedDb;

  constructor() {
    this.setupDb();
  }

  private setupDb(): void {
    if (!dbUrl) {
      process.exit(0);
    }
    mongoose
      .connect(dbUrl, {
        dbName: dbName
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
