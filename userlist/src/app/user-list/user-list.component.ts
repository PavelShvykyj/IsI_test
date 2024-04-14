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
  showDetails = model<boolean>();
  userService = inject(UserDataService)
  showSplash = signal<boolean>(false);

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
    const selected = this.selected();
    if (this.showDetails() && !!selected && data.id !== selected?.id ) {
      this.hailightSelected()
      return
    }
    this.selected.set(data);
    this.showDetails.set(true);
  }

  hailightSelected() {
    this.showSplash.set(true);
    setTimeout(() => {
      this.showSplash.set(false);
    }, 1000);
  }
}
