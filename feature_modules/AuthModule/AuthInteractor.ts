import { User, UserIdentifier } from '../../types/User';
import { RequestErrorType } from '../../errors/Error';
import { UserModuleAdapter } from '../UserModule/UserModuleAdapter';
import * as bcrypt from 'bcrypt';
import { makeToken } from '../../helpers/TokenManager';

export class AuthInteractor {
  
  async logIn(username: string, password: string): Promise<string> {
    // retrieve the user from the database
    const user = await UserModuleAdapter.getUser(new UserIdentifier(undefined, username));

    if (await bcrypt.compare(password, user.passwordHash)) {
      // update user in database with new login date
      await UserModuleAdapter.updateUser(new UserIdentifier(undefined, username), User.from({ lastLoggedIn: new Date() }))

      // respond with new jwt
      return makeToken(user);
    } else {
      throw RequestErrorType.UNAUTHENTICATED()
    }
  }

  async register(user: Partial<User> & { password: string }): Promise<string> {
    // hash user's password and delete their plain-text password
    user.passwordHash = await bcrypt.hash(user.password, 10);
    delete user.password;

    user.lastLoggedIn = new Date();

    // create the user in the database
    await UserModuleAdapter.createUser(user);

    // respond with new jtt
    return makeToken(user);
  }
}