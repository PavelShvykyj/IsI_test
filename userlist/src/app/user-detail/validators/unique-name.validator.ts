import { UserDataService } from '../../services/user-data.service';
import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UniqueNameValidator implements AsyncValidator {
  usersService = inject(UserDataService);

  validate(
    control: AbstractControl<any, any>
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.usersService.NameExists(control.get('username')?.value).pipe(
      map((res) => {
        return !res
          ? null
          : res === control.get('id')?.value
          ? null
          : { uniqueNameError: 'Name is taken' };
      })
    );
  }
}
