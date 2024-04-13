import { Observable } from "rxjs";


export interface ServerAPI<T>  {
  apiGet(id: string) : Observable<T>
  apiPost(item: T) : Observable<T>
  apiUpdate(id: string, data: Partial<T>): Observable<T>
  apiDelete(id: string) : Observable<boolean>
  apiList() : Observable<Array<T>>
  apiExist(id: string) : Observable<boolean>
}
