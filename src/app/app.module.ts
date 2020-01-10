
import { MainComponentModule } from './component/main-components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpConfigInterceptor } from "./core/httpconfig.interceptor";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireModule } from "angularfire2";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ModalModule } from "ngx-bootstrap/modal";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { ToastrModule } from "ng6-toastr-notifications";

import { NgxSpinnerModule } from "ngx-spinner";

import { DatepickerModule, BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { UnauthorizedInterceptor } from "./core/unauthorized.inteceptor";

import {
  AngularFirestoreModule,
  FirestoreSettingsToken
} from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";
import { SharedModule } from './shared/shared.module';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth.guard';
import { VisivleSurveyFormsModule } from './component/visibleSurveyForm/visible-survey-forms.module';




@NgModule({
  declarations: [AppComponent, ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,        
    AppRoutingModule,  
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    ToastrModule.forRoot(),  
    BrowserAnimationsModule, // or NoopAnimationsModule.       
    AngularFireModule.initializeApp(environment.firebase, "Pulsebeat V-2.0"),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgxSpinnerModule,
    MainComponentModule,
    SharedModule,
    VisivleSurveyFormsModule
    
  ],
  providers: [
    AuthService,
    AuthGuard,
    { provide: FirestoreSettingsToken, useValue: {} },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
