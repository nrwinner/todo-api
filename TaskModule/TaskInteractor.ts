import { DataStore } from "../interfaces/datastore";
import { Task } from "../types/Task";
import { TaskQuery } from "../types/Query";

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

export async function getTasks(query: TaskQuery, dataStore: DataStore): Promise<Task[]> {
  const tasks = await dataStore.getTasks(query);
  return tasks;
}