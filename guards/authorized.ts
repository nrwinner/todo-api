import { Response } from 'express';
import { handleError } from "../helpers/routing helpers/errors";
import { RequestErrorType } from "../errors/Error";

export function authorized(target: any, name: any, descriptor: any) {
  const original = descriptor.value;

  if (typeof original === 'function') {
    descriptor.value = function(req: Request, res: Response) {
      // TODO implement authorization function
      if (false) {
        handleError(RequestErrorType.UNAUTHENTICATED(), res)
      } else {
        original.apply(this, [ req, res ]);
      }

    }
  }
}