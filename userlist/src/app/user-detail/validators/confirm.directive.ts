import { Directive, input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[passwordConfirm][formGroupName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordConfirmDirective,
      multi: true,
    },
  ],
})
export class PasswordConfirmDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('passwordConfirm');
    return password?.value === confirm?.value ? null : {passConfirmError: 'Password should march'};
  }
}
