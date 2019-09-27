import { TaskDataStore } from "./TaskDataStore";
import { Task } from "../../types/Task";
import { TaskQuery } from "../../types/Query";
import { TaskMongoDriver } from "./TaskMongoDriver";

export class TaskInteractor {
  constructor(private dataStore: TaskDataStore = new TaskMongoDriver()) { }

  async createTask(task: Partial<Task>): Promise<string> {
    const resultId = await this.dataStore.createTask(task);
    return resultId;
  }
  
  async updateTask(task: Partial<Task>): Promise<void> {
    await this.dataStore.updateTask(task);
  }
  
  async getTask(taskId: string): Promise<Task> {
    const task = await this.dataStore.getTask(taskId);
    return task;
  }
  
  async deleteTask(taskId: string): Promise<void> {
    await this.dataStore.deleteTask(taskId);
  }
  
  async getTasks(query: TaskQuery): Promise<Task[]> {
    const tasks = await this.dataStore.getTasks(query);
    return tasks;
  }
}
