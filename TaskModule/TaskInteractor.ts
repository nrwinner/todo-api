import { TaskDataStore } from "./TaskDataStore";
import { Task } from "../types/Task";
import { TaskQuery } from "../types/Query";

export async function createTask(task: Partial<Task>, dataStore: TaskDataStore): Promise<string> {
  const resultId = await dataStore.createTask(task);
  return resultId;
}

export async function updateTask(task: Partial<Task>, dataStore: TaskDataStore): Promise<void> {
  await dataStore.updateTask(task);
}

export async function getTask(taskId: string, dataStore: TaskDataStore): Promise<Task> {
  const task = await dataStore.getTask(taskId);
  return task;
}

export async function deleteTask(taskId: string, dataStore: TaskDataStore): Promise<void> {
  await dataStore.deleteTask(taskId);
}

export async function getTasks(query: TaskQuery, dataStore: TaskDataStore): Promise<Task[]> {
  const tasks = await dataStore.getTasks(query);
  return tasks;
}