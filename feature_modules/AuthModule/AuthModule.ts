import { Router, Request, Response } from 'express';
import { handleError } from '../../helpers/routing helpers/errors';
import { authenticated } from '../../guards/guards';
import { AuthInteractor } from './AuthInteractor';
import { User } from '../../types/User';
import { CatchRouteError } from '../../helpers/routing helpers/catchRouteError';

export class AuthModule {

  private interactor: AuthInteractor;

  constructor(router: Router) {
    this.interactor = new AuthInteractor();

    router.route('/users')
      .post(this.register.bind(this))

    router.route('/users/tokens')
      .post(this.login.bind(this))

    router.route('/users/:identifier/tokens')
      // .patch(this.refresh.bind(this))
  }

  @CatchRouteError(handleError)
  private async login(req: Request, res: Response) {
    const token = await this.interactor.logIn(req.body.username, req.body.password);
    res.send(token)
  }

  @CatchRouteError(handleError)
  private async register(req: Request, res: Response) {
    const token = await this.interactor.register(Object.assign(User.from(req.body.user), { password: req.body.user.password }));
    res.send(token)
  }
}