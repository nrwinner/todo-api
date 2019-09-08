import * as Error from '../../errors/Error';
import { Response } from 'express';

export function mapError(error: any): Error.Error {
  if (error instanceof Error.Error) {
    return error;
  }

  console.log(error);

  return new Error.ServiceError();
}

export function handleError(e: any, res: Response) {
  const error: Error.Error = mapError(e);
  res.status(error.code).send(error.responsePayload)
}