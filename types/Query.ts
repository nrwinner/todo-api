export interface Query {
  limit?: number;
  offset?: number;
}

export interface TaskQuery extends Query {
  title?: string;
  description?: string;
  dueDate?: Date;
  todoDate?: Date;
}

export namespace CreateQuery {
  export function from(data: any): Query {
    const q = {} as Query;

    if (data.limit) {
      q.limit = parseInt(data.limit, 10);
    }

    if (data.offset) {
      q.offset = parseInt(data.offset, 10);
    }

    return q;
  }

  export function taskQueryFrom(data: any): TaskQuery {
    const q = from(data) as TaskQuery;

    if (data.title) {
      q.title = data.title;
    }
  
    if (data.description) {
      q.description = data.description;
    }
  
    if (data.dueDate) {
      if (data.dueDate instanceof Date) {
        q.dueDate = data.dueDate;
      } else {
        q.dueDate = new Date(data.dueDate);
      }
    }
  
    if (data.todoDate) {
      if (data.todoDate instanceof Date) {
        q.todoDate = data.todoDate;
      } else {
        q.todoDate = new Date(data.todoDate);
      }
    }
  
    return q;
  }
}