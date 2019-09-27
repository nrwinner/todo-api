import { TaskDataStore } from './TaskDataStore';
import { Task } from '../../types/Task';
import { TaskQuery } from '../../types/Query';
import { Db, ObjectId, MongoClient } from 'mongodb';
import { ResourceErrorType, ServiceError } from '../../errors/Error';
import { MongoConnector } from '../../mongo/connect';

enum Collections {
  TASKS = 'tasks'
}

export class TaskMongoDriver implements TaskDataStore {
  private connector = MongoConnector.instance;
  private _db: Db;

  constructor() { }

  get db(): Promise<Db> {
    if (this._db) {
      return Promise.resolve(this._db);
    } else {
      return new Promise<Db>((resolve) => {
        this.connector.connection.then((client: MongoClient) => {
          this._db = client.db('todo');
          resolve(this._db);
        })
      }).catch(error => {
        throw new ServiceError('Service failed to connect to Mongo');
      })
    }
  }

  async getTask(taskId: string): Promise<Task> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(taskId)
    } catch (_) {
      throw ResourceErrorType.NOT_FOUND();
    }

    const task = await (await this.db).collection(Collections.TASKS).findOne({ '_id': objectId });

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

    if (_query['todoDate'] && _query['dueDate']) {
      // set this to an $or operation and delete the original params
      _query['$or'] = [
        { todoDate: _query['todoDate'] },
        { dueDate: _query['dueDate'] },
      ]

      delete _query['todoDate'];
      delete _query['dueDate'];
    }

    let cursor = await (await this.db).collection(Collections.TASKS).find(_query);

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
    const result = await (await this.db).collection(Collections.TASKS).insertOne(task.insertableTask);
    return result.insertedId.toHexString();
  }

  async updateTask(task: Partial<Task>): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(task.id)
    } catch (_) {
      throw ResourceErrorType.NOT_FOUND();
    }

    const result = await (await this.db).collection(Collections.TASKS).updateOne({ _id: objectId }, { $set: task.insertableTask })

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

    const result = await (await this.db).collection(Collections.TASKS).deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      throw ResourceErrorType.NOT_FOUND();
    }
  }
}

function generalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDaysToDate(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}