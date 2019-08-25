export class Error {
  code: number;
  message: string;
  additionalInformation?: string;

  protected constructor(code: number, message: string, additionalInformation?: string) {
    this.code = code;
    this.message = message;
    this.additionalInformation = additionalInformation;
  }

  get responsePayload(): string {
    return this.additionalInformation ? this.message + ': ' + this.additionalInformation : this.message;
  }
}




export class ResourceError extends Error {
  constructor(code: number, message: string, additionalInformation?: string) {
    super(code, message, additionalInformation);
  }
}

export const ResourceErrorType = {
  NOT_FOUND: (additionalInformation?: string) => new ResourceError(404, 'Not Found', additionalInformation)
}




export class RequestError extends Error {
  constructor(code: number, message: string, additionalInformation?: string) {
    super(code, message, additionalInformation);
  }
}

export const RequestErrorType = {
  MISSING_PROPERTY: (additionalInformation?: string) => new RequestError(400, 'Missing Property', additionalInformation),
  MISMATCHED_PROPERTY: (additionalInformation?: string) => new RequestError(400, 'Mismatched Property', additionalInformation),
}




export class ServiceError extends Error {
  message: 'Internal Service Error';

  constructor(additionalInformation?: string) {
    super(500, 'Internal Service Error', additionalInformation);
  }
}