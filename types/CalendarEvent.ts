import { Insertable } from './generics/Insertable';

export class CalendarEvent extends Insertable {
  title: string;
  description?: string;
  date: Date;
  lastUpdated: Date;

  constructor();
  constructor(id: string, title: string, description?: string, date?: Date, lastUpdated?: Date);
  constructor(id?: string, title?: string, description?: string, date?: Date, lastUpdated?: Date) {
    super(id);

    this.title = title;
    this.description = description;
    this.date = date;
    this.lastUpdated = lastUpdated;
  }

  get isToday(): boolean {
    const today = new Date();

    return today.getFullYear() === this.date.getFullYear() &&
      today.getMonth() === this.date.getMonth() &&
      today.getDate() === this.date.getDate();
  }

  static from(data: any) {
    const e = new CalendarEvent();

    if (data._id) {
      e.id = data._id;
    }

    if (data.id) {
      e.id = data.id;
    }

    if (data.title) {
      e.title = data.title;
    }

    if (data.date) {
      if (data.date instanceof Date) {
        e.date = data.date;
      } else {
        e.date = new Date(data.date);
      }
    }

    if (data.lastUpdated) {
      if (data.lastUpdated instanceof Date) {
        e.lastUpdated = data.lastUpdated;
      } else {
        e.lastUpdated = new Date(data.lastUpdated);
      }
    }

    return e;
  }
}