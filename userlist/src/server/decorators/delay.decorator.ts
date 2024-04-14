import { delay } from "rxjs";

export function Delay(duration: number = 600) {
  return function(prototype: any, name: string , descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any)  {
      return originalMethod.apply(this, args).pipe(delay(duration));
    };
  }
}
