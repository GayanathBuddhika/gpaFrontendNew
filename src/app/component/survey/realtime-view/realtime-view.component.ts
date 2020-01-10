import { ServeyService } from 'src/app/service/servey.service';
import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { RealtimeService } from 'src/app/service/realtime.service';
import { RealtimeSurvey } from 'src/app/model/realtimeSurvey';
import { ToastrManager } from 'ng6-toastr-notifications';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
    selector: 'app-realtime-view',
    templateUrl: './realtime-view.component.html',
    styleUrls: ['./realtime-view.component.css']
})
export class RealtimeViewComponent implements OnInit,OnDestroy {

    realtimeSurveyMap: any;
    @ViewChildren('key') key: QueryList<ElementRef>;

    count: number = 0;


    constructor(private realtimeService: RealtimeService, public toastr: ToastrManager, private router: Router) { }

    ngOnInit() {

        this.realtimeService.getAllRealtimeSurvey().pipe(untilDestroyed(this)).subscribe(res => {
           
            this.realtimeSurveyMap = res;
        }, err => {
            this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
        })
    }


    onMatchClick(key, surveyId,purl) {       
        this.realtimeService.getMatchKey(key, surveyId).pipe(untilDestroyed(this)).subscribe(data => {
            if (!data) {                
                this.toastr.errorToastr("The key is incorrect", "Error", { position: "bottom-right", animate: "slideFromBottom" })
            }
        }, err => {
            this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
        })

    }

    ngOnDestroy() {

    }

}
