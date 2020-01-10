import { environment } from 'src/environments/environment';
import { AuthService } from './../../../core/auth.service';
import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ValidateFields } from 'src/app/function/validate-fields';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],

})
export class ForgotPasswordComponent implements OnInit {

    // --- Form of ForgotPassword
    forgotPasswordForm: FormGroup;

    // --- Get the successful message
    successfulMsg = "";
    errorMsg = '';
    backgroundImg = environment.subDomainUrl + '../../../../assets/dist/sign-up-forms/forgot2.png'
    constructor(private formBuilder: FormBuilder, private authService:AuthService,public toastr: ToastrManager, ) { 
    //    document.getElementsByTagName( 'html' )[0].setAttribute( 'style', 'background-color: #27b7e8' ); 
    }

    ngOnInit() {
        

        this.forgotPasswordForm=this.formBuilder.group({
            email: ["",  [Validators.required, Validators.email]],
        }
        )
    }

    onSubmit(){
      //  this.validateAllFormFields(this.forgotPasswordForm); 
        ValidateFields(this.forgotPasswordForm)
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        this.authService.resetPassword(this.forgotPasswordForm.get('email').value).then(() =>{
            this.successfulMsg = 'A password reset link has been sent to your email address';
            this.errorMsg = '';
        }, 
            (rejectionReason) => {
                this.errorMsg=rejectionReason;
                this.successfulMsg ='';
            })
          .catch(err =>  this.toastr.errorToastr(err, "Error", {position: "bottom-right", animate: "slideFromBottom"}) );     
    }

    
    isFieldValid(field: string) {
        return !this.forgotPasswordForm.get(field).valid && this.forgotPasswordForm.get(field).touched;
    }

    // validateAllFormFields(formGroup: FormGroup) {
    //     Object.keys(formGroup.controls).forEach(field => {          
    //         const control = formGroup.get(field);
    //         if (control instanceof FormControl) {
    //             control.markAsTouched({ onlySelf: true });
    //         } else if (control instanceof FormGroup) {
    //             this.validateAllFormFields(control);
    //         }
    //     });
    // }
    
    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

}
