import { FinalQA } from './../model/finalQA';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FinalQaServiceService {
   // --- base url use for get http://localhost:8081 
   baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveFinalQuestionAndAnswer(finalQA: FinalQA[]){
    return this.http.post<any>(this.baseUrl + "/final-answer-of-qustion/save",finalQA);
  }
}
