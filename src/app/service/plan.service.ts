import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plan } from '../model/plan';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  
    // --- base url use for get http://localhost:8081 
    baseUrl = environment.apiUrl;

  private _ngxModal_add = new BehaviorSubject<boolean>(false);
  private _ngxModal_edit = new BehaviorSubject<boolean>(false);

  public _addPlanToList = new Subject<Plan>();
  public _addChangePlanToList = new Subject<Plan>();
  public _editPlanToList = new Subject<Plan>();

  constructor(private http: HttpClient) { }



  // for save subscription list
  savePlan(plan: Plan, edit: any) {
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    let parameters = new HttpParams();
    parameters = parameters.set('edit', edit);
    return this.http.post<any>(this.baseUrl + "/plan/save", plan, {params: parameters });
  }

  findAllplanByComId(id: String) {
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });

    return this.http.get<any>(this.baseUrl + "/plan/findPlan/" + id, {});

  }

  getEndDate(validMonth: number, plan : Plan) {
   // const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    return this.http.post<any>(this.baseUrl + "/plan/endDate/" +validMonth,plan, {});
  }


  changeEnablePlan(changePlan:Plan , questiontype:string){
    return this.http.post<any>(this.baseUrl + "/plan/changeEnablePlan/" +questiontype,changePlan, {});
  }
  _set_ngxModal_add(value: boolean) {
    this._ngxModal_add.next(value);
  }

  get__ngxModal_add_$(): Observable<boolean> {
    return this._ngxModal_add.asObservable();
  }

  get_ngxModal_edit_$(): Observable<boolean> {
    return this._ngxModal_edit.asObservable();
  }

  _set_ngxmodal_edit(value: boolean) {
    this._ngxModal_edit.next(value);
  }

}
