import { MongoClient } from 'mongodb';

export class MongoConnector {
  
  private static _instance: MongoConnector;
  private _connection: Promise<MongoClient>;
  
  private constructor() { }

  static get instance() {
    if (!this._instance) {
      this._instance = new MongoConnector();
    }

    return this._instance;
  }

  get connection(): Promise<MongoClient> {
    this._connection = this.connect();
    return this._connection;
  }

  private connect(): Promise<MongoClient> {
    let connectionString = process.env.MONGO_CONNECTION_STRING;
    connectionString = connectionString.replace('<username>', process.env.MONGO_USERNAME)
    connectionString = connectionString.replace('<password>', process.env.MONGO_PASSWORD)
  
    return MongoClient.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true });
  }
}
