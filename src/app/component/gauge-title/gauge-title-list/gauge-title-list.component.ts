import { AngularFireStorage } from 'angularfire2/storage';
import { GaugeTitle } from "../../../model/gaugeTitle";
import { GaugeTitleService } from "src/app/service/gauge-title.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrManager } from 'ng6-toastr-notifications';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
    selector: "app-gauge-title-list",
    templateUrl: "./gauge-title-list.component.html",
    styleUrls: ["./gauge-title-list.component.css"]
})
export class GaugeTitleListComponent implements OnInit ,OnDestroy{
    headers: any[];
    gaugeTitleList: GaugeTitle[]=[];
    assignDeptToBranch: any;

    constructor(
        private gaugeTitleService: GaugeTitleService,
        private router: Router,
        private afStorage: AngularFireStorage,
        public toastr: ToastrManager,
    ) { }

    ngOnInit() {
        this.getGaugeTitleList();
        this.headers = [
            { field: "no", header: "No" },
            { field: "title", header: "Gauge Title" },
            { field: "lowest", header: "Lowest" },
            { field: "lower", header: "Lower" },
            { field: "middle", header: "Middle" },
            { field: "higher", header: "Higher" },
            { field: "highest", header: "Highest" },
            { field: "preview", header: "Preview" },
            { field: "edit", header: "Edit" }
        ];
    }

    getGaugeTitleList() {
        this.assignDeptToBranch = JSON.parse(
            localStorage.getItem("currentUser")
        ).assignDeptToBranch.id;
        
        this.gaugeTitleService.findAllGaugeTitle(this.assignDeptToBranch).pipe(untilDestroyed(this)).subscribe(
            data => {
               
                data.forEach((res)=>{
                    if(res.imageType && res.imageType==="image"){
                        res.fireStore=this.afStorage.ref(`gauge-images/${res.image}`).getDownloadURL();
                    }
                  
                })

                this.gaugeTitleList=data;
            },
            err => {
                this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
            }
        );
    }

    // --- when edit redirect to gagueTitel component
    // --- set  gaugeTitle edit object as next value of  _get_edit_gauge_title_object
    // --- set _edit_gauge_title.next value as true
    getEditGaugeTitle(gaugeTitle: GaugeTitle, edit: boolean) {
        this.router.navigate(["/main/gaugetitle/add"]);
        this.gaugeTitleService._edit_gauge_title.next(edit);
        this.gaugeTitleService._get_edit_gauge_title_object.next(gaugeTitle);
    }

    ngOnDestroy(){

    }
}
