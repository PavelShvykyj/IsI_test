import { Injectable, Signal, effect, signal } from '@angular/core';
import { User } from '../models/user';
import { Observable, map, of } from 'rxjs';
import { ServerAPI } from './interfaces/server-api.interface';
import { Delay } from './decorators/delay.decorator';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { v4 as uuid4 } from 'uuid';
function sortByName(a: User, b: User): number {
  return a.username.localeCompare(b.username);
}



const STORAGE_ITEM_NAME = 'userData';

@Injectable({ providedIn: 'root' })
export class UserApiService implements ServerAPI<User> {
  private data = signal<EntityState<User> | null>(null);
  private adapter: EntityAdapter<User> = createEntityAdapter<User>({
    sortComparer: sortByName,
  });
  private selectUserIds;
  private selectUserEntities;
  private selectUserAll;
  private selectUserTotal;

  constructor() {
    const saveddata = localStorage.getItem(STORAGE_ITEM_NAME);
    if (!!saveddata) {
      this.data.set(JSON.parse(saveddata));
    } else {
      this.data.set(this.adapter.getInitialState());
    }

    effect(() => {
      localStorage.setItem(STORAGE_ITEM_NAME, JSON.stringify(this.data()));
    });

    const {
      selectIds,
      selectEntities,
      selectAll,
      selectTotal,
    } = this.adapter.getSelectors();

    this.selectUserIds = selectIds;
    this.selectUserEntities = selectEntities;
    this.selectUserAll = selectAll;
    this.selectUserTotal = selectTotal;

  }

  @Delay(1000)
  apiExist(id: string): Observable<boolean> {
    const users = this.selectUserEntities(this.data() as EntityState<User>);
    return of(users.hasOwnProperty(id));
  }

  @Delay(1000)
  apiExistName(name: string): Observable<string | undefined> {
    const state = this.data()!;
    const users = this.selectUserAll(state);
    const ind = users.findIndex(el=> el.username.toUpperCase().trim() === name.toUpperCase().trim());
    if (ind === -1) {
      return of(undefined);
    }

    return of(users[ind].id)
  }

  @Delay()
  apiGet(id: string): Observable<User| undefined> {
    const state = this.data()!;
    return of(this.selectUserEntities(state)[id])
  }

  @Delay()
  apiPost(item: User): Observable<User> {
    item.id = uuid4();
    const state = this.data()!;
    this.data.set(this.adapter.addOne(item,state));
    return this.apiGet(item.id).pipe(map(el => el as User));
  }

  @Delay()
  apiUpdate(id: string, data: Partial<User>): Observable<User> {
    const state = this.data()!;
    const changes = {
      id: id,
      changes: data
    }
    this.data.set(this.adapter.updateOne(changes,state))
    return this.apiGet(id).pipe(map(el => el as User));
  }

  @Delay()
  apiDelete(id: string): Observable<boolean> {
    const state = this.data()!;
    this.data.set(this.adapter.removeOne(id, state));
    return of(true);
  }

  @Delay(1000)
  apiList(): Observable<User[]> {
    return of(this.selectUserAll(this.data() as EntityState<User>));
  }
}
