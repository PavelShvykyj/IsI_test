import { UserDataService } from '../../services/user-data.service';
import { Directive, Injectable, Input, inject, input } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable, map } from 'rxjs';

@Directive({
  selector: '[UniqueName][formControlName]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UniqueNameDirective,
      multi: true,
    },
  ],
})
export class UniqueNameDirective implements AsyncValidator {
  itemId = input.required<string>()

  usersService = inject(UserDataService);


  validate(
    control: AbstractControl<any, any>
  ):  Observable<ValidationErrors | null> {
    return this.usersService.NameExists(control.value).pipe(
      map((res) => {
        return !res
          ? null
          : res === this.itemId()
          ? null
          : { uniqueNameError: 'Name is taken' };
      })
    );
  }
}
