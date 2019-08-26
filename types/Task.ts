export class Task {
  id?: string;
  title: string;
  description?: string;
  dueDate?: Date;
  todoDate?: Date;
  completed: boolean = false;

  constructor();
  constructor(id: string, title: string, description?: string, dueDate?: Date, todoDate?: Date, completed?: boolean);
  constructor(id?: string, title?: string, description?: string, dueDate?: Date, todoDate?: Date, completed?: boolean) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.todoDate = todoDate;
    this.completed = completed;
  }

  get shouldDoToday(): boolean {
    const today = new Date();

    return today.getFullYear() === this.todoDate.getFullYear() &&
      today.getMonth() === this.todoDate.getMonth() &&
      today.getDate() === this.todoDate.getDate();
  }

  get isDueToday(): boolean {
    const today = new Date();

    return today.getFullYear() === this.dueDate.getFullYear() &&
      today.getMonth() === this.dueDate.getMonth() &&
      today.getDate() === this.dueDate.getDate();
  }

  get isValid(): boolean {
    if (!this.title || (!this.dueDate && !this.todoDate)) {
      return false;
    }

    return true;
  }

  get insertableTask(): Omit<Task, 'id'> {
    const t = Object.assign({}, this) as Task;
    // always remove id
    delete t.id;

    // remove null properties
    for (let k in t) {
      if (t[k] === null || t[k] === undefined) {
        delete t[k];
      }
    }

    return t;
  }

  static from(data: any): Partial<Task> {
    const t = new Task();

    if (data._id) {
      t.id = data._id;
    }

    if (data.id) {
      t.id = data.id;
    }

    if (data.title) {
      t.title = data.title;
    }

    if (data.description) {
      t.description = data.description;
    }

    if (data.completed) {
      t.completed = data.completed;
    }

    if (data.dueDate) {
      if (data.dueDate instanceof Date) {
        t.dueDate = data.dueDate;
      } else {
        t.dueDate = new Date(data.dueDate);
      }
    }

    if (data.todoDate) {
      if (data.todoDate instanceof Date) {
        t.todoDate = data.todoDate;
      } else {
        t.todoDate = new Date(data.todoDate);
      }
    }

    return t;
  }
}