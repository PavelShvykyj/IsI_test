import {
  Component,
  EventEmitter,
  Input,
  ModelSignal,
  OnInit,
  Output,
  computed,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../../models/user';
import { usertype } from '../../types/user-type';
import { UserDataService } from '../services/user-data.service';
import { filter, take } from 'rxjs';
import { UniqueNameValidator } from './validators/unique-name.validator';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user = model<User>();
  userId = computed(() => {
    const user = this.user();
    if (!!user) {
      return user.id;
    }
    return '';
  });


  private userservice = inject(UserDataService);
  nameValidator = inject(UniqueNameValidator);

  private fb = inject(FormBuilder);
  formGroup: FormGroup = this.fb.group({
    id: [null],
    username: ['', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(RegExp('^(?=.*[0-9])(?=.*[a-z])([a-z0-9_-]+)$')),
      ],
    ],
    passwordConfirm: ['', Validators.required],
    user_type: new FormControl<usertype>('Driver', [Validators.required]),
  });

  @Output()
  OnDataSubmited = new EventEmitter()

  constructor() {
    this.formGroup.addAsyncValidators([
      this.nameValidator.validate.bind(this.nameValidator),
    ]);

    effect(() => {
      const id = this.userId();
      if (!!id) {
        this.userservice
          .GetUser(id)
          .pipe(
            filter((el) => !!el),
            take(1)
          )
          .subscribe((userData) => {
            this.formGroup.reset({ ...userData });
          });
      } else {
        this.formGroup.reset();
      }
    });
  }

  ngOnInit() {}

  Submit() {
    let userData = { ...this.formGroup.getRawValue() };
    delete userData.passwordConfirm;

    let model: User = Object.assign(new User(), userData);
    const id = this.userId();

    let submitresult$;
    if (!id) {
      submitresult$ = this.userservice.CreateUser(model);
    } else {
      submitresult$ = this.userservice.EditUser(id, model);
    }

    submitresult$.pipe(take(1)).subscribe({
      next: (res) => {
        this.user.set(res);
      },
      error: (err) => {
        console.log('error on submin', JSON.parse(err));
      },
      complete: ()=> {
        this.OnDataSubmited.emit();
      }
    });
  }
}
