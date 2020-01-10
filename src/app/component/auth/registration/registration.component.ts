import { ValidateFields } from 'src/app/function/validate-fields';
import { AuthService } from './../../../core/auth.service';
import { RegistrationService } from './../../../service/registration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MustMatch } from 'src/app/function/mustMatch';
import { Registration } from 'src/app/model/registration';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit,OnDestroy {
   
    // --- signup form group name
    registrationForm: FormGroup;

    // --- showRegistrationForm if anonymous login
    showRegistrationForm=false;

    backgroundImg = environment.subDomainUrl + '../../../../assets/dist/sign-up-forms/register3.png'  
    constructor(private formBuilder: FormBuilder,
                private registrationService:RegistrationService, 
                public toastr: ToastrManager,
                 private authService: AuthService ) { }

    ngOnInit() {

        this.authService.anonymousLogin().then(
            ()=>{
                this.showRegistrationForm=true;
            }
        )
        this.registrationForm = this.formBuilder.group(
            {
                company: ["", Validators.required],               
                firstname: ["", Validators.required],
                lastname: ["", Validators.required],
                email: ["",  [Validators.required, Validators.email]],
                phone:  ["", [Validators.required,Validators.pattern]],
                website:  ["", Validators.pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)],
                // --- No need of password or confirm password for editing
                password: ["", [Validators.required, Validators.minLength(6)]],
                confirmPassword: ["",Validators.required ]
              },
              {
                validator: MustMatch("password", "confirmPassword")
              }
            );
    }

    isFieldValid(field: string) {
        return !this.registrationForm.get(field).valid && this.registrationForm.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }
    get f() {
        return this.registrationForm.controls;
    }

    onSubmit(){

        // --- call common function 
        ValidateFields(this.registrationForm); 
        
        // --- stop here if form is invalid
        if (this.registrationForm.invalid) {
            return;
        }

        let registration: Registration = this.registrationForm.value;

        delete registration['confirmPassword']
        this.registrationService.save(registration).subscribe(data=>{
            
        },err=>{
            this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
        })
    }

    ngOnDestroy(): void {
        this.authService.logout()
    }

}
