import { usertype } from './../../types/user-type';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  effect,
  inject,
  model,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../../models/user';
import { UserDataService } from '../services/user-data.service';
import { filter, take } from 'rxjs';
import { ToastService } from '../services/toast-service.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user = model<User>();
  showDetails = model<boolean>();
  userId = computed(() => {
    const user = this.user();
    if (!!user) {
      return user.id;
    }
    return '';
  });

  userTypeValues = ["Admin" , "Driver"];
  private toastService = inject(ToastService);
  private userservice = inject(UserDataService);
  private fb = inject(FormBuilder);

  formGroup: FormGroup = this.fb.group({
    id: [null],
    username: ['', { validators: Validators.required, updateOn: 'blur' }],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    passwordGroup: this.fb.group({
      password: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(RegExp('^(?=.*[0-9])(?=.*[a-z])([a-z0-9_-]+)$')),
          ],
          updateOn: 'blur',
        },
      ],
      passwordConfirm: ['', Validators.required],
    }),
    user_type: new FormControl<usertype>('Driver', [Validators.required]),
  });

  @Output()
  OnDataSubmited = new EventEmitter();

  constructor() {
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
            this.formGroup.reset({ ...userData }, { emitEvent: false });
          });
      } else {
        this.formGroup.reset({ emitEvent: false });
      }
    });
  }

  ngOnInit() {}

  Submit() {
    if (this.formGroup.invalid) {
      this.toastService.errorMessage('Form filled iccorrectly...');
      return;
    }

    let userData = { ...this.formGroup.getRawValue() };
    delete userData.passwordConfirm;

    let model: User = Object.assign(new User(), userData);
    model.password = userData.passwordGroup.password;
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
        this.toastService.succesMessage('Done');
      },
      error: (err) => {
        this.toastService.errorMessage('Errors on submit');
      },
      complete: () => {
        this.OnDataSubmited.emit();
      },
    });
  }

  DeleteUser() {
    const id = this.userId();
    if (!!id) {
      this.userservice
        .DeleteUser(id)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.user.set(undefined);
            this.toastService.succesMessage('Done');
          },
          error: (err) => {
            this.toastService.errorMessage('Errors on deletion');
          },
          complete: () => {
            this.OnDataSubmited.emit();
          },
        });
    }
  }

  Close() {
    this.showDetails.set(false);
  }
}
