import { FormArray } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

// export function ValidateFields(formGroup: FormGroup){
//     return Object.keys(formGroup.controls).forEach(field => {          
//             const control = formGroup.get(field);
//             if (control instanceof FormControl) {
//                 control.markAsTouched({ onlySelf: true });
//             } else if (control instanceof FormGroup) {
//                 this.validateAllFormFields(control);
//             }
//         });
// }

export function  ValidateFields(formToInvestigate:FormGroup|FormArray) {
        
    return  Object.keys(formToInvestigate.controls).forEach(field => { 
        const control = formToInvestigate.get(field);
        
        if (control instanceof FormGroup) {
            ValidateFields(control);
        } else if (control instanceof FormArray) {
            ValidateFields(control);
        }     
        else if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
        }   
      });
    
    //recursiveFunc(formToInvestigate);
   
  }