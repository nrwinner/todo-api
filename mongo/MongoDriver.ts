import { DataStore } from "../interfaces/datastore";
import { Task } from "../types/Task";
import { TaskQuery } from "../types/Query";
import { MongoClient, Db, ObjectId } from 'mongodb';
import { ResourceErrorType } from '../errors/Error';

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

  async getTasks(query: TaskQuery): Promise<Task[]> {
    const _query = {};

    // build _query object
    if (query.title) {
      _query['title'] = {
        $regex: query.title
      }
    }

    if (query.description) {
      _query['description'] = {
        $regex: query.description
      }
    }

    if (query.dueDate) {
      _query['dueDate'] = {
        $gte: generalizeDate(query.dueDate),
        $lt: generalizeDate(addDaysToDate(query.dueDate, 1))
      }
    }

    if (query.todoDate) {
      _query['todoDate'] = {
        $gte: generalizeDate(query.todoDate),
        $lt: generalizeDate(addDaysToDate(query.todoDate, 1))
      }
    }

    let cursor = await this.db.collection(Collections.TASKS).find(_query);

    if (query.offset) {
      cursor.skip(query.offset)
    }

    if (query.limit) {
      cursor.limit(query.limit) 
    }

    const results = await cursor.toArray();

    return results.map(t => Task.from(t) as Task);
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

function generalizeDate(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function addDaysToDate(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}