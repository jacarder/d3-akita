import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FriendQuery } from 'src/app/friend/state/friend.query';
import { FriendService } from 'src/app/friend/state/friend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  loading$ = this.friendQuery.selectLoading();
  friends$ = this.friendQuery.selectAll();
  subscriptions: Subscription = new Subscription();

  constructor(
    private friendQuery: FriendQuery,
    private friendService: FriendService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.friendService.get().subscribe()
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
