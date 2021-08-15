import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Friend } from './friend.model';

export interface FriendState extends EntityState<Friend> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'friend' })
export class FriendStore extends EntityStore<FriendState> {

  constructor() {
    super();
  }

}
