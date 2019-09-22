import { RequestErrorType } from '../errors/Error';
import { AccessGroup } from '../types/User';

export class AuthorizationType {
  private _user?: any;
  private _params?: { identifier?: string };
  private _identifier?: any;

  constructor(data: { user?: any, params?: { identifier?: string }, identifier?: string }) {
    this._user = data.user;
    this._params = data.params;;
    this._identifier = data.identifier;;
  }

  get isValid(): boolean {
    return (this._params && this._params.identifier) || this._identifier;
  }

  get ownerIdentifier(): string {
    return this._params ? this._params.identifier : this._identifier;
  }

  get user(): any {
    return this._user;
  }
}

export function authorized(...accessGroups: AccessGroup[]) {
  return (target: any, name: any, descriptor: any) => {
    const original = descriptor.value;

    if (typeof original === 'function') {
      descriptor.value = function(data: Partial<AuthorizationType> , ...args: any[]) {

        const auth = new AuthorizationType(data);
        const owner = auth.ownerIdentifier;
        const requester = auth.user;

        if (requester) {
          if (
            requester.id === owner ||
            requester.username === owner ||
            (
              accessGroups &&
              requester.accessGroups &&
              requester.accessGroups.filter((a: AccessGroup) => accessGroups.includes(a)).length
            )
          ) {
            return original.apply(this, [ data, ...args ]);
          } else {
            throw RequestErrorType.UNAUTHORIZED();
          }
        } else {
          throw RequestErrorType.UNAUTHORIZED();
        }

      }
    }

    return descriptor;
  }
}