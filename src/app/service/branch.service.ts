import { environment } from './../../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Branch } from "../model/branch";
import { Observable, BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BranchService {
  
  // --- base url use for get http://localhost:8081 
  baseUrl = environment.apiUrl;

  // --- Added a model in branch.component.ts for adding.
  // --- _ngxmodel_branch_add is using for closing that model after successfully branch data is added
  // --- Can use Subject<any>() here since the model is always using hide() as default.
  private _ngxmodel_branch_add = new BehaviorSubject<boolean>(false);
  
  // --- Added a model in branch-list.component.ts for editing.
  // --- _ngxmodel_branch_edit is using for closing that model after successfully branch data is edited
  // --- Can use Subject<any>() here since the model is always using hide() as default.
  public _ngxmodel_branch_edit = new BehaviorSubject<boolean>(false);

  // ---This subject use to real time update the branch list when new branch add
  public _addBranchToList = new Subject<Branch>();

  // ---This subject use to real time update the branch list when edit branch
  public _editBranchToList = new Subject<Branch>();

  // --- use this subject to get branch object ,when click assing button for assign or un assign department.
  private _get_branch = new Subject<any>();

  

  constructor(private http: HttpClient) {}

  // --- for get branch object
  getBranch(companyId: string): Observable<any> {
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    return this.http.get<any>(this.baseUrl + "/branch/getById/"+ companyId);
  }

  // --- add new branch
  saveBranch(branch: Branch): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/branch/save",branch );
  }

  // --- delede branch
  deleteBranch(id: string,assignDeptToBranchId:string): Observable<any>{
   
    let parameters = new HttpParams();
    parameters = parameters.set('id',id).set('assignDeptToBranchId',assignDeptToBranchId);
    return this.http.delete<any>(this.baseUrl + "/branch/delete",{params: parameters});
  }

  // --- update branch
  updateBranch(branchId: string,branch: Branch): Observable<any> {
    return this.http.put<any>(this.baseUrl + "/branch/edit/"+branchId,branch)
  }
  
  // ---Delete all ckecked branck
  deleteAll(branchList:Branch[]){
    return this.http.post<any>(this.baseUrl + "/branch/deleteAll",branchList);
  }  

  // --- This is use to _ngxmodel_branch_add BehaviorSubject make as Obsearvable
  ngxmodel_branch_add_$():Observable <any>{
    return this._ngxmodel_branch_add.asObservable();
  }

  // --- This is use to _ngxmodel_branch_edit BehaviorSubject make as Observable
  ngxmodel_branch_edit_$():Observable <any>{
    return this._ngxmodel_branch_edit.asObservable();
  }

  // ---This is for set next value to _ngxmodel_branch_add because it is private variable 
  _set_ngxmodel_branch_add(value: boolean){
    return this._ngxmodel_branch_add.next(value);
  }

  // --- This is for set next value to _ngxmodel_branch_edit because it is private variable
  _set_ngxmodel_branch_edit(value: boolean){
    return this._ngxmodel_branch_edit.next(value);
  }

  // ---This is for _addBranchToList make asObservable
  addBranchToList_$():Observable <any>{
    return this._addBranchToList.asObservable();
  }

  // ---This is for _editBranchToList make asObservable
  editBranchToList_$():Observable <any>{
    return this._editBranchToList.asObservable();
  }

    // ---creat observable method to get next value into -get-branch from branch-list.component
    getCompanyOfBranch_$(): Observable<any> {
      return this._get_branch.asObservable();    
    }
  
    // --- This is to get _get_branch next value from branch-list-component
    _set_branch(branch:Branch){
      return this._get_branch.next(branch);
    }
  
}
