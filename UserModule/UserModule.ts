import { Router, Request, Response } from 'express';
import * as Error from '../errors/Error';
import { UserMongoDriver } from './UserMongoDriver';
import { handleError } from '../helpers/routing helpers/errors';
import { authenticated } from '../guards/guards';
import * as Interactor from './UserInterator';
import { User } from '../types/User';

const dataStore = new UserMongoDriver();

export class UserModule {

  @authenticated
  private static async getUser(req: Request, res: Response) {
    try {
      const user = await Interactor.getUser(dataStore, { id: req.params.identifier });
      res.json(user)
    }
    catch (error) {
      handleError(error, res)
    }
  }

  @authenticated
  private static async getUsers(req: Request, res: Response) {
    try {
      const users = await Interactor.getUsers(dataStore, req.params.query);
      res.json(users);
    }
    catch (error) {
      handleError(error, res)
    }
  }

  @authenticated
  private static async createUser(req: Request, res: Response) {
    try {
      const user = User.from(req.body.user);
      const insertedId = await Interactor.createUser(dataStore, user);
      res.send(insertedId);
    }
    catch (error) {
      handleError(error, res)
    }
  }

  @authenticated
  private static async updateUser(req: Request, res: Response) {
    try {
      const user = User.from(req.body.user);
      await Interactor.updateUser(dataStore, { id: req.params.identifier }, user);
      res.sendStatus(204);
    }
    catch (error) {
      handleError(error, res)
    }
  }

  @authenticated
  private static async deleteUser(req: Request, res: Response) {
    try {
      await Interactor.deleteUser(dataStore, { id: req.params.identifier });
      res.sendStatus(204);
    }
    catch (error) {
      handleError(error, res)
    }
  }

  public static init(router: Router) {

    router.route('/users')
      .get(this.getUsers)
      .post(this.createUser)
      
      router.route('/users/:identifier')
      .get(this.getUser)
      .patch(this.updateUser)
      .delete(this.deleteUser)
  }
}