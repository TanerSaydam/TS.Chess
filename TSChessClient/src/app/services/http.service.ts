import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from '../constants';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private error: ErrorService
  ) { }

  get<T>(endpoint: string, callBack: (res:T) => void, errorCallBack?: ()=> void){
    this.http.get<T>(`${api}/${endpoint}`,{
      headers: {
        "Authorization": `Bearer `
      }
    }).subscribe({
      next: (res)=> {
        callBack(res);
      },
      error: (err: HttpErrorResponse) => {
        if(errorCallBack){
          errorCallBack();
        }
      }
    })
  }

  post<T>(endpoint: string, data:any, callBack: (res:T) => void, errorCallBack?: ()=> void){
    this.http.post<T>(`${api}/${endpoint}`,data,{
      headers: {
        "Authorization": `Bearer `
      }
    }).subscribe({
      next: (res)=> {
        callBack(res);
      },
      error: (err: HttpErrorResponse) => {
        if(errorCallBack){
          errorCallBack();
        }
        this.error.errorHandler(err);
      }
    })
  }
}
