import { UserInteractor } from './UserInterator';
import { authenticated } from '../../guards/guards';
import { User, UserIdentifier } from '../../types/User';

export class UserModuleAdapter {

  static async getUser(identifier: UserIdentifier): Promise<User> {
    const interactor = new UserInteractor();
    return await interactor.getUser(identifier);
  }

  static async createUser(user: Partial<User>) {
    const interactor = new UserInteractor();
    return await interactor.createUser(user);
  }

  static async updateUser(identifier: UserIdentifier, user: Partial<User>) {
    const interactor = new UserInteractor();
    await interactor.updateUser(identifier, user);
  }

}