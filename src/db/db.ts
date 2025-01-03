const mongoose = require('mongoose');
const dbUrl: string = process.env.DB_URL || '';
export class DBConnect {

  public connectedDb;

  constructor() {
    this.setupDb();
  }

  private setupDb(): void {
    if (!dbUrl) {
      console.log('Please create .env file, refer .env.sample');
      process.exit(0);
    }
    mongoose.connect(dbUrl, {
      dbName: 'doffaire'
    })
      .then((db) => {
        this.connectedDb = db;
        console.log('Connected to MongoDB', db);
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });
  }
}
