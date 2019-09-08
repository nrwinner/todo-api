import { UserInteractor } from './UserInterator';
import { authenticated } from '../guards/guards';
import { User } from '../types/User';

export class UserModuleAdapter {

  static async getUser(identifier: { id?: string, username?: string }): Promise<User> {
    const interactor = new UserInteractor();
    return await interactor.getUser(identifier);
  }

  static async createUser(user: Partial<User>) {
    const interactor = new UserInteractor();
    return await interactor.createUser(user);
  }

}