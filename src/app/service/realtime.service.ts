import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RealtimeService {

    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }

    getAllRealtimeSurvey() {
        return this.http.get<any>(this.baseUrl + "/realtime-survey/find-all");
    }
    getMatchKey(key: string, uuid: string) {
        let parameters = new HttpParams();
        parameters = parameters.set('key', key).set('uuid', uuid);
        return this.http.get<any>(this.baseUrl + "/realtime-survey/match-key", { params: parameters })
    }

    getAllSurveyKey(companyId: string) {
        let parameters = new HttpParams();
        parameters = parameters.set('companyId', companyId);
        return this.http.get<any>(this.baseUrl + "/realtime-survey/find-all-keys", { params: parameters })
    }
}
