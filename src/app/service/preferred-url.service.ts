import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferredUrlService {
    // --- base url use for get http://localhost:8081 
    baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPrefrredUrl(id: string){
    let parameters = new HttpParams();
    parameters = parameters.set('uuId',id);
    return this.http.get<any>(this.baseUrl + "/gaugetitle/fingBySurveyId",{params: parameters});
  }
  
  getQuationAndAnswerObject(id: string){
    return this.http.get<any>(this.baseUrl + "/question/getQuestionsByUUid/" + id,{});
  }
  getAnswerObjecs(uuid: string, surveyType : string){
    let parameters = new HttpParams();
    parameters = parameters.set('surveyType',surveyType).set('uuid',uuid);
    return this.http.get<any>(this.baseUrl + "/question/getAnswersByUUid/",{params: parameters});
}


}
