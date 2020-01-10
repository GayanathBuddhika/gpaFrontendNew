import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorDisplayService {

  constructor() { }

  isFieldValid(field: string,form: FormGroup) {
      
    return !form.get(field).valid && form.get(field).touched;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
    
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  displayFieldCss(field: string,form: FormGroup) {
    return {
      'has-error': this.isFieldValid(field,form),
      'has-feedback': this.isFieldValid(field,form)
    };
  }
  
}
