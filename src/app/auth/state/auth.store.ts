import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface AuthState {
   username: string;
   isLoggedIn: boolean;
}

export function createInitialState(): AuthState {
  return {
    username: '',
    isLoggedIn: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends Store<AuthState> {

  constructor() {
    super(createInitialState());
  }

}
