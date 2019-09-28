import { User, UserIdentifier } from '../../types/User';

export interface UserDataStore {
  // TODO param should be typed
  getUsers(query?: any): Promise<User[]>;
  getUser(identifier: UserIdentifier): Promise<User>;
  createUser(user: Partial<User>): Promise<string>;
  updateUser(identifier: UserIdentifier, user: Partial<User>): Promise<void>;
  deleteUser(identifier: UserIdentifier): Promise<void>;
}