export interface Query {
  limit?: number;
  offset?: number;
}

export interface TaskQuery extends Query {
  taskId?: string;
  title?: string;
  description?: string;
  dueDate?: Date;
  todoDate?: Date;
}