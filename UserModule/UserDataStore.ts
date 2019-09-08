import { User } from '../types/User';

export interface UserDataStore {
  // TODO param should be typed
  getUsers(query?: any): Promise<User[]>;
  getUser(identifier: { id?: string, username?: string }): Promise<User>;
  createUser(user: Partial<User>): Promise<string>;
  updateUser(identifier: { id?: string, username?: string }, user: Partial<User>): Promise<void>;
  deleteUser(identifier: { id?: string, username?: string }): Promise<void>;
}