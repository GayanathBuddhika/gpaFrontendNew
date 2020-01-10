import { PageNotFoundComponent } from './../page-not-found/page-not-found.component';
import { VisibleQuestionAndAnswerComponent } from './visible-question-and-answer/visible-question-and-answer.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GaugeSurveyComponent } from '../gauge-survey/gauge-survey.component';

const routes: Routes =[
    
{path: "qa/:uuid", component: VisibleQuestionAndAnswerComponent, data :{type: 'normal'}},
{path: "rt/:uuid", component: VisibleQuestionAndAnswerComponent, data :{type: 'realtime'}},

{path: "gauge/:uid/:userId", component:GaugeSurveyComponent},
// {path: '404', component: PageNotFoundComponent},
// {path: '**', redirectTo: '/404'}

]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class VisibleSurveyFormRoutingModule{

}