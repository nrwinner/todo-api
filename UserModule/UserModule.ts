import { Router, Request, Response } from 'express';
import { handleError } from '../helpers/routing helpers/errors';
import { authenticated } from '../guards/guards';
import { UserInteractor } from './UserInterator';
import { User } from '../types/User';
import { CatchRouteError } from '../helpers/routing helpers/catchRouteError';

export class UserModule {

  private interactor: UserInteractor;

  constructor(router: Router) {
    this.interactor = new UserInteractor();

    router.route('/users')
      .get(this.getUsers.bind(this))

    router.route('/users/:identifier')
      .get(this.getUser.bind(this))
      .patch(this.updateUser.bind(this))
      .delete(this.deleteUser.bind(this))
  }

  @CatchRouteError(handleError)
  @authenticated
  private async getUser(req: Request, res: Response) {
    const user = await this.interactor.getUser({ id: req.params.identifier });
    res.json(user.respondableUser)
  }

  @CatchRouteError(handleError)
  @authenticated
  private async getUsers(req: Request, res: Response) {
    const users = await this.interactor.getUsers(req.params.query);
    res.json(users.map(u => u.respondableUser));
  }

  @CatchRouteError(handleError)
  @authenticated
  private async updateUser(req: Request, res: Response) {
    const user = User.from(req.body.user);
    await this.interactor.updateUser({ id: req.params.identifier }, user);
    res.sendStatus(204);
  }

  @CatchRouteError(handleError)
  @authenticated
  private async deleteUser(req: Request, res: Response) {
    await this.interactor.deleteUser({ id: req.params.identifier });
    res.sendStatus(204);
  }
}