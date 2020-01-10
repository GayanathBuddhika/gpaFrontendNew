import { ClaimConverter } from './../model-converter/claimConverter';
import { Claim } from './../model/claim';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { Reward } from '../model/reward';

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCustomerList(branchId:string,startDate:string,endDate:string,visits:number,symbol:string){

    let parameters = new HttpParams();
    parameters = parameters.set('branchId',branchId).set('startDate',startDate).set('endDate',endDate).set('symbol',symbol);
    return this.http.get<any>(this.baseUrl+"/reward/getcustomerlist/"+visits,{params: parameters});

  }

  saveReward(reward:Reward){
    return this.http.post<any>(this.baseUrl+"/reward/saveReward",reward);
  }

  getCustomizableCustomer(branchId:string,visits:number,symbol:string){

    let parameters = new HttpParams();
    parameters = parameters.set('branchId',branchId).set('symbol',symbol);
    return this.http.get<any>(this.baseUrl+"/reward/getCustomizableCustomer/"+visits,{params: parameters});
  }

  // ---get existing reward when enter the phone number of customer
    getExistingReward(branchId:string,phone:string){
      
      let parameters = new HttpParams();
    parameters = parameters.set('branchId',branchId).set('phone',phone);
    return this.http.get<any>(this.baseUrl+"/claim/getExistingReward",{params: parameters});
    }

    createClaim(reward:ClaimConverter,phone:string){

      let parameters = new HttpParams();
    parameters = parameters.set('phone',phone);

      return this.http.post<any>(this.baseUrl+"/claim/createclaim",reward,{params: parameters});
    }
}
