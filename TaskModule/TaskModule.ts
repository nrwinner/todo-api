import { Router, Request, Response } from 'express';
import { DataStore } from '../interfaces/datastore';
import * as Interactor from './TaskInteractor';
import { Task } from '../types/Task';

export class TaskModule {

  public static init(router: Router, dataStore: DataStore) {

    const getTask = async (req: Request, res: Response) => {
      try {
        const task = await Interactor.getTask(req.params.id, dataStore);
        res.send(task);
      } catch (error) {
        // TODO handle errors
        res.status(500).send('your api sucks dude')
      }
    }

    const getTasks = (req: Request, res: Response) => {
      try {
        res.sendStatus(200);
      } catch (error) {
        // TODO handle errors
        res.status(500).send('your api sucks dude')
      }
    }

    const createTask = async (req: Request, res: Response) => {
      try {
        const taskId = await Interactor.createTask(Task.from(req.body.task), dataStore);
        res.status(201).send(taskId);
      } catch (error) {
        res.status(500).send('your api sucks dude')
      }
    }

    const updateTask = async (req: Request, res: Response) => {
      try {
        await Interactor.updateTask(Task.from(req.body.task), dataStore);
        res.sendStatus(204);
      } catch (error) {
        // TODO handle errors
        res.status(500).send('your api sucks dude')
      }
    }

    const deleteTask = async (req: Request, res: Response) => {
      try {
        await Interactor.deleteTask(req.params.id, dataStore);
        res.sendStatus(204);
      } catch (error) {
        // TODO handle errors
        res.status(500).send('your api sucks dude')
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