import { User, UserIdentifier } from '../../types/User';
import { ServiceError } from '../../errors/Error';
import { UserDataStore } from './UserDataStore';
import { UserMongoDriver } from './UserMongoDriver';

export class UserInteractor {
  constructor(private dataStore: UserDataStore = new UserMongoDriver()) { }

  async getUser(identifier: UserIdentifier): Promise<User> {
    const users = await this.dataStore.getUser(identifier);
    return users;
  }
  
  async getUsers(query?: any): Promise<User[]> {
    throw new ServiceError('Method not implemented.');
  }
  
  async createUser(user: Partial<User>): Promise<string> {
    const insertedId = await this.dataStore.createUser(user);
    return insertedId;
  }
  
  async updateUser(identifier: UserIdentifier, user: Partial<User>): Promise<void> {
    await this.dataStore.updateUser(identifier, user);
  }
  
  async deleteUser(identifier: UserIdentifier): Promise<void> {
    await this.dataStore.deleteUser(identifier);
  }
}