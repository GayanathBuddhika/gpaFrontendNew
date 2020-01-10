import { FormGroup, FormControl } from '@angular/forms';

export class ErrorDisplayBaseComponent{
    form: FormGroup;

    constructor(){
    }

    isFieldValid(field: string) {
       
      return !this.form.get(field).valid && this.form.get(field).touched;
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
  
    displayFieldCss(field: string) {
      return {
        'has-error': this.isFieldValid(field),
        'has-feedback': this.isFieldValid(field)
      };
    }
}