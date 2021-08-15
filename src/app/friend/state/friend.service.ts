import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Friend } from './friend.model';
import { FriendStore } from './friend.store';

@Injectable({ providedIn: 'root' })
export class FriendService {

  constructor(private friendStore: FriendStore, private http: HttpClient) {
  }


  get(): Observable<Friend[]> {
    this.friendStore.setLoading(true);
    //  Mock existing list of friends
    let friends: Friend[] = [
      {
        name: 'Bob',
        age: 29,
        weight: 200,
      },
      {
        name: 'Bob1',
        age: 30,
        weight: 210,
      },
      {
        name: 'Bob2',
        age: 40,
        weight: 180,
      },
    ]
    return of(friends).pipe(
      tap(
        (friends) => {
          this.friendStore.set(friends);
          this.friendStore.setLoading(false);
        }
      ),
      catchError(
        (error) => {
          this.friendStore.setError(error);
          this.friendStore.setLoading(false);
          throw error;
        }
      )
    )
  }

  add(friend: Friend) {
    this.friendStore.add(friend);
  }

  // update(id, friend: Partial<Friend>) {
  //   this.friendStore.update(id, friend);
  // }

  remove(id: ID) {
    this.friendStore.remove(id);
  }

}
