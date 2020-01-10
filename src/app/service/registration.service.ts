import { Injectable } from '@angular/core';


import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Registration } from '../model/registration';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    save(registration:Registration): Observable<any> {      
       
        
        return this.http.post<any>(this.baseUrl + "/user/register", registration);
    }
}
