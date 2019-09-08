import { User } from '../types/User';
import { RequestErrorType } from '../errors/Error';
import { UserModuleAdapter } from '../UserModule';
import * as bcrypt from 'bcrypt';

export class AuthInteractor {
  
  async logIn(username: string, password: string): Promise<string> {
    // retrieve the user from the database
    const user = await UserModuleAdapter.getUser({ username });

    if (await bcrypt.compare(password, user.passwordHash)) {
      // TODO generate response token here
      return 'thisisausertoken';
    } else {
      throw RequestErrorType.UNAUTHENTICATED()
    }
  }

  async register(user: Partial<User> & { password: string }): Promise<string> {
    // hash user's password and delete their plain-text password
    user.passwordHash = await bcrypt.hash(user.password, 10);
    delete user.password;

    // create the user in the database
    await UserModuleAdapter.createUser(user);

    // TODO generate response token here
    return 'thisisausertoken';
  }

  async logout(token: string): Promise<void> {
    // TODO invalidate token here
  }
}