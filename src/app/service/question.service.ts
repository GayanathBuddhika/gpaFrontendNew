import { AnswersType } from './../model/answersType';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { QuestionAndAnswer } from './../model/questionAndAnswer';
import { Answer } from './../model/answer';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  // ---This subject use to get answerType frop question-controller-component
  public _answerType = new Subject<string>();

   // --- base url use for get http://localhost:8081 
   baseUrl = environment.apiUrl;

   
   public _getEditQuestionAndAnswerObject = new BehaviorSubject<any[]>([]);
   public _setEditedObject = new BehaviorSubject<any>(null);
   public _getEdit = new BehaviorSubject<boolean>(false);
   public _getAnswerTypes = new BehaviorSubject<AnswersType[]>([]);

  constructor(private http : HttpClient) {}
   
  getAnswerType(){
    return this.http.get<any>(this.baseUrl + "/answerType/getAllAnswerType");
  }

  saveQuestion(questionAndAnswer: QuestionAndAnswer[], assignDepToBranchId: string){

    let parameeters = new HttpParams();

    parameeters = parameeters.set('assignDepToBranchId',assignDepToBranchId);

    return this.http.post<any>(this.baseUrl + "/question/save",questionAndAnswer,{params: parameeters});

  }
  getAnswerByQuestionId(questionId: string){
    let parameeters = new HttpParams();
    parameeters = parameeters.set('questionId',questionId);
    return this.http.get<any>(this.baseUrl + "/answerType/getAllAnswetype",{params:parameeters});
  }

  edit_QuestionAndAnswerObject_$(): Observable<any[]>{
    return this._getEditQuestionAndAnswerObject.asObservable();
}

}
