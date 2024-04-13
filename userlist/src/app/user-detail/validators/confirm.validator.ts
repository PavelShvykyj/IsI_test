import { AbstractControl, FormControl, FormGroup, ValidatorFn } from "@angular/forms"
import { User } from "../../../models/user"

export const passwordConfirm: ValidatorFn = (group: AbstractControl) => {
  if(group.get('password')?.value !== group.get('passwordConfirm')?.value) {
    return {confirm: 'passsword confirmation not passes'}
  }

  return null
}
