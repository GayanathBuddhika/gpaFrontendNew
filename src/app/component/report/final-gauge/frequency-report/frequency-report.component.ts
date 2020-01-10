import { GaugeTitleService } from 'src/app/service/gauge-title.service';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CustomerService } from 'src/app/service/customer.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FinalGauge } from 'src/app/model/FinalGauge';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: "app-frequency-report",
  templateUrl: "./frequency-report.component.html",
  styleUrls: ["./frequency-report.component.css"]
})
export class FrequencyReportComponent implements OnInit,OnDestroy {

  // ---headers of frequency Customer list table
  headers:any[];

  // ---headers of frequency customer's view survey list table
  headers2: any[];
  
  // --- to get the current user company Id
  companyId: string = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company.id;

  // --- ChartData and DataSet are used for Chrt.js,
  chartData: ChartData;

  // ---for reportType dropdown
  reportType: any[];
  getReportType:any;

  dataSets:DataSet;

  startDate: any;
  endDate:any;
  today:any
  frequencyCustomerList:NamePhoneEmailVisits[] =[];
  frequencyCustomerViewSurveysList:FinalGauge[]=[];
  frequencyCustomer: NamePhoneEmailVisits;
  modalRef_action: BsModalRef;
  modalRef_weightedAvg:BsModalRef;

  minVisit: number;
  maxVisit: number;

  constructor(
              private datePipe:DatePipe,
              private customerService:CustomerService,
              public toastr: ToastrManager,
              private modalService: BsModalService,
              private gaugeTitleService:GaugeTitleService) { }

  ngOnInit() {

    this.reportType=[
      {name:'Frequency'},
      {name:'Churn'}
    ]

    this.today=new Date();

    this.headers = [
      { field: "no", header: "No" },
      { field: "name", header: "Name" },
      { field: "phone", header: "Phone" },
      { field: "email", header: "Email" },
      { field: "visit", header: "Visits" },
      { field: "action", header: "Action" }
    ];

    this.headers2 = [
      { field: "no", headesr: "No" },
      { field: "surveyname", header: "Survey Name" },
      { field: "surveytype", header: "Survey Type" },
      { field: "branchname", header: "Branch Name" },
      { field: "departmentname", header: "Department Name" },
      { field: "action", header: "Action" }
    ];

    
  }

  getCustomerType(){
    this.startDate="";
    this.endDate="";
  }

  //--- get time Period to list churn customer
  getTimePeriod() {
   
    if(this.startDate> this.endDate || this.startDate=="" || this.endDate==""){
      this.toastr.errorToastr("Invalid date", "Error", {position: "bottom-right", animate: "slideFromBottom"});
    }else{
      this.customerService
      .getCustomer(
        this.getReportType.name,
        this.companyId,
        this.datePipe.transform(this.startDate, "yyyy-MM-dd hh:mm:ss"),
        this.datePipe.transform(this.endDate, "yyyy-MM-dd hh:mm:ss")
      ).pipe(untilDestroyed(this))
      .subscribe(
        data => {          
          this.frequencyCustomerList = data;
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

  
 
  // ---viewSurveys of frequency customer
  viewSurveys(frequencyCustomer: NamePhoneEmailVisits, template_action) {

    this.openModalAction(template_action);

    this.customerService.getSurveysOfCustomer(frequencyCustomer.customerId,this.companyId).pipe(untilDestroyed(this)).subscribe(data=>{
      
      this.frequencyCustomerViewSurveysList =data;

    },err=>{
      this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    });
  }


  openModalAction(template1: TemplateRef<any>) {
    this.modalRef_action = this.modalService.show(template1, {
      class: "modal-lg"
    });
  }

  // ---get weighted average that given by customer
  getWeightedAvg(frequencyCustomerviewSurvey:FinalGauge,weightedAvg){

    this.openModalweightedAvg(weightedAvg);

    this.gaugeTitleService.getWeightedAvgVal(frequencyCustomerviewSurvey.survey.id,frequencyCustomerviewSurvey.customerOrEmployeeId,this.companyId).pipe(untilDestroyed(this)).subscribe(val=>{
    
      this.chartData = new ChartData();
      this.dataSets = new DataSet();

      val.forEach(data=>{

      this.chartData.labels.push(this.datePipe.transform(data.dateTime,"yyyy-MM-dd"));

      this.dataSets.backgroundColor = '#42A5F5';
      this.dataSets.borderColor = '#1E88E5';

      this.dataSets.data.push(data.avg);
      
      // --- Then set the array to Dataset class of  ChartData class
      this.chartData.datasets.push(this.dataSets);
      })
      
    },err=>{
      this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    })
  }

  openModalweightedAvg(template2: TemplateRef<any>){
    this.modalRef_weightedAvg = this.modalService.show(template2, {
      class: "modal-lg"
    });
  }

  ngOnDestroy() {

  }

  
}
export class ChartData{
  labels:string[]=[];
  datasets:DataSet[]=[];    
}

export class DataSet{
  data:any[]=[];
  label?: string;
  backgroundColor?:string;
  borderColor?:string;
  constructor(){}
}