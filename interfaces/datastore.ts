import { Task } from '../types/Task';
import { TaskQuery } from '../types/Query';

export interface DataStore {
  getTask(taskId: string): Promise<Task>;
  getTasks(query: TaskQuery): Promise<Task[]>;

  createTask(task: Partial<Task>): Promise<string>;
  updateTask(task: Partial<Task>): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
}