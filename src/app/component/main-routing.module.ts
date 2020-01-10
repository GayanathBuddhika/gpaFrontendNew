import { AlertComponent } from './alert/alert.component';
import { BranchDepartmentConstructionComponent } from './branch-department-construction/branch-department-construction.component';
import { NotificationComponent } from './notification/notification.component';
//import { FrequencyReportComponent } from './report/final-gauge/frequency-customer/frequency-report.component';
import { FrequencyReportComponent } from './report/final-gauge/frequency-report/frequency-report.component';

import { FullFeedbackComponent } from './report/full-feedback/full-feedback.component';


import { ErrorPageComponent } from './error-page/error-page.component';

import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { GaugeTitleListComponent } from './gauge-title/gauge-title-list/gauge-title-list.component';
import { GaugeTitleComponent } from './gauge-title/gauge-title-add/gauge-title.component';
import { QuestionAndAnswerLayoutComponent } from './question-and-answer-layout/question-and-answer-layout.component';
import { QuestionAndAnswersComponent } from './question-and-answer-layout/question-and-answers/question-and-answers.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { CompanyComponent } from "./company/company.component";

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../core/auth.guard";
import { UserComponent } from "./user/user.component";
import { EmployeeComponent } from "./employee/employee.component";
import { SubscriptionComponent } from "./subscription/subscription.component";
import { BusinessTypeComponent } from "./business-type/business-type.component";
import { SurveyComponent } from './survey/survey.component';
import { SummaryReportOfQuestionAnswerComponent } from './summary-report-of-question-answer/summary-report-of-question-answer.component';
import { UserUpdatePasswordComponent } from './user/user-update-password/user-update-password.component';
import { RewardComponent } from './reward/reward.component';
import { RewardClaimComponent } from './reward/reward-claim/reward-claim.component';
import { RealtimeKeyListComponent } from './survey/realtime-key-list/realtime-key-list.component';


const routes: Routes = [
    {
        path: "",
        component: MainLayoutComponent,
        children: [
            {
                path: "dashboard",
                component: DashboardComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN", "MANAGER", "DEPARTMENT_ADMIN", "USER", "ANONYMOUS"] }
            },
            {
                path: "company/add",
                component: CompanyComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN"] }
            },
            {
                path: "subscription/add",
                component: SubscriptionComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN"] }
            },           
           
            {
                path: "survey/add",
                component: SurveyComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN"] }
            },
            {
                path: "gauge-customer-report",
                component: FrequencyReportComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN", "MANAGER", "DEPARTMENT_ADMIN", "USER", "ANONYMOUS"] }
            },

            {
                path: "gaugetitle/add",
                component: GaugeTitleComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN"] }
            },
            {
                path: "gaugetitle/list",
                component: GaugeTitleListComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN"] }
            },
            {
                path: "questionAndAnswerLayout/add",
                component: QuestionAndAnswerLayoutComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN"] }
            },
            {
                path: "customer/view",
                component: CustomerViewComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN"] }
            },
            {
                path: "survey/list", 
                component: SurveyListComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN", "MANAGER", "DEPARTMENT_ADMIN", "USER", "ANONYMOUS"] }
            },
            {
                path: "gauge-feedback",
                component: FullFeedbackComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN", "MANAGER", "DEPARTMENT_ADMIN", "USER", "ANONYMOUS"] }
            },
            {
                path: "reward",
                component: RewardComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN"] }
            },
            {
                path: "claim",
                component: RewardClaimComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN"] }
            },
            {
                path: "notification",
                component: NotificationComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN", "MANAGER", "DEPARTMENT_ADMIN", "USER", "ANONYMOUS"] }
            },
            {
                path: "alert",
                component: AlertComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN", "MANAGER", "DEPARTMENT_ADMIN", "USER", "ANONYMOUS"] }
            },
            {
                path: "real-time-survey-key",
                component: RealtimeKeyListComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN", "MANAGER", "DEPARTMENT_ADMIN", "USER", "ANONYMOUS"] }
            },

            {
                path: "branch-department-construction",
                component: BranchDepartmentConstructionComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN"] }
            },
            {
                path: "user/add",
                component: UserComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN"] }
            }, {
                path: "user/update-password",
                component: UserUpdatePasswordComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN", "MANAGER", "DEPARTMENT_ADMIN", "USER", "ANONYMOUS"] }
            },
            {
                path: "employee/add",
                component: EmployeeComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN"] }
            },
            {
                path: "businessType/add",
                component: BusinessTypeComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN"] }
            },
            {
                path: "q-a-report",
                component: SummaryReportOfQuestionAnswerComponent,
                // canActivate: [AuthGuard],
                // data: { role: ["SYSTEM_ADMIN", "COMPANY_ADMIN", "MANAGER", "DEPARTMENT_ADMIN", "USER", "ANONYMOUS"] }

            }

        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainComponentRoutingModule { }
