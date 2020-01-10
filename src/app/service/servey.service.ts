import { DepToBranch } from 'src/app/model/DeptToBranch';
import { SurveyConverterForGaugeTitle } from 'src/app/model/SurveyConverterForGaugeTitle';

import { SurveyQuestionSelection } from 'src/app/model/surveyQuestionSelection';


import { DptNameSurveyUuid } from 'src/app/model/DptNameSurveyUuid';


import { BehaviorSubject } from 'rxjs';

import { environment } from './../../environments/environment';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Survey } from '../model/survey';
import { SbdRelation } from '../model/sbdRelation';

@Injectable({
  providedIn: 'root'
})
export class ServeyService {

  constructor(private http: HttpClient) {}

  baseUrl = environment.apiUrl;

  public _setSurveyObject = new BehaviorSubject<any>(null);
  public _setSelectedSelectionTypeObject = new BehaviorSubject<SbdRelation[]>([]);

  getSurveyfor(){
    return this.http.get<any>(this.baseUrl+ "/survey/getSurveyfor")
  }
  getSelectionType(){
    return this.http.get<any>(this.baseUrl+ "/survey/getSelectionType")
  }
  getSurveyTypes(){
    return this.http.get<any>(this.baseUrl+"/survaytype/getSurvaytype")
  }

  getBranchesForSurvey(companyId: string, surwayType:string  ){
    let parameters = new HttpParams();
    parameters = parameters.set('companyId', companyId).set('surveyType',surwayType);
    return this.http.get<any>(this.baseUrl+"/sbd-relation/getbranchesForSurvey",{params:parameters});
  }

  getDepartmentsForSurvey(companyId: string, surwayType:string  ){
    let parameters = new HttpParams();
    parameters = parameters.set('companyId', companyId).set('surveyType',surwayType);
    return this.http.get<any>(this.baseUrl+"/sbd-relation/getDEpartmentsForSurvey",{params:parameters})
  }

  getDepartmentsInBranchForSurvey(companyId: string){
    let parameters = new HttpParams();
    parameters = parameters.set('companyId', companyId);
    return this.http.get<any>(this.baseUrl+"/sbd-relation/selection-department-in-branch",{params:parameters})
  }


  saveSurvey(surveyQuestionSelection : SurveyQuestionSelection){

    return this.http.post<any>(this.baseUrl+"/survey/saveSurvey",surveyQuestionSelection);

  }

  saveSurveyForGauge(surveyConverterForGaugeTitle:SurveyConverterForGaugeTitle){

    return this.http.post<any>(this.baseUrl+"/survey/saveSurveyForGauge",surveyConverterForGaugeTitle);
  }

  getSurveyofCustomer(assignDeptToBranchId:string){
    let parameters = new HttpParams();
    parameters = parameters.set('assignDeptToBranchId',assignDeptToBranchId)
    return this.http.get<any>(this.baseUrl+"/survey/getSurveyForCustomer",{params:parameters})
  }


  // ---This is for get disabled survey and send it backend
  // ---Get restart survey and send it backend 
  disabledSurvey(survey:DptNameSurveyUuid){
    return this.http.post<any>(this.baseUrl+"/survey/disabledsurvey",survey);
  }

  getGaugeTitle(assignDeptTOBranchId:string){
    let parameters = new HttpParams();
    parameters = parameters.set('assignDepToBranchId',assignDeptTOBranchId)
    return this.http.get<any>(this.baseUrl+"/gaugetitle/findAll",{params: parameters});
  }
  getGaugeSurveyOfCompany(assignDeptTOBranchId:string){

    let parameters = new HttpParams();
    parameters = parameters.set('assignDepToBranchId',assignDeptTOBranchId)
    return this.http.get<any>(this.baseUrl+"/finalGauge/fingAllGagugeSurvey",{params: parameters});

  }

  getServeyType(){
 
    return this.http.get<any>(this.baseUrl+"/survaytype/getSurvaytype");
  }
  
  getAllSurveysOfAssingDEpToBranchId(assingDepToBranchId : string){
    return this.http.get<any>(this.baseUrl +"/survey/getSurveyByAssDepId/"+ assingDepToBranchId);
  }

  surveyCreateAccess(assingDepToBranch : DepToBranch){
    return this.http.post<any>(this.baseUrl +"/survey/enableToCreateSurvey",assingDepToBranch);
  }
}
