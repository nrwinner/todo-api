import { DataStore } from "../interfaces/datastore";
import { Task } from "../types/Task";

export async function createTask(task: Partial<Task>, dataStore: DataStore): Promise<string> {
  const resultId = await dataStore.createTask(task);
  return resultId;
}

export async function updateTask(task: Partial<Task>, dataStore: DataStore): Promise<void> {
  await dataStore.updateTask(task);
}

export async function getTask(taskId: string, dataStore: DataStore): Promise<Task> {
  const task = await dataStore.getTask(taskId);
  return task;
}

export async function deleteTask(taskId: string, dataStore: DataStore): Promise<void> {
  await dataStore.deleteTask(taskId);
}