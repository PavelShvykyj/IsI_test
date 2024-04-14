import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { ServerAPI } from '../server/interfaces/server-api.interface';
import { User } from '../models/user';
import { UserApiService } from '../server/user-api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './toast/toast.component';
import { UniqueNameDirective } from './user-detail/validators/unique-name.directive';
import { PasswordConfirmDirective } from './user-detail/validators/confirm.directive';

export const USER_API_PROVIDER = new InjectionToken<ServerAPI<User>>('user-api-provider')

@NgModule({
  declarations: [
    AppComponent,
      UserListComponent,
      UserDetailComponent,
      UserManagerComponent,
      ToastComponent,
      UniqueNameDirective,
      PasswordConfirmDirective
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide : USER_API_PROVIDER,
      useExisting: UserApiService
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
