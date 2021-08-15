import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FriendStore, FriendState } from './friend.store';

@Injectable({ providedIn: 'root' })
export class FriendQuery extends QueryEntity<FriendState> {

  constructor(protected store: FriendStore) {
    super(store);
  }

}
