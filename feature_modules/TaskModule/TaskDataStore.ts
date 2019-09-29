import { Task } from '../../types/Task';
import { TaskQuery } from '../../types/Query';
import { UserIdentifier } from '../../types/User';

export interface TaskDataStore {
  getTask(taskId: string, author: string): Promise<Task>;
  getTasks(query: TaskQuery, author: string): Promise<Task[]>;

  createTask(task: Partial<Task>): Promise<string>;
  updateTask(task: Partial<Task>, author: string): Promise<void>;
  deleteTask(taskId: string, author: string): Promise<void>;
}