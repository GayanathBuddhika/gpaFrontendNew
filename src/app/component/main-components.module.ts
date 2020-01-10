//import { FrequencyReportComponent } from './report/final-gauge/frequency-customer/frequency-report.component';
import { FrequencyReportComponent } from './report/final-gauge/frequency-report/frequency-report.component';

import { FilterMinMaxPipe } from './../pipe/filter-min-max.pipe';
import { VisibleSurveyFormRoutingModule } from './visibleSurveyForm/visible-survey-form-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MainComponentRoutingModule } from './main-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import {MultiSelectModule} from 'primeng/multiselect';


import { UnauthorizedInterceptor } from './../core/unauthorized.inteceptor';
import { HttpConfigInterceptor } from './../core/httpconfig.interceptor';
import { AuthGuard } from './../core/auth.guard';
import { AuthService } from './../core/auth.service';
import { ToastrModule } from 'ng6-toastr-notifications';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, TitleCasePipe, KeyValuePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopNavbarComponent } from './layout/top-navbar/top-navbar.component';
import { AsideNavbarComponent } from './layout/aside-navbar/aside-navbar.component';
import { FooterNavbarComponent } from './layout/footer-navbar/footer-navbar.component';
import { SettingsNavbarComponent } from './layout/settings-navbar/settings-navbar.component';
import { CompanyComponent } from './company/company.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { CompanyAddComponent } from './company/company-add/company-add.component';
import { UserComponent } from './user/user.component';
import { BranchAddComponent } from './branch/branch-add/branch-add.component';
import { DepartmentAddComponent } from './department/department-add/department-add.component';
import { CompanyListDropdownComponent } from './company/company-list-dropdown/company-list-dropdown.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeAddComponent } from './employee/employee-add/employee-add.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SubscriptionListComponent } from './subscription/subscription-list/subscription-list.component';
import { SubscriptionAddComponent } from './subscription/subscription-add/subscription-add.component';
import { SubscriptionPlanComponent } from './company/subscription-plan/subscription-plan.component';
import { CamelCasePipe } from '../pipe/camelCase.pipe';
import { SubscriptionPlanListComponent } from './company/subscription-plan-list/subscription-plan-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DropzoneDirective } from '../directive/dropzone.directive';
import { FileSizePipe } from '../pipe/file-size.pipe';

import { EmployeeCsvFileAddComponent } from './employee/employee-csv-file-add/employee-csv-file-add.component';
import { BusinessTypeComponent } from './business-type/business-type.component';
import {RatingModule} from 'primeng/rating';
import { SentenceCasePipe } from '../pipe/sentence-case.pipe';

import {InputSwitchModule} from 'primeng/inputswitch';
import { NgSelectModule } from '@ng-select/ng-select';
import { PickListModule } from 'primeng/picklist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import {CalendarModule} from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { ConfirmationService } from 'primeng/api';
import { ErrorDisplayService } from '../shared/error-display.service';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { QuestionAndAnswersComponent } from './question-and-answer-layout/question-and-answers/question-and-answers.component';
import { QuestionControllerComponent } from './question-and-answer-layout/question-and-answers/question-controller/question-controller.component';
import { QuestionAndAnswerLayoutComponent } from './question-and-answer-layout/question-and-answer-layout.component';
import { SurveyComponent } from './survey/survey.component';
import { CreateServeyComponent } from './survey/create-servey/create-servey.component';
import { GaugeTitleComponent } from './gauge-title/gauge-title-add/gauge-title.component';
import { GaugeTitleListComponent } from './gauge-title/gauge-title-list/gauge-title-list.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerAddComponent } from './customer-view/customer-add/customer-add.component';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { MatrixtableComponent } from './question-and-answer-layout/matrixtable/matrixtable.component';
import { VisivleSurveyFormsModule } from './visibleSurveyForm/visible-survey-forms.module';

import { SummaryReportOfQuestionAnswerComponent } from './summary-report-of-question-answer/summary-report-of-question-answer.component';
import {PaginatorModule} from 'primeng/paginator';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ChartModule} from 'primeng/chart';



import { GaugeSurveyComponent } from './gauge-survey/gauge-survey.component';
import { GaugeComponent } from './gauge-survey/gauge/gauge.component';
import {SliderModule} from 'primeng/slider';
import { UserUpdatePasswordComponent } from './user/user-update-password/user-update-password.component';
import { LkRemoveLeadingZeroDirective } from '../directive/lk-remove-leading-zero-phone.directive';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ErrorPageComponent } from './error-page/error-page.component';
import { FullFeedbackComponent } from './report/full-feedback/full-feedback.component';
import { RewardComponent } from './reward/reward.component';
import { RewardClaimComponent } from './reward/reward-claim/reward-claim.component';
import { NotificationComponent } from './notification/notification.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BranchDepartmentConstructionComponent } from './branch-department-construction/branch-department-construction.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { NgxPowerBiModule } from 'ngx-powerbi';
import { SummaryQuestionsComponent } from './summary-report-of-question-answer/summary-questions/summary-questions.component';
import { SummaryAnswerComponent } from './summary-report-of-question-answer/summary-answer/summary-answer.component';
import { SummaryAnswerOneByoneComponent } from './summary-report-of-question-answer/summary-answer-one-byone/summary-answer-one-byone.component';


import { ClipboardModule } from 'ngx-clipboard';
import { AlertComponent } from './alert/alert.component';
import { RealtimeKeyListComponent } from './survey/realtime-key-list/realtime-key-list.component';

@NgModule({
    declarations:[

    
    TopNavbarComponent,
    AsideNavbarComponent,
    FooterNavbarComponent,
    SettingsNavbarComponent,

    DashboardComponent,
    CompanyComponent,
    CompanyListComponent,
    CompanyAddComponent,
    UserComponent,
    BranchAddComponent,
    DepartmentAddComponent,
    CompanyListDropdownComponent,
    EmployeeComponent,
    EmployeeAddComponent, 
    UserAddComponent,
    UserListComponent,
    EmployeeListComponent,
    SubscriptionComponent,
    SubscriptionListComponent,
    SubscriptionAddComponent,
    SubscriptionPlanComponent,  
    SubscriptionPlanListComponent, 
 
    ErrorPageComponent,
    NotificationComponent,
    

    EmployeeCsvFileAddComponent,
    BusinessTypeComponent,
    MainLayoutComponent,   

    DropzoneDirective,

    FileSizePipe,

    QuestionAndAnswersComponent,

    QuestionControllerComponent,
  
    QuestionAndAnswerLayoutComponent,
    SurveyComponent,
    CreateServeyComponent,
    GaugeTitleComponent,
    GaugeTitleListComponent,
    CustomerViewComponent,
    CustomerAddComponent,
    SurveyListComponent,
    SummaryReportOfQuestionAnswerComponent,
    NotificationComponent,
  
    
    MatrixtableComponent,
    GaugeSurveyComponent,
    GaugeComponent,
    UserUpdatePasswordComponent,
    LkRemoveLeadingZeroDirective,


    FrequencyReportComponent,
    ErrorPageComponent,
    FullFeedbackComponent,
    RewardComponent,
    RewardClaimComponent,
    NotificationComponent,
    BranchDepartmentConstructionComponent,
    SummaryQuestionsComponent,
    SummaryAnswerComponent,

    AlertComponent,
    RealtimeKeyListComponent,

    SummaryAnswerOneByoneComponent,

    ],
    imports:[
        InfiniteScrollModule,
        CommonModule,
        ScrollingModule,
        FormsModule,
        RouterModule ,
       // RatingModule,
        
        SharedModule,
        MainComponentRoutingModule,
        InputSwitchModule,
        DragDropModule,   
        ModalModule.forRoot(),
        NgSelectModule,
        //BrowserAnimationsModule, // or NoopAnimationsModule.
        ToastrModule.forRoot(),
        PickListModule,
        ConfirmDialogModule,
        TableModule,
        ProgressBarModule,
        FileUploadModule,
        // CalendarModule,
       
        CalendarModule,
        PaginatorModule,
        NgxSpinnerModule,
        ChartModule,
        // BsDatepickerModule.forRoot(),
       // InternationalPhoneNumberModule,
        SliderModule,
        MultiSelectModule,
        ClipboardModule,
        ColorPickerModule,
        NgxPowerBiModule,
        ScrollPanelModule
        
    ],
    
  providers: [
  TitleCasePipe,
   // AuthService, 
   
    // AuthGuard, 
    // ConfirmationService,
    //  { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    //  { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
    //  ErrorDisplayService,
     DatePipe,
     CamelCasePipe,
     SentenceCasePipe,
     FilterMinMaxPipe,
     KeyValuePipe
  ],
  exports:[]
})
export class MainComponentModule{

}