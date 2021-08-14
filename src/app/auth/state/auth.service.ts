import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthState, AuthStore } from './auth.store';
import { catchError, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private authStore: AuthStore, private httpClient: HttpClient) {
  }

  login(username: string) {
    let authState: AuthState = {
      username: username, 
      isLoggedIn: true
    }
    //  Placeholder for api call
    return of('').pipe(
      take(1), // used to mock finite http call
      tap(() => {
        this.authStore.update(authState)
      }),
      catchError((error) => {
        this.authStore.setError(error)
        throw error;
      })
    )
  }

}
