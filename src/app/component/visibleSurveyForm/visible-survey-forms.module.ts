import { FormsModule } from '@angular/forms';
import { StringToJsonObjectPipe } from './../../pipe/string-to-json-object.pipe';
import { SharedModule } from './../../shared/shared.module';
import { VisibleSurveyFormRoutingModule } from './visible-survey-form-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { VisibleQuestionAndAnswerComponent } from './visible-question-and-answer/visible-question-and-answer.component';
import { FinalQuestionComponent } from './final-question/final-question.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [VisibleQuestionAndAnswerComponent, FinalQuestionComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    VisibleSurveyFormRoutingModule,
    ConfirmDialogModule,
    ModalModule.forRoot()
  ],
  providers: [
    StringToJsonObjectPipe,KeyValuePipe
    ],
})
export class VisivleSurveyFormsModule { }
