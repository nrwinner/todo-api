import { Insertable } from './generics/Insertable';
import { UserIdentifier } from './User';

export class Task extends Insertable {
  title: string;
  author: string; // username;
  description?: string;
  date?: Date;
  completed: boolean = false;
  lastUpdated: Date;

  constructor();
  constructor(id: string, author: string, title: string, lastUpdated: Date, description?: string, date?: Date, completed?: boolean);
  constructor(id?: string, author?: string, title?: string, lastUpdated?: Date, description?: string, date?: Date, completed?: boolean) {
    super(id);

    this.author = author;
    this.title = title;
    this.description = description;
    this.date = date;
    this.completed = completed || false;
    this.lastUpdated = lastUpdated;
  }

  get isToday(): boolean {
    const today = new Date();

    return today.getFullYear() === this.date.getFullYear() &&
      today.getMonth() === this.date.getMonth() &&
      today.getDate() === this.date.getDate();
  }

  static from(data: any): Partial<Task> {
    const t = new Task();

    if (data._id) {
      t.id = data._id;
    }

    if (data.id) {
      t.id = data.id;
    }

    if (data.author) {
      t.author = data.author;
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

    if (data.date) {
      if (data.date instanceof Date) {
        t.date = data.date;
      } else {
        t.date = new Date(data.date);
      }
    }

    if (data.lastUpdated) {
      if (data.lastUpdated instanceof Date) {
        t.lastUpdated = data.lastUpdated;
      } else {
        t.lastUpdated = new Date(data.lastUpdated);
      }
    }

    return t;
  }
}