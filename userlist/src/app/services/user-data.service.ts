import { Injectable, inject } from '@angular/core';
import { USER_API_PROVIDER } from '../app.module';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private apiProvider = inject(USER_API_PROVIDER)

  constructor() { }

  GetUsers() : Observable<Array<User>> {
    return this.apiProvider.apiList()
  }

  DeleteUser(name: string): Observable<boolean> {
    return this.apiProvider.apiDelete(name)
  }

  EditUser(id: string, data: Partial<User>): Observable<User> {
    return this.apiProvider.apiUpdate(id,data)
  }

  GetUser(id: string): Observable<User | undefined> {
    return this.apiProvider.apiGet(id)
  }

  CreateUser(data: User): Observable<User> {
    return this.apiProvider.apiPost(data)
  }


  NameExists(name: string) : Observable<string | undefined> {
    return this.apiProvider.apiExistName(name);
  }
}
