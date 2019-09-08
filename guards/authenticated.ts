import { Response } from 'express';
import { RequestErrorType } from "../errors/Error";
import { handleError } from "../helpers/routing helpers/errors";

export function authenticated(target: any, name: any, descriptor: any) { 
  const original = descriptor.value;

  if (typeof original === 'function') {
    descriptor.value = function(req: Request, res: Response) {
      if (!req['user']) {
        handleError(RequestErrorType.UNAUTHENTICATED(), res)
      } else {
        original.apply(this, [ req, res ]);
      }

    }
  }
  
  return descriptor;
}