import { toasttype } from "../types/toast-type"

export class Toast {
  message: string = ''
  duration: number = 1000
  type: toasttype = 'succes'
}
