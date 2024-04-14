import { Component, OnInit, forwardRef, input, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-ui-input',
  templateUrl: './ui-input.component.html',
  styleUrls: ['./ui-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
})
export class UiInputComponent implements ControlValueAccessor, OnInit {

  value: any;
  isDisable = false;
  onChange: any = () => {};
  onTouched: any = () => {};
  type = input<'text' | 'email' | 'password'| 'select'>('text');
  options = input<Array<string>>()
  helper = input<string>()
  formControlName = input.required<string>();
  controlContainer: ControlContainer = inject(ControlContainer);
  control: AbstractControl | null;
  label = input.required<string>();
  required = Validators.required;
  controlErrors = signal<Array<string>>([]);
  parentErrors = signal<Array<string>>([]);
  viewErrors = computed(()=> {return [...this.controlErrors(), ...this.parentErrors()]})
  prefixClass = input<string>('')

  ngOnInit(): void {
    if (this.controlContainer && this.formControlName()) {
      this.control = this.controlContainer.control!.get(this.formControlName()!);
      this.control!.statusChanges.pipe(takeUntilDestroyed()).subscribe(status => {
        if (!!this.control!.errors) {

            const keys = Object.keys(this.control!.errors!);
            this.controlErrors.set(keys)
        } else {
          this.controlErrors.set([])
        }
      })

      this.control!.parent!.statusChanges.pipe(takeUntilDestroyed()).subscribe(status => {
        if (!!this.control!.parent?.errors) {
            const keys = Object.keys(this.control!.parent?.errors);
            this.parentErrors.set(keys)
        } else {
          this.parentErrors.set([])
        }
      })
    }
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisable = isDisabled;
  }
}
