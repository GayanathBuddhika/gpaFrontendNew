import { UserManagementActions } from './../../../enum/UserManagementActions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from 'src/app/function/mustMatch';
import { takeUntil } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit,OnDestroy {

    // --- Form of ResetPassword
    resetPasswordForm: FormGroup;

    // --- Get the successful message
    successfulMsg = "";
    errorMsg = '';

    ngUnsubscribe: Subject<any> = new Subject<any>();
    actions = UserManagementActions;
  
    // The user management action to be completed
    mode: string;
    // Just a code Firebase uses to prove that this is a real password reset.
    actionCode: string; 
    
    actionCodeChecked: boolean;

    constructor(private formBuilder: FormBuilder, private authService:AuthService,public toastr: ToastrManager,private router: Router, private activatedRoute: ActivatedRoute,) { }

    ngOnInit() {
        this.resetPasswordForm=this.formBuilder.group({
            password: ["", [Validators.required, Validators.minLength(6)]],
            confirmPassword: ["", Validators.required ]
        },
        {
        validator: MustMatch("password", "confirmPassword")
        })

        this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).pipe(untilDestroyed(this)).subscribe(params => {
            // if we didn't receive any parameters, 
            // we can't do anything
            if (!params) {this.router.navigate(['/signin']); return;}
    
            this.mode = params['mode'];
            this.actionCode = params['oobCode'];

            this.authService.getAuth().checkActionCode(this.actionCode).then(user=>{
                switch (params['mode']) {
                    case UserManagementActions.resetPassword: {
                        // Verify the password reset code is valid.
                        this.authService.getAuth().verifyPasswordResetCode(this.actionCode)
                        .then(email => {
                            this.actionCodeChecked = true;
                        }).catch(e => {
                            // Invalid or expired action code. Ask user to try to
                            // reset the password again.
                            this.errorMsg=e;
                            //this.router.navigate(['/signin']);
                        });
                    } break;
                    case UserManagementActions.recoverEmail: {
        
                    } break;
                    case UserManagementActions.verifyEmail: {
                        this.authService.getAuth().applyActionCode(this.actionCode).then((res)=>{
                          //  this.toastr.successToastr("Your email is successfully verified.", "Success", {position: "bottom-right", animate: "slideFromBottom"});
                            setTimeout(()=>{
                                this.router.navigate(['/signin'],{relativeTo: this.activatedRoute});
                            },5000)
                        }).catch(function(err){
                            this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
                           // this.toastr.errorToastr(err, "Error", {position: "bottom-right", animate: "slideFromBottom"});
                        })
                    } break;
                    default: {
                    this.router.navigate(['/signin'],{relativeTo: this.activatedRoute});
                    }
                }
            }).catch(err=>{
                this.toastr.errorToastr("The valid time/token has expired.Please resend the link.", "Error", {position: "bottom-right", animate: "slideFromBottom"});
                this.router.navigate(['/signin']);
            })
    
            
        })
    }

    onSubmit(){
        this.validateAllFormFields(this.resetPasswordForm); 
            
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Save the new password.   
        this.authService.getAuth().confirmPasswordReset(this.actionCode,this.resetPasswordForm.get('password').value
        ).then(resp => { 

            this.errorMsg = '';
            // Password reset has been confirmed and new password updated.    
            this.toastr.successToastr("New password has been saved", "Success", {position: "bottom-right", animate: "slideFromBottom"});
            this.successfulMsg = "Successfully reset";
            this.router.navigate(['/']); }).catch(err => { 
            // Error occurred during confirmation. The code might have
            // expired or the password is too weak. alert(e); 
            console.log("Error msg at usermanagement ", err )
            this.errorMsg = err;
            }); 
    }

     // --- convenience getter for easy access to form fields
     get f() {
        return this.resetPasswordForm.controls;
    }

    isFieldValid(field: string) {
        return !this.resetPasswordForm.get(field).valid && this.resetPasswordForm.get(field).touched;
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

    signin(){
        this.router.navigate(['/signin'])
    }

    ngOnDestroy(){
        
    }


}
