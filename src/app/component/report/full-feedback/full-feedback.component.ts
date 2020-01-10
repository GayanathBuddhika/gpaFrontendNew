
import { CustomerFullFeedback } from './../../../model/CustomerFullFeedback';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomerService } from 'src/app/service/customer.service';
import { DatePipe } from '@angular/common';
import { ServeyService } from 'src/app/service/servey.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-full-feedback',
  templateUrl: './full-feedback.component.html',
  styleUrls: ['./full-feedback.component.css']
})
export class FullFeedbackComponent implements OnInit ,OnDestroy{

  startDate: any;
  endDate:any;
  today:any
  fullFeedbackList:CustomerFullFeedback[]=[];

  // --- to get the current user company Id
  companyId: string = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company.id;
  assignDeptToBranch:string = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.id;
  headers: any[];
  rowGroupMetadata: any;
  gaugeSurveyList: any [];
  getGaugeSurvey:any;

  countGaugeTitle=0;
  getGaugeTitle=true;

  pagination:any[];
  rowVal:number;

  

  constructor(
    public toastr: ToastrManager,
    private customerService:CustomerService,
    private datePipe:DatePipe,
    private surveySurvice:ServeyService ) { }

  ngOnInit() {
    
    this.today=new Date();

    this.getGagugeSurveyOfCompany(this.assignDeptToBranch);

    this.headers =
    [
      // { field: 'no', header: 'No'},
      { field: 'dateTime', header: 'Date Time'},
      { field: 'name', header: 'Name'},
      { field: 'phone', header: 'Phone'},
      { field: 'email', header: 'Email'},
      { field: 'survey', header: 'Survey'},
      { field: 'branch', header: 'Branch'},
      { field: 'department', header: 'Department'},
      { field: 'comment', header: 'Additional Comment'},
      { field: 'title', header: 'Title'},
      { field: 'value', header: 'Value'},
      { field: 'feedback', header: 'Feedback'}
    ];
  }


  getGagugeSurveyOfCompany(assignDeptToBranch:string){

    this.surveySurvice.getGaugeSurveyOfCompany(assignDeptToBranch).pipe(untilDestroyed(this)).subscribe(data=>{

      let gaugeSurvey:any[]=[]
      data.forEach(res=>{
        gaugeSurvey.push({'id':res.survey.id,'name':res.survey.name})
      })

      this.gaugeSurveyList=gaugeSurvey;

    },err=>{
      this.toastr.errorToastr(err.error.details, "Error", {
        position: "bottom-right",
        animate: "slideFromBottom"
      });
    })
  }


  //--- get time Period to list full feedback of customer
  getTimePeriod() {
   
    if(this.startDate> this.endDate || this.startDate=="" || this.endDate==""){
      this.toastr.errorToastr("Invalid date", "Error", {position: "bottom-right", animate: "slideFromBottom"});
    }else{
      this.customerService
      .getFullFeedback(
        this.companyId,
        this.datePipe.transform(this.startDate, "yyyy-MM-dd hh:mm:ss"),
        this.datePipe.transform(this.endDate, "yyyy-MM-dd hh:mm:ss"),
        this.getGaugeSurvey.id
      ).pipe(untilDestroyed(this))
      .subscribe(
        data => {          
         
          this.fullFeedbackList = data;
        },
        err => {
          this.toastr.errorToastr(err.error.details, "Error", {
            position: "bottom-right",
            animate: "slideFromBottom"
          });
        }
      );
      

    }
    
  }

  onSort() {
    this.updateRowGroupMetaData();
  }


// ---list full feedback of customer with rowGroup
updateRowGroupMetaData() {

 
    this.rowGroupMetadata = {};

    if (this.fullFeedbackList) {
        for (let i = 0; i < this.fullFeedbackList.length; i++) {
            let rowData = this.fullFeedbackList[i];
            let time = this.datePipe.transform(rowData.dateTime,'yyyy-MM-dd HH:mm');

            if (i == 0) {
              this.countGaugeTitle++;
                this.rowGroupMetadata[time] = { index: 0, size: 1 };
            }
            else {

                let previousRowData = this.fullFeedbackList[i - 1];
                let previousRowGroup = this.datePipe.transform(previousRowData.dateTime,'yyyy-MM-dd HH:mm');

                if (time === previousRowGroup){

                  if( this.getGaugeTitle){
                    this. countGaugeTitle++
                    
                    Promise.resolve(undefined).then(() => this.rowVal =  this.countGaugeTitle*5);
                    
                    Promise.resolve(undefined).then(() => this.pagination =  [this.countGaugeTitle*5,this.countGaugeTitle*10]);
                  
                  }
                    this.rowGroupMetadata[time].size++;

                   }
                  else{
                    this.getGaugeTitle=false;
                  this.rowGroupMetadata[time] = { index: i, size: 1 };
                }
      
            
        }
    }
 }

}

ngOnDestroy() {

}

}
 
