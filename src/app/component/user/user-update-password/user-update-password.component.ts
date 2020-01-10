import { AuthService } from 'src/app/core/auth.service';
import { MustMatch } from 'src/app/function/mustMatch';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-user-update-password',
  templateUrl: './user-update-password.component.html',
  styleUrls: ['./user-update-password.component.css']
})
export class UserUpdatePasswordComponent implements OnInit {

    updatePasswordForm: FormGroup;

    constructor(private formBuilder: FormBuilder,public toastr: ToastrManager, private authService:AuthService) { }

    ngOnInit() {

        this.updatePasswordForm = this.formBuilder.group(
            {
                currentPassword: ["", Validators.required],      
                password: ["", [Validators.required, Validators.minLength(6)]],
                confirmPassword: ["", Validators.required ]
            },
            {
                validator: MustMatch("password", "confirmPassword")
            }
            );
    }

    onSubmit() {
         // this.errorDisplayService.validateAllFormFields(this.signupForm);
         this.validateAllFormFields(this.updatePasswordForm);  
         
         // --- stop here if form is invalid
        if (this.updatePasswordForm.invalid) {
           
            return;
        }

        const user= this.authService.getAuth().currentUser;

        const credential =  this.authService.getFirebase().auth.EmailAuthProvider.credential(
            this.authService.getAuth().currentUser.email,
            this.updatePasswordForm.get("currentPassword").value
          );

          user.reauthenticateAndRetrieveDataWithCredential(credential).then(res=>{

            const newPassword=this.updatePasswordForm.get("password").value

            user.updatePassword(newPassword).then(()=> {
                    this.toastr.successToastr("Password updated Successfully", "Success" , {position: "bottom-right", animate: "slideFromBottom"});
              }).catch(function(error) {
                    this.toastr.errorToastr(error, "Error", {position: "bottom-right", animate: "slideFromBottom"});
              });
          },err=>{
            this.toastr.errorToastr("Your current password is wrong.", "Error", {position: "bottom-right", animate: "slideFromBottom"});
          })

    }

    // --- convenience getter for easy access to form fields
    get f() {
        return this.updatePasswordForm.controls;
    }
    
    onReset(){
        this.updatePasswordForm.reset();
    }


    isFieldValid(field: string) {
        return !this.updatePasswordForm.get(field).valid && this.updatePasswordForm.get(field).touched;
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
