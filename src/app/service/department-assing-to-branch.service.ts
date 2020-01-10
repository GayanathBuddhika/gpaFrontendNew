import { DepToBranch } from './../model/DeptToBranch';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentAssingToBranchService {

  // --- base url use for get http://localhost:8081 
  baseUrl = environment.apiUrl;

  // --- Added a model in branch-list.component.ts for assigning.
  // ---_ngxmodel_assign is using for closing that model after successfully department data is assigned
  // --- Can use Subject<any>() here since the model is always using hide() as default.
  private _ngxmodel_assign = new BehaviorSubject<boolean>(false);

 
  
  constructor(private http: HttpClient) { }

  getAllCompany() :Observable<any>{
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    return this.http.get<any>(this.baseUrl+"/assignDeptToBranch/findCompany");
  }

  getBranch(companyId: string):Observable<any>{
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    return this.http.get<any>(this.baseUrl+"/assignDeptToBranch/findbranch/" + companyId);
  }

  getDepartment(branchId: string):Observable<any>{
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    return this.http.get<any>(this.baseUrl+"/assignDeptToBranch/findDepartment/" + branchId);
  }

    // --- get all assigned and unassigned department as IdName List of array (List<IdName>)
  assignDeptToBranch(branchId: string):Observable<any>{
    let par= new HttpParams();
    par= par.set('id',branchId)
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" })
    return this.http.get<any>(this.baseUrl+"/assignDeptToBranch/getAssigningDepatments",{params: par});
    }

  // --- save new assigned department 
  saveAssignedDepartment(depToBranch: DepToBranch[]):Observable<any>{
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" })
    return this.http.post<any>(this.baseUrl+"/assignDeptToBranch/saveAssignedDept",depToBranch)
  }

  // --- deletee new unassigned department
  deleteUnassignDepartment(depToBranch: DepToBranch[]):Observable<any>{
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" })
    return this.http.post<any>(this.baseUrl+"/assignDeptToBranch/deleteAssignedDept",depToBranch);
  }

   // --- This is use to _ngxmodel_assign BehaviorSubject make as Obsearvable
   ngxmodel_assign_$():Observable<any>{
    return this._ngxmodel_assign.asObservable();
  }

  // ---This is for set next value to _ngxmodel_assign because it is private variable 
  _set_ngxmodel_assign(value: boolean){
    return this._ngxmodel_assign.next(value);
  }

  
  assignDepartment(depToBranch: DepToBranch):Observable<any>{
    
    return this.http.post<any>(this.baseUrl+"/assignDeptToBranch/assignedDept",depToBranch);
  }

  
  UnassignDepartment(depToBranch: DepToBranch):Observable<any>{
    
    return this.http.post<any>(this.baseUrl+"/assignDeptToBranch/unassignedDept",depToBranch);
  }
}
