import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlexiToastService } from 'flexi-toast';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private toast: FlexiToastService
  ) { }

  errorHandler(err: HttpErrorResponse){
    console.log(err);
    this.toast.showToast("Error", "Something went wrong", "error")

    switch (err.status) {
      case 0:        
        break;
    
      default:
        break;
    }
    
  }
}
