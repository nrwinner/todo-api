import { DataStore } from "../interfaces/datastore";
import { Task } from "../types/Task";
import { TaskQuery } from "../types/Query";
import { MongoClient, Db, ObjectId } from 'mongodb';
import { ResourceError, ServiceError, ResourceErrorType, RequestError, RequestErrorType } from '../errors/Error';

enum Collections {
  TASKS = 'tasks'
}

export class MongoDriver implements DataStore {
  private db: Db;

  constructor() {
    this.connect();
  }

  private connect() {
    let connectionString = process.env.MONGO_CONNECTION_STRING;
    connectionString = connectionString.replace('<username>', process.env.MONGO_USERNAME)
    connectionString = connectionString.replace('<password>', process.env.MONGO_PASSWORD)

    MongoClient.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client: MongoClient) => {
      if (!err) {
        this.db = client.db('todo');
      } else {
        throw new Error('Couldn\'t connect to Mongo!');
      }
    })
  }

  async getTask(taskId: string): Promise<Task> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(taskId)
    } catch (_) {
      throw ResourceErrorType.NOT_FOUND();
    }

    const task = await this.db.collection(Collections.TASKS).findOne({ '_id': objectId });

    if (!task) {
      // task wasn't found
      throw ResourceErrorType.NOT_FOUND();
    }

    // we assert Partial<Task> here to Task since we are enforcing a complete task upon insertion
    return Task.from(task) as Task;
  }

  getTasks(query: TaskQuery): Promise<Task[]> {
    throw new ServiceError('Not yet implemented');
  }

  async createTask(task: Partial<Task>): Promise<string> {
    const result = await this.db.collection(Collections.TASKS).insertOne(task.insertableTask);
    return result.insertedId.toHexString();
  }

  async updateTask(task: Partial<Task>): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(task.id)
    } catch (_) {
      throw ResourceErrorType.NOT_FOUND();
    }

    const result = await this.db.collection(Collections.TASKS).updateOne({ _id: objectId }, { $set: task.insertableTask })

    if (result.matchedCount === 0) {
      throw ResourceErrorType.NOT_FOUND();
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(taskId)
    } catch (_) {
      throw ResourceErrorType.NOT_FOUND();
    }

    const result = await this.db.collection(Collections.TASKS).deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      throw ResourceErrorType.NOT_FOUND();
    }
  }
}