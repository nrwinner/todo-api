import { Router, Request, Response } from 'express';
import { TaskInteractor } from './TaskInteractor';
import { Task } from '../../types/Task';
import { CreateQuery } from '../../types/Query';
import * as Error from '../../errors/Error';
import { handleError } from '../../helpers/routing helpers/errors';
import { authenticated, authorized } from '../../guards/guards';
import { CatchRouteError } from '../../helpers/routing helpers/catchRouteError';
import { AccessGroup } from '../../types/User';

export class TaskModule {

  private interactor: TaskInteractor;

  constructor(router: Router) {
    this.interactor = new TaskInteractor();

    // declare routes
    router.route('/users/:identifier/tasks')
      .get(this.getTasks.bind(this))
      .post(this.createTask.bind(this))

    router.route('/users/:identifier/tasks/:id')
      .get(this.getTask.bind(this))
      .patch(this.updateTask.bind(this))
      .delete(this.deleteTask.bind(this))
  }

  @CatchRouteError(handleError)
  @authorized(AccessGroup.ADMIN)
  @authenticated
  private async getTask(req: Request, res: Response) {
    const task = await this.interactor.getTask(req.params.id, req['user'].username);
    res.send(task);
  }

  @CatchRouteError(handleError)
  @authenticated
  @authorized(AccessGroup.ADMIN)
  private async getTasks(req: Request, res: Response) {
    const query = CreateQuery.taskQueryFrom(req.query);
    const tasks = await this.interactor.getTasks(query, req['user'].username);
    res.send(tasks);
  }
  @CatchRouteError(handleError)
  @authenticated
  @authorized(AccessGroup.ADMIN)
  private async createTask(req: Request, res: Response) {
    if (!req.body.task) {
      throw Error.RequestErrorType.MISSING_PROPERTY('Must include a valid `task` object in the request body');
    }

    const task = Task.from(req.body.task);

    if (!task.title) {
      throw Error.RequestErrorType.MISSING_PROPERTY('Must include a valid `task` object in the request body');
    }

    const taskId = await this.interactor.createTask(Task.from(req.body.task), req['user'].username);
    res.status(201).json({ taskId });
  }

  @CatchRouteError(handleError)
  @authenticated
  @authorized(AccessGroup.ADMIN)
  private async updateTask(req: Request, res: Response) {
    if (!req.body.task) {
      throw Error.RequestErrorType.MISSING_PROPERTY('Must include a partial `task` object in the request body');
    }

    const task: Partial<Task> = Task.from(req.body.task);

    if (task.id && task.id !== req.params.id) {
      throw Error.RequestErrorType.MISMATCHED_PROPERTY('The `id` specified in the route parameter must match the `id` of the update document');
    }

    // if the above check passed, the task might not have an id property on it and it should be added manually
    task.id = req.params.id;

    await this.interactor.updateTask(task, req['user'].username);
    res.sendStatus(204);
  }

  @CatchRouteError(handleError)
  @authenticated
  @authorized(AccessGroup.ADMIN)
  private async deleteTask(req: Request, res: Response) {
    await this.interactor.deleteTask(req.params.id, req['user'].username);
    res.sendStatus(204);
  }
}