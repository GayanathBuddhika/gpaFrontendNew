import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SummaryReportOfQuestionAnswerService {


  public _summaryDataList = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  getSummaryData(surveyId:string){
    let parameters = new HttpParams();
    parameters = parameters.set('surveyId', surveyId);
    return this.http.get<any>(this.baseUrl+"/final-answer-of-qustion/show-summery",{params:parameters})
  }

  getAllFinalAnswersOfSurvey(surveyId : string){
    return this.http.get<any>(this.baseUrl + "/final-answer-of-qustion/getFinalAnswers/"+surveyId);
  }

  getAllAnswersOfSurvey(surveyId : string){
    return this.http.get<any>(this.baseUrl + "/answer/getAllAnswers/"+surveyId);
  }
  getSummaryQuestionAndAnswer(surveyId:string){
    let parameters = new HttpParams();
    parameters = parameters.set('surveyId', surveyId)
    return this.http.get<any>(this.baseUrl+"/final-answer-of-qustion/show-question-answer-report",{params:parameters})
  }

  _set_summaryDataList(value : any){
    
    this._summaryDataList.next(value);
  }

  get_summaryDataList_$():Observable<any>{
     return this._summaryDataList.asObservable();
  }
}
