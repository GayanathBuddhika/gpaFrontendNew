import { Plan } from './../model/plan';
import { environment } from 'src/environments/environment';


import { Observable, BehaviorSubject } from 'rxjs';
import { Company } from './../model/company';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

    // --- base url use for get http://localhost:8081 
    baseUrl = environment.apiUrl;

  // --- create referance variable to get company object when select a company from company dropdown list.
  // --- this is use in branch , department and assign department to branch components. 
  private _company_DropDown  = new BehaviorSubject<any>("");

  private _ngxModal_add = new BehaviorSubject<boolean>(false);
  private _ngxModal_edit = new BehaviorSubject<boolean>(false);
 
  public _addCompanyToList = new Subject<Company>();
  public _editCompanyToList = new Subject<Company>();


  // this is get a comapny object when add subscription plan for paticuler comapny
  public _selectCompanyForPlan = new BehaviorSubject<Company>(null);


  selectedCompany = new EventEmitter();

  constructor(private http: HttpClient) { }

  addCompany(company: Company, branchName:string,departmentName:string, stringPlan: string,stringSurveySelection: string) {
    let parameters = new HttpParams();
    parameters = parameters
    .set('branchname',branchName)
    .set('departmentname',departmentName)
    .set('stringPlan',stringPlan)
    .set('stringSurveySelection',stringSurveySelection);   
    return this.http.post<any>(this.baseUrl + "/company/save", company, {params: parameters});
  }

  deleteCompany(companyId: string) {   
    return this.http.post<any>(this.baseUrl + "/company/delete/" + companyId,{});
  }

  // ---for get Company list
  listCompany() {
    return this.http.get<any>(this.baseUrl + "/company/FindAll");
  } 

  // upadateComany(companyId: string,company: Company) {
  //   return this.http.post<any>(this.baseUrl + "/company/update/"+companyId, company);

  // }

  // --- make _get_company asobservable to get next value 
  get_company_dropdown_$(): Observable<any> {
    return this._company_DropDown.asObservable();
  }

  // --- This is to get dompany_dropdown next value from company-list-dropdown-component
  _set_company_dropdown(company:Company): void{
    return this._company_DropDown.next(company);
  }

  _set_ngxModal_add(value: boolean){
    this._ngxModal_add.next(value);
  }
 
  get_ngxModal_add_$(): Observable<boolean>{
    return this._ngxModal_add.asObservable();
  }

  _set_ngxModal_edit(value: boolean){
    this._ngxModal_edit.next(value);
  }

  get_ngxModal_edit_$(): Observable<boolean>{
    return this._ngxModal_edit.asObservable();
  }

}
