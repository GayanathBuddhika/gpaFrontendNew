import { Department } from './../model/department';
import { Branch } from 'src/app/model/branch';
import { Company } from './../model/company';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from './../../environments/environment';
import { User } from './../model/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

    baseUrl = environment.apiUrl;

    // --- Added a model in user.component.ts for adding.
    // --- _ngxmodel_Add is using for closing that model after successfully user data is added
    // --- Can use Subject<any>() here since the model is always using hide() as default.
    private _ngxmodel_Add = new BehaviorSubject<boolean>(false);

    // --- Added a model in user-list.component.ts for editing.
    // --- _ngxmodel_Edit is using for closing that model after successfully user data is edited
    // --- Can use Subject<any>() here since the model is always using hide() as default.
    private _ngxmodel_Edit = new BehaviorSubject<boolean>(false);


    public _addUserToList = new Subject<User>();
    public _editUserToList = new Subject<User>();


    constructor(private httpClient: HttpClient) { }
    

    save(user: User,company: Company, branch: Branch, department: Department): Observable<any> {
        //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
        let parameters = new HttpParams();
        
        parameters = parameters.set('companyId',company.id).set('branchId', branch.id).set('departmentId',department.id);
        
        return this.httpClient.post<any>(this.baseUrl + "/user/save", user, { params: parameters });
    }

    // getAllUser(): Observable<User[]>{
    //    // const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    //     return this.httpClient.get<User[]>(this.baseUrl + "/user/findAll");
    // }

    delete(username: string): Observable<any> {
        //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
        return this.httpClient.delete<any>(this.baseUrl + "/user/delete/" + username);
    }
    getRoles(): Observable<any[]> {
        //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
        return this.httpClient.get<any[]>(this.baseUrl + "/user/getRoles");
    }

    findByUsername(uid: string): Observable<User>{
        let parameters= new HttpParams();
        parameters= parameters.set('id',uid)
      //  const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
        return this.httpClient.get<User>(this.baseUrl + "/user/findByUsername", { params:parameters});
    }

    findAllUserByCompanyId(company: Company){
        let parameters= new HttpParams();
        parameters= parameters.set('companyId',company.id)
      //  const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
        return this.httpClient.get<User[]>(this.baseUrl + "/user/findAllUser", { params:parameters});
    }

    ngxmodel_Add_$(): Observable<boolean>{
        return this._ngxmodel_Add.asObservable();
    }

    _set_ngxmodel_Add(value:boolean){
        this._ngxmodel_Add.next(value);
    }

    ngxmodel_Edit_$(): Observable<boolean>{
        return this._ngxmodel_Edit.asObservable();
    }

    _set_ngxmodel_Edit(value:boolean){
        this._ngxmodel_Edit.next(value);
    }
    
}
