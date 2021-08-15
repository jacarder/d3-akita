import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FriendQuery } from '../state/friend.query';

@Component({
  selector: 'add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent implements OnInit {
  friends$ = this.friendQuery.selectAll();
  addFriendForm: FormGroup;

  get friendName() {
    return this.addFriendForm.get('friendName') as FormControl;
  }
  get friendAge() {
    return this.addFriendForm.get('friendAge') as FormControl;
  }
  get friendWeight() {
    return this.addFriendForm.get('friendWeight') as FormControl;
  }
  get friendList() {
    return this.addFriendForm.get('friendList') as FormControl;
  }

  constructor(private friendQuery: FriendQuery) { }

  ngOnInit(): void {
    this.addFriendForm = new FormGroup({
      friendName: new FormControl('', [Validators.required]),
      friendAge: new FormControl('', [Validators.required]),
      friendWeight: new FormControl('', [Validators.required]),
      friendList: new FormControl(null, [Validators.required])
    })
  }

  addFriend = () => {

  }

}
