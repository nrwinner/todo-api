import { RequestErrorType } from "../errors/Error";

export function authenticated(target: any, name: any, descriptor: any) { 
  const original = descriptor.value;

  if (typeof original === 'function') {
    descriptor.value = async function(data: { user?: any }, ...args: []) {
      if (!data['user']) {
        throw RequestErrorType.UNAUTHENTICATED()
      } else {
        return original.apply(this, [ data, ...args ]);
      }

    }
  }
  
  return descriptor;
}