import { Component, OnInit, OnDestroy } from '@angular/core';
import { RealtimeService } from 'src/app/service/realtime.service';
import { RealtimeSurvey } from 'src/app/model/realtimeSurvey';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-realtime-key-list',
    templateUrl: './realtime-key-list.component.html',
    styleUrls: ['./realtime-key-list.component.css']
})
export class RealtimeKeyListComponent implements OnInit,OnDestroy {

    companyId: string = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company.id;
    realTimeSurvey: RealtimeSurvey[];
    headers: any[];
    constructor(private realtimeService: RealtimeService) { }

    ngOnInit() {

        this.headers = [
            { field: 'no', header: 'No'},
            { field: 'surveyName', header: 'Survey name'},
            { field: 'surveyKey', header: 'Key'}   
    
        ];

        this.realtimeService.getAllSurveyKey(this.companyId).pipe(untilDestroyed(this)).subscribe(res => {
            
            this.realTimeSurvey = res;
        })
    }

    ngOnDestroy() {

    }

}
