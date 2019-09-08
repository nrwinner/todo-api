import { UserDataStore } from './UserDataStore';
import { MongoConnector } from '../mongo/connect';
import { Db, MongoClient, ObjectID, ObjectId } from 'mongodb';
import { ServiceError, ResourceErrorType } from '../errors/Error';
import { User } from '../types/User';

enum Collections {
  USERS = 'users'
}

export class UserMongoDriver implements UserDataStore {
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

  async getUsers(query?: any): Promise<User[]> {
    throw new ServiceError('Method not implemented.');
  }

  async getUser(identifier: { id?: string; username?: string; }): Promise<User> {
    if (identifier.id) {
      try {
        // @ts-ignore
        identifier._id = new ObjectId(identifier.id);
      } catch (_) {
        if (!identifier.username) {
          identifier.username = identifier.id;
        }
      }

      delete identifier.id;
    }

    if (!identifier || (!identifier.id && !identifier.username)) {
      throw ResourceErrorType.NOT_FOUND();
    }

    let user = await (await this.db).collection(Collections.USERS).findOne(identifier);

    if (!user) {
      throw ResourceErrorType.NOT_FOUND();
    }

    return User.from(user);
  }

  async createUser(user: Partial<User>): Promise<string> {
    const result = await (await this.db).collection(Collections.USERS).insertOne(user.insertableUser)
    return result.insertedId.toHexString();
  }

  async updateUser(identifier: { id?: string; username?: string; }, user: Partial<User>): Promise<void> {
    if (identifier.id) {
      try {
        // @ts-ignore
        identifier._id = new ObjectId(identifier.id);
      } catch (_) {
        if (!identifier.username) {
          identifier.username = identifier.id;
        }
      }

      delete identifier.id;
    }

    await (await this.db).collection(Collections.USERS).updateOne(identifier, { $set: user.insertableUser })
  }

  async deleteUser(identifier: { id?: string; username?: string; }): Promise<void> {
    if (identifier.id) {
      try {
        // @ts-ignore
        identifier._id = new ObjectId(identifier.id);
      } catch (_) {
        if (!identifier.username) {
          identifier.username = identifier.id;
        }
      }

      delete identifier.id;
    }

    const result = await (await this.db).collection(Collections.USERS).deleteOne(identifier);

    if (result.deletedCount === 0) {
      throw ResourceErrorType.NOT_FOUND();
    }
  }

}