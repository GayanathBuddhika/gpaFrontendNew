
import { environment } from './../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { Department } from 'src/app/model/department';
import { Branch } from './../model/branch';
import { Company } from 'src/app/model/company';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../model/employee';
import { BehaviorSubject, Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  // --- base url use for get http://localhost:8081 
  baseUrl = environment.apiUrl;

  private _ngxModal_add = new BehaviorSubject<boolean>(false);
  private _ngxModal_edit = new BehaviorSubject<boolean>(false);
  private _ngxModal_csv = new BehaviorSubject<boolean>(false);

  public _addUserToList = new Subject<Employee>();
  public _editUserToList = new Subject<Employee>();
  public _SelectedCompany = new Subject<Company>()

  constructor(private http: HttpClient) { }


  saveEmployee(employee: Employee,company: Company, branch: Branch, department: Department){
  //  const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    let parameters = new HttpParams();
    
    parameters = parameters.set('companyId',company.id).set('branchId', branch.id).set('departmentId',department.id);

    return this.http.post<any>(this.baseUrl + "/employee/save",employee,{params: parameters});
  }

  
  getAllEmployee(companyid: string){
   // const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });

    return this.http.get<any>(this.baseUrl + "/employee/findAll/"+companyid);
  }

  deleteEmployee(employeeId: string){
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    return this.http.post<any>(this.baseUrl + "/employee/delete/"+employeeId,{});
  }

  saveCSVfile(file: FormData, company: Company, branch: Branch, department: Department){
  
    let parameeters = new HttpParams();
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    parameeters = parameeters.set('companyId', company.id).set('branchId', branch.id).set('departmentId', department.id);

    return this.http.post<any>(this.baseUrl + "/employee/saveCsvFile",file,{params: parameeters,headers:headers});

  }

  getDublicates(selectedCompanyId: string){
    return this.http.get<any>(this.baseUrl + "/employee/duplicate/"+selectedCompanyId);
  }

  deleteCheckedEmployeeList(checkedEmployee: Employee[]){

    return this.http.post<any>(this.baseUrl + "/employee/deleteEmployeelist",checkedEmployee);

  }


  _set_ngxModal_add(value: boolean){
    this._ngxModal_add.next(value);
  } 

  get__ngxModal_add_$(): Observable<boolean>{
    return this._ngxModal_add.asObservable();
  }

  get_ngxModal_edit_$(): Observable<boolean>{
    return this._ngxModal_edit.asObservable();
  }

  _set_ngxmodal_edit(value: boolean){
    this._ngxModal_edit.next(value);
  }

  get_ngxModal_csv_$(): Observable<boolean>{
    return this._ngxModal_csv.asObservable();
  }

  _set_ngxModal_csv(value: boolean){
    this._ngxModal_csv.next(value);
  }

}



