import { BehaviorSubject, Subject } from 'rxjs';
import { FeedbackSliderValGaugeTitleId } from './../model/feedbackSliderValGaugeTitleId';
import { Injectable } from '@angular/core';
import { GaugeTitle } from '../model/gaugeTitle';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GaugeTitleService {

  // --- base url use for get http://localhost:8081 
  baseUrl = environment.apiUrl;
  
  // ---for gauge title edit process
  _edit_gauge_title = new BehaviorSubject<boolean>(false);

  // _get_edit_gauge_title_object = new Subject<GaugeTitle>();
  _get_edit_gauge_title_object:BehaviorSubject<GaugeTitle> = new BehaviorSubject<GaugeTitle>(null)

  constructor(private http : HttpClient) { }

  // ---save gauge titles
  saveGaugeTitle(gaugeTitle: GaugeTitle[], assignDepToBranchId: string){

    let parameeters = new HttpParams();
    parameeters = parameeters.set('assignDepToBranchId',assignDepToBranchId);

   
    return this.http.post<any>(this.baseUrl + "/gaugetitle/save",JSON.parse(JSON.stringify(gaugeTitle)).gaugeTitles,{params: parameeters});

  }

  // ---find all gauge titles 
  findAllGaugeTitle(assignDepToBranchId: string){
    let parameters = new HttpParams();
    parameters = parameters.set('assignDepToBranchId',assignDepToBranchId);
    return this.http.get<any>(this.baseUrl+"/gaugetitle/findAll",{params: parameters});
  }

  // ---save  customer feedback that give from gauge
  saveCustomerFeedack(feedbackSliderValGaugeTitleId:FeedbackSliderValGaugeTitleId[],additionalComment:string,surveyId:string,assignDeptToBranch:string,phone:string,name:string,email:string,userId:string){
    let parameters = new HttpParams();
    parameters = parameters.set('surveyId',surveyId)
    .set('additionalComment',additionalComment)
    .set('phone',phone)
    .set('name',name)
    .set('email',email)
    .set('assignDeptToBranchId',assignDeptToBranch)
    .set('userId',userId)
    return this.http.post<any>(this.baseUrl+"/finalGauge/saveCustomerFeedBack",feedbackSliderValGaugeTitleId,{params: parameters});
  }

  getWeightedAvgVal(surveyId:string,customerId:string,companyId:string){
    let parameters = new HttpParams();
    parameters = parameters.set('surveyId',surveyId).set('customerId',customerId).set('companyId',companyId);
    return this.http.get<any>(this.baseUrl+"/report/weightedAvg",{params: parameters})

  }
  
  findGaugeTitleById(gaugeTitleId:string){
    let parameters = new HttpParams();
    parameters = parameters.set('gaugeTitleId',gaugeTitleId);
    return this.http.get<any>(this.baseUrl+"/gaugetitle/findById",{params: parameters})
  }
}
