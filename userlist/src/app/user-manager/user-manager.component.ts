import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { User } from '../../models/user';
import { UserListComponent } from '../user-list/user-list.component';
import { ToastService } from '../services/toast-service.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {

  selectedUser = signal<User | undefined>(undefined)
  @ViewChild(UserListComponent)
  list: UserListComponent
  toastService = inject(ToastService)

  constructor() { }

  ngOnInit() {
  }

  OnDataSubmited() {
    this.list.Refresh();
  }
}
