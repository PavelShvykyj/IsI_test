import { Injectable } from '@angular/core';
import { Toast } from '../../models/toast';
import { v4 as uuid4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toasts: Map<string,Toast> = new Map();
  private _ids: Array<string> = []

  get ids() : Array<string> {
    return [...this._ids]
  }

  get toasts() {
    return new Map(this._toasts);
  }

  constructor() {}

  private add(message: Toast) {
    const id = uuid4();

    this._toasts.set(id,message)
    this._ids.push(id);
    setTimeout(() => this.remove(id), message.duration);
  }

  remove(id: string) {
    if (this._toasts.has(id)) {
      this._ids.splice(this._ids.indexOf(id),1);
      this._toasts.delete(id);
    }
  }

  errorMessage(message: string, duration = 3000) {
    const toast = new Toast();
    toast.duration = duration;
    toast.message = message;
    toast.type = 'error';
    this.add(toast)
  }

  succesMessage(message: string, duration = 1500) {
    const toast = new Toast();
    toast.duration = duration;
    toast.message = message;
    toast.type = 'succes';
    this.add(toast)
  }

}
