import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Customer } from '../model/customet';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  // --- base url use for get http://localhost:8081 
  baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  findAll(){
    return this.http.get<any>(this.baseUrl+"/customer/findAll");
  }

  saveCustomer(customer:Customer){
    return this.http.post<any>(this.baseUrl+"/customer/save",customer);
  }

  findCustomerByPhone(phone:string,surveyId:string){
    let parameters = new HttpParams();
    parameters = parameters.set('phone',phone).set('surveyId',surveyId);
    return this.http.get<any>(this.baseUrl+"/customer/findByPhone",{params: parameters});
  }

  getCustomer(reportType:string,companyId:string,startDate:string,endDate:string){
    
    let parameters = new HttpParams();
    parameters = parameters.set('reportType',reportType).set('companyId',companyId).set('startDate',startDate).set('endDate',endDate);
    return this.http.get<any>(this.baseUrl+"/report/findCustomer",{params: parameters})
  }

  getChurnCustomer(companyId:string,startDate:string,endDate:string){
    let parameters = new HttpParams();
    parameters = parameters.set('companyId',companyId).set('startDate',startDate).set('endDate',endDate);
    return this.http.get<any>(this.baseUrl+"/report/findChurnCustomer",{params: parameters})
  }

  //--- Get surveys of churnCustomer and frequencyCustomer
  getSurveysOfCustomer(customerId:string,companyId:string){
    let parameters = new HttpParams();
    parameters = parameters.set('customerId',customerId).set('companyId',companyId);
    return this.http.get<any>(this.baseUrl+"/report/viewSurveysOfCustomer",{params: parameters})

  }
  
  getFullFeedback(companyId:string,startDate:string,endDate:string,getGaugeSurvey:string){

    let parameters = new HttpParams();
    parameters = parameters.set('companyId',companyId).set('startDate',startDate).set('endDate',endDate).set('getGaugeSurvey',getGaugeSurvey);
    return this.http.get<any>(this.baseUrl+"/report/getCustomerFullFeedback",{params: parameters})
  }

  
}
