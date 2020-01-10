import { BussinessType } from './../model/bussinessType';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BussinessTypeService {

  // --- base url use for get http://localhost:8081 
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  // ---Get all existing businesstype
  getBusinessType() {
    return this.http.get<any>(this.baseUrl+"/businessType/findAll");
  }

  // ---Delete bussiness type
  deleteBussinessType(businessTypeId:string){
    return this.http.delete<any>(this.baseUrl + "/businessType/delete/" +businessTypeId);
  }

  // ---Save new Bussiness Type
  saveBussinessType(bussinessType:BussinessType){
    return this.http.post<any>(this.baseUrl+"/businessType/save",bussinessType);
  }

} 

