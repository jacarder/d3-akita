import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import cuid from 'cuid';
import { FriendValidation } from '../models/friend.validation';
import { Friend } from '../state/friend.model';
import { FriendQuery } from '../state/friend.query';
import { FriendService } from '../state/friend.service';

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

  constructor(private friendQuery: FriendQuery, private friendService: FriendService) { }

  ngOnInit(): void {
    this.addFriendForm = new FormGroup({
      friendName: new FormControl('', [Validators.required]),
      friendAge: new FormControl('', [
        Validators.required, 
        Validators.min(FriendValidation.MinMaxAge.MIN),
        Validators.max(FriendValidation.MinMaxAge.MAX)
      ]),
      friendWeight: new FormControl('', [
        Validators.required,
        Validators.min(FriendValidation.MinMaxWeight.MIN),
        Validators.max(FriendValidation.MinMaxWeight.MAX)
      ]),
      friendList: new FormControl([])
    })
  }

  getInputValidators = () => {}

  addFriend = () => {
    if(this.addFriendForm.valid) {
      let friend: Friend = {
        id: cuid(),
        name: this.friendName.value,
        age: this.friendAge.value,
        weight: this.friendWeight.value,
        friendList: this.friendList.value
      }
      this.friendService.add(friend)
      this.addFriendForm.reset();
    }
  }

}
