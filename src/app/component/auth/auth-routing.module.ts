import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SigninComponent } from "./signin/signin.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SigninOnlyLayoutComponent } from "../layout/signin-only-layout/signin-only-layout.component";
import { UserManagementComponent } from './user-management/user-management.component';
import { RegistrationComponent } from './registration/registration.component';
import { RealtimeViewComponent } from '../survey/realtime-view/realtime-view.component';

const authRouting: Routes = [
  {
    path: "",
    component: SigninOnlyLayoutComponent,
    children: [
        { path: "signin", component: SigninComponent },
        { path: 'forgot-password', component: ForgotPasswordComponent },
        { path: 'user-management', component: UserManagementComponent},
        { path: 'registration', component: RegistrationComponent},
        { path: 'real-time-survey', component: RealtimeViewComponent}

     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRouting)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
