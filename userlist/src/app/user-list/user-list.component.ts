import { Component, ModelSignal, OnInit, ViewChild, WritableSignal, inject, model, signal } from '@angular/core';
import { User } from '../../models/user';
import { UserDataService } from '../services/user-data.service';
import { take } from 'rxjs';
import { ToastService } from '../services/toast-service.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild(UserListComponent)
  list: UserListComponent
  data: WritableSignal<Array<User>> = signal([]);
  selectedUser = signal<User| undefined>(undefined);
  showDetails = signal<boolean>(false);
  userService = inject(UserDataService)
  toastService = inject(ToastService)

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
    this.selectedUser.set(data);
    this.showDetails.set(true);
  }

  Create() {
    this.selectedUser.set(undefined);
    this.showDetails.set(true);
  }

  OnDataSubmited() {
    this.Refresh();
  }
}
