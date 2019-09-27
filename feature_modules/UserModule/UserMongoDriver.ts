import { UserDataStore } from './UserDataStore';
import { MongoConnector } from '../../mongo/connect';
import { Db, MongoClient, ObjectID, ObjectId } from 'mongodb';
import { ServiceError, ResourceErrorType } from '../../errors/Error';
import { User, UserIdentifier } from '../../types/User';

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

  async getUser(identifier: UserIdentifier): Promise<User> {
    const mongoIdentifier = userIdentifierToMongo(identifier);


    if (!mongoIdentifier || (!mongoIdentifier._id && !mongoIdentifier.username)) {
      throw ResourceErrorType.NOT_FOUND();
    }

    let user = await (await this.db).collection(Collections.USERS).findOne(mongoIdentifier);

    if (!user) {
      throw ResourceErrorType.NOT_FOUND();
    }

    return User.from(user);
  }

  async createUser(user: Partial<User>): Promise<string> {

    // if there is an eroneous ID property, delete it on creation
    if (user.id) {
      delete user.id;
    }

    const result = await (await this.db).collection(Collections.USERS).insertOne(user.insertableUser)
    return result.insertedId.toHexString();
  }

  async updateUser(identifier: UserIdentifier, user: Partial<User>): Promise<void> {
    const mongoIdentifier = userIdentifierToMongo(identifier);

    if (!mongoIdentifier || (!mongoIdentifier._id && !mongoIdentifier.username)) {
      throw ResourceErrorType.NOT_FOUND();
    }

    const result = await (await this.db).collection(Collections.USERS).updateOne(mongoIdentifier, { $set: user.insertableUser })

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      throw ResourceErrorType.NOT_FOUND();
    }
  }

  async deleteUser(identifier: UserIdentifier): Promise<void> {
    const mongoIdentifier = userIdentifierToMongo(identifier);

    const result = await (await this.db).collection(Collections.USERS).deleteOne(mongoIdentifier);

    if (result.deletedCount === 0) {
      throw ResourceErrorType.NOT_FOUND();
    }
  }

}

function userIdentifierToMongo(identifier: UserIdentifier) {
  const obj = identifier.plainObject;

  if (obj.id) {
    try {
      obj._id = new ObjectId(obj.id);
    } catch (_) {
      if (!identifier.username) {
        obj.username = obj.id;
      }
    }

    delete obj.id;
  }

  return obj;
}