import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs/internal/Subject';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrowserPlatformLocation } from '@angular/platform-browser/src/browser/location/browser_platform_location';
import { SubscriptionsDetails } from '../model/subscriptionsDetails';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

   // --- base url use for get http://localhost:8081 
   baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private _ngxModal_add = new BehaviorSubject<boolean>(false);
  private _ngxModal_edit = new BehaviorSubject<boolean>(false);

  public _addSubscribeToList = new Subject<SubscriptionsDetails>();

  // for get subscription list
  listSubscription() {
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    return this.http.get<any>( this.baseUrl+"/subscription/FindAll", {});
  }

  // for save subscription list
  saveSubscription(subscription: SubscriptionsDetails) {
   // const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    return this.http.post<any>( this.baseUrl + "/subscription/save", subscription, {});
  }

  // for delete subscription list
  deleteSubscription(subscriptionId: string) {
    //const headers = new HttpHeaders({ "Access-Control-Allow-Origin": "*" });
    return this.http.post<any>( this.baseUrl + "/subscription/delete/" + subscriptionId, {});
  }

  _set_ngxModal_add(value: boolean) {
    this._ngxModal_add.next(value);
  }

  get_ngxModal_add_$(): Observable<boolean> {
    return this._ngxModal_add.asObservable();
  }

  _set_ngxModal_edit(value: boolean) {
    this._ngxModal_edit.next(value);
  }

  get_ngxModal_edit_$(): Observable<boolean> {
    return this._ngxModal_edit.asObservable();
  }


}
