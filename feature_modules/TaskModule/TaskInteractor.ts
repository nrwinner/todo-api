import { TaskDataStore } from "./TaskDataStore";
import { Task } from "../../types/Task";
import { TaskQuery } from "../../types/Query";
import { TaskMongoDriver } from "./TaskMongoDriver";
import { RequestErrorType } from "../../errors/Error";

export class TaskInteractor {
  constructor(private dataStore: TaskDataStore = new TaskMongoDriver()) { }

  async createTask(task: Partial<Task>, author: string): Promise<string> {
    if (task.author !== author) {
      throw RequestErrorType.MISMATCHED_PROPERTY('The author of the task does not match the the username in the route.');
    }

    const resultId = await this.dataStore.createTask(task);
    return resultId;
  }
  
  async updateTask(task: Partial<Task>, author: string): Promise<void> {
    await this.dataStore.updateTask(task, author);
  }
  
  async getTask(taskId: string, author: string): Promise<Task> {
    const task = await this.dataStore.getTask(taskId, author);
    return task;
  }
  
  async deleteTask(taskId: string, author: string): Promise<void> {
    await this.dataStore.deleteTask(taskId, author);
  }
  
  async getTasks(query: TaskQuery, author: string): Promise<Task[]> {
    const tasks = await this.dataStore.getTasks(query, author);
    return tasks;
  }
}
