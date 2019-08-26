import { Router, Request, Response } from 'express';
import { DataStore } from '../interfaces/datastore';
import * as Interactor from './TaskInteractor';
import { Task } from '../types/Task';
import { CreateQuery } from '../types/Query';
import * as Error from '../errors/Error';

export class TaskModule {

  public static init(router: Router, dataStore: DataStore) {

    const getTask = async (req: Request, res: Response) => {
      try {
        const task = await Interactor.getTask(req.params.id, dataStore);
        res.send(task);
      } catch (error) {
        handleError(error, res);
      }
    }

    const getTasks = async (req: Request, res: Response) => {
      try {
        const query = CreateQuery.taskQueryFrom(req.query);
        const tasks = await Interactor.getTasks(query, dataStore);
        res.send(tasks);
      } catch (error) {
        handleError(error, res);
      }
    }

    const createTask = async (req: Request, res: Response) => {
      try {
        if (!req.body.task) {
          throw Error.RequestErrorType.MISSING_PROPERTY('Must include a valid `task` object in the request body');
        }

        const task = Task.from(req.body.task);

        if (!task.isValid) {
          throw Error.RequestErrorType.MISSING_PROPERTY('Must include a valid `task` object in the request body');
        }

        const taskId = await Interactor.createTask(Task.from(req.body.task), dataStore);
        res.status(201).send(taskId);
      } catch (error) {
        handleError(error, res);
      }
    }

    const updateTask = async (req: Request, res: Response) => {
      try {

        if (!req.body.task) {
          throw Error.RequestErrorType.MISSING_PROPERTY('Must include a partial `task` object in the request body');
        }

        const task: Partial<Task> = Task.from(req.body.task);

        if (task.id && task.id !== req.params.id) {
          throw Error.RequestErrorType.MISMATCHED_PROPERTY('The `id` specified in the route parameter must match the `id` of the update document');
        }

        // if the above check passed, the task might not have an id property on it and it should be added manually
        task.id = req.params.id;

        await Interactor.updateTask(task, dataStore);
        res.sendStatus(204);
      } catch (error) {
        handleError(error, res);
      }
    }

    const deleteTask = async (req: Request, res: Response) => {
      try {
        await Interactor.deleteTask(req.params.id, dataStore);
        res.sendStatus(204);
      } catch (error) {
        handleError(error, res);
      }
    }


    // declare routes
    router.route('/tasks')
      .get(getTasks)
      .post(createTask)

    router.route('/tasks/:id')
      .get(getTask)
      .patch(updateTask)
      .delete(deleteTask)
  }
}

function mapError(error: any): Error.Error {
  if (error instanceof Error.Error) {
    return error;
  }

  console.error(error);

  return new Error.ServiceError();
}

function handleError(e: any, res: Response) {
  const error: Error.Error = mapError(e);
  res.status(error.code).send(error.responsePayload)
}