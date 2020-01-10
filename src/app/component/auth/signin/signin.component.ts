import { AuthService } from './../../../core/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {


    email: string;
    password: string;
    errorMessage = '';
    backgroundImg = environment.subDomainUrl + '../../../../assets/dist/sign-up-forms/login2.png'
  
    constructor(public authService: AuthService,public toastr: ToastrManager, private router: Router) { }
  
    ngOnInit() {

      if (this.authService.authenticated()) {
        this.router.navigate(['/main/dashboard']);
      } else {
        this.router.navigate(['/signin']);
      }
    
    }
  
    // signup() {
    //   this.authService.signup(this.email, this.password);
    //   this.email = this.password = '';
    // }
  
    signin() {
      
      this.authService.signin(this.email, this.password).then(
        res => {          
                this.router.navigate(['/main/dashboard']);
        }, err => {
            if(err.error){
                this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
            } else{
                this.toastr.errorToastr(err, "Error", {position: "bottom-right", animate: "slideFromBottom"});
            }
          
          this.errorMessage = err.message;
        }
      );
         
      this.email = this.password = '';
    }
  
    logout() {
      this.authService.logout();
    }

    resetPassword(email: string) {
       
      }

}
