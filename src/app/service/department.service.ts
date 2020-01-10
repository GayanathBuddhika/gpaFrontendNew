
import { Department } from './../model/department';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  // --- base url use for get http://localhost:8081 
  baseUrl = environment.apiUrl;

  // --- Added a model in department.component.ts for adding.
  // --- _ngxmodel_dept_Add is using for closing that model after successfully department data is added
  // --- Can use Subject<any>() here since the model is always using hide() as default.
  private _ngxmodel_dept_add = new BehaviorSubject<boolean>(false);

  // --- Added a model in department-list.component.ts for editing.
  // --- _ngxmodel_dept_edit is using for closing that model after successfully departmets data is edited
  // --- Can use Subject<any>() here since the model is always using hide() as default.
  public _ngxmodel_dept_edit = new BehaviorSubject<boolean>(false);
  

   // ---This subject use to real time update the department list when new department add
   public _addDeptToList = new Subject<Department>();

   // ---This subject use to real time update the department list when edit department
   public _editDeptToList = new Subject<Department>();

  constructor(private http: HttpClient) { }

  // --- get depatrment object
  getDepartment(companyId:string):Observable<any>{
    return this.http.get<any>( this.baseUrl+"/department/getById/"+companyId)
  }

  // --- save deparatment
  saveDepartment(department: Department):Observable<any>{
    return this.http.post<any>(this.baseUrl+"/department/save",department);
    
  }

  // --- delete Department
  deleteDepartment(id: string,assignDeptToBranchId:string):Observable<Object>{
    let parameters = new HttpParams();
    parameters = parameters.set('id',id).set('assignDeptToBranchId',assignDeptToBranchId);
    return this.http.delete(this.baseUrl+"/department/delete",{params: parameters})
  }
  
  // --- update branch
  updateDepartment(departmenId:string,department: Department):Observable<any>{
    return this.http.post<any>(this.baseUrl+"/department/update/"+departmenId,department)
  }

   // ---Delete all ckecked branck
   deleteAll(deptList:Department[]){
    return this.http.post<any>(this.baseUrl + "/department/deleteAll",deptList);
  }


  // --- This is use to _ngxmodel_dept_add BehaviorSubject make as Obsearvable
  ngxmodel_dept_add_$():Observable <any>{
    return this._ngxmodel_dept_add.asObservable();
  }

  // --- This is use to _ngxmodel_dept_edit BehaviorSubject make as Obsearvable
  ngxmodel_dept_edit_$():Observable<any>{
    return this._ngxmodel_dept_edit.asObservable();
  }

  // ---This is for set next value to _ngxmodel_dept_add because it is private variable 
  _set_ngxmodel_dept_add(value: boolean){
    return this._ngxmodel_dept_add.next(value);
  }

  // ---This is for set next value to _ngxmodel_dept_edit because it is private variable 
  _set_ngxmodel_dept_edit(value: boolean){
    return this._ngxmodel_dept_edit.next(value);
  }

   // ---This is for _addDeptToList make asObservable
   addDeptToList_$():Observable <any>{
    return this._addDeptToList.asObservable();
  }

  // ---This is for _editDeptToList make asObservable
  editDeptToList_$():Observable <any>{
    return this._editDeptToList.asObservable();
  }
}
