export enum AccessGroup {
  ADMIN = 'admin'
}

export class User {
  id?: string;
  fname: string;
  lname: string;
  username: string;
  passwordHash: string;
  email: string;
  lastLoggedIn?: Date;
  accessGroups: AccessGroup[];

  static from(data: any) {
    const user = new User();
    
    if (data._id) {
      user.id = data._id;
    }

    if (data.id) {
      user.id = data.id;
    }

    if (data.fname) {
      user.fname = data.fname;
    }

    if (data.lname) {
      user.lname = data.lname;
    }

    if (data.username) {
      user.username = data.username;
    }

    if (data.passwordHash) {
      user.passwordHash = data.passwordHash;
    }

    if (data.email) {
      user.email = data.email;
    }

    if (data.lastLoggedIn) {
      if (data.lastLoggedIn instanceof Date) {
        user.lastLoggedIn = data.lastLoggedIn;
      } else {
        user.lastLoggedIn = new Date(data.lastLoggedIn);
      }
    }

    if (data.accessGroups) {
      user.accessGroups = data.accessGroups;
    }

    return user;
  }

  get insertableUser(): Omit<User, 'id'> {
    const u = Object.assign({}, this) as User;

    // always remove id
    delete u.id;

    // remove null properties
    for (let k in u) {
      if (u[k] === null || u[k] === undefined) {
        delete u[k];
      }
    }

    return u;
  }

  get respondableUser(): Omit<User, 'passwordHash'> {
    const u = Object.assign({}, this) as User;

    // always remove password
    delete u.passwordHash;

    // remove null properties
    for (let k in u) {
      if (u[k] === null || u[k] === undefined) {
        delete u[k];
      }
    }

    return u;
  }
}

export class UserIdentifier {

  constructor(public id?: string, public username?: string) {
    if (!id && !username) {
      throw new Error('Cannot instantiate a UserIdentifier without a username or id');
    }
  }

  get plainObject(): { id?: string, username?: string, [key: string]: any } {
    const obj = { id: this.id, username: this.username };

    for (let k in obj) {
      if (obj[k] === null || obj[k] === undefined) {
        delete obj[k];
      }
    }

    return obj;
  }
}