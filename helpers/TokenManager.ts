
import * as jwt from 'jsonwebtoken';
import { User } from '../types/User';

export function makeToken(user: Partial<User>) {
  return jwt.sign(user.responseReady, process.env.SECRET, {
    expiresIn: '24h'
  });
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}