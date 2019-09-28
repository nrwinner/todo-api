export abstract class Insertable {

  constructor(public id: string) { }

  public get insertable(): Omit<Insertable, 'id'> {
    const payload = Object.assign({}, this);
    // always remove id
    delete payload.id;

    // remove null properties
    for (let k in payload) {
      if (payload[k] === null || payload[k] === undefined) {
        delete payload[k];
      }
    }

    return payload;
  }
}