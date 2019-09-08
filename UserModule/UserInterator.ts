import { User } from '../types/User';
import { ServiceError } from '../errors/Error';
import { UserDataStore } from './UserDataStore';

export async function getUser(dataStore: UserDataStore, identifier: { username?:  string, id?: string }): Promise<User> {
  const users = await dataStore.getUser(identifier);
  return users;
}

export async function getUsers(dataStore: UserDataStore, query?: any): Promise<User[]> {
  throw new ServiceError('Method not implemented.');
}

export async function createUser(dataStore: UserDataStore, user: Partial<User>): Promise<string> {
  const insertedId = await dataStore.createUser(user);
  return insertedId;
}

export async function updateUser(dataStore: UserDataStore, identifier: { username?:  string, id?: string }, user: Partial<User>): Promise<void> {
  await dataStore.updateUser(identifier, user);
}

export async function deleteUser(dataStore: UserDataStore, identifier: { id?: string, username?: string }): Promise<void> {
  await dataStore.deleteUser(identifier);
}