import { Component, ModelSignal, OnInit, WritableSignal, inject, model, signal } from '@angular/core';
import { User } from '../../models/user';
import { UserDataService } from '../services/user-data.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  data: WritableSignal<Array<User>> = signal([]);
  selected = model<User>();
  userService = inject(UserDataService)

  constructor() { }

  ngOnInit() {
    this.Refresh();
  }

  Refresh() {
    this.userService.GetUsers().pipe(take(1)).subscribe(data=>{
      this.data.set(data);
    })
  }

  OnRowClick(data: User) {
    this.selected.set(data);
  }

}
