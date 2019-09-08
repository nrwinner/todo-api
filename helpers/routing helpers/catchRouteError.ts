export function CatchRouteError(handler: Function) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // save a reference to the original method
    const originalMethod = descriptor.value
  
    // rewrite original method with custom wrapper
    descriptor.value = function(req: Request, res: Response) {
      try {
        const result = originalMethod.apply(this, [ req, res ])
  
        // check if method is asynchronous
        if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
          // return promise
          return result.catch((error: any) => {
            handler(error, res)
          })
        }
  
        // return actual result
        return result
      } catch (error) {
        handler(error, res)
      }
    }
  
    return descriptor
  }
}