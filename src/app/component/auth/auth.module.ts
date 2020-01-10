
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SigninOnlyLayoutComponent } from "./../layout/signin-only-layout/signin-only-layout.component";
import { ToastrModule } from "ng6-toastr-notifications";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";
import { FormsModule } from "@angular/forms";
import { SigninComponent } from "./signin/signin.component";
import { NgModule } from "@angular/core";
import { SharedModule } from 'src/app/shared/shared.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { RegistrationComponent } from './registration/registration.component';
import { RealtimeViewComponent } from '../survey/realtime-view/realtime-view.component';

import { AccordionModule } from 'ngx-bootstrap/accordion';



@NgModule({
  declarations: [
    SigninComponent, 
    SigninOnlyLayoutComponent,
    ForgotPasswordComponent,
    UserManagementComponent,
    RegistrationComponent,
    RealtimeViewComponent,

],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    ToastrModule.forRoot(),
    SharedModule,
    AccordionModule.forRoot(),
  //  InternationalPhoneNumberModule,
   
  ],

  providers: [
    // AuthService,
    // AuthGuard,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpConfigInterceptor,
    //   multi: true
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: UnauthorizedInterceptor,
    //   multi: true
    // }
  ]
})
export class AuthModule {}
