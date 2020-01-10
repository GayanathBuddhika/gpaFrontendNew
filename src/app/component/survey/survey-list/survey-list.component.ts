import { Component, OnInit, OnDestroy } from '@angular/core';
import { DptNameSurveyUuid } from 'src/app/model/DptNameSurveyUuid';
import { ServeyService } from 'src/app/service/servey.service';
import { ConfirmationService } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit,OnDestroy {

  // ---Headers for Disabled surveyList table
  headers1:any[];

  // ---Headers for Enabled surveyList table
  headers2:any[];
  serveyType:any[];

  surveyList: DptNameSurveyUuid[];
  disabledsurveyList: DptNameSurveyUuid[];
  duplicateSurveyList:DptNameSurveyUuid[];
  duplicateDisabledsurveyList:DptNameSurveyUuid[];
  assignDeptToBranch:string;
  selectedServeyType:any[];

  constructor(private surveyService:ServeyService, private router:Router,
              private confirmationService: ConfirmationService,
              public toastr: ToastrManager,private clipboardService: ClipboardService) { }

  ngOnInit() {
    this.getSurveyList();
    this.getSurveyType();
    this.headers1 =
    [
      { field: 'no', header: 'No'},
      { field: 'surveyName', header: 'Name'},
      { field: 'uuid', header: 'Survey'},
      { field: 'selectionType', header: 'Selection Type'},
      { field: 'copyUrl', header: 'Copy URL'},
      { field: 'dsurvey', header: 'Disable'}
    ];

    this.headers2 =
    [
      { field: 'no', header: 'No'},
      { field: 'surveyName', header: 'Name'},
     
      { field: 'selectionType', header: 'Selection Type'},
      { field: 'restart', header: 'Restart'}
    ];

    
  }

  // ---This is to get Enabled and Disabled SurveyList
  getSurveyList(){
    this.assignDeptToBranch=(JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.id;
    this.surveyService.getSurveyofCustomer(this.assignDeptToBranch).pipe(untilDestroyed(this)).subscribe(data=>{
      this.surveyList = data.enabledSurvey;
      this.disabledsurveyList = data.disabledSurvey;

      this.duplicateSurveyList=JSON.parse(JSON.stringify(data.enabledSurvey));
      this.duplicateDisabledsurveyList=JSON.parse(JSON.stringify(data.disabledSurvey));
    },err=>{
      this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    })
  }

  // ---This is use to disable survey 
  // ---when click remove button, disable that survey
  // ---remove it from  EnabledSurvey list
  // ---add if into Disabledsurvey list
  surveyDisable(survey:DptNameSurveyUuid){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.surveyService.disabledSurvey(survey).pipe(untilDestroyed(this)).subscribe(data=>{
          
          const index =this.surveyList.indexOf(survey);
          this.surveyList = this.surveyList.filter((val,i) => i !== index); 

          let sList = [...this.disabledsurveyList];         
          sList.unshift(survey)
          this.disabledsurveyList = sList; 
          this.toastr.successToastr("Success", "Survey is desable", {position: "bottom-right", animate: "slideFromBottom"}); 
         }, err => {
          this.toastr.errorToastr(JSON.parse(JSON.stringify(err)).error.message, "Error", {position: "bottom-right", animate: "slideFromBottom"});
         });
      },
      reject: () => {

      }
  });
   
  }


  onNavigateSurvey(uid,type){    
      if(type==='gauges'){
        this.router.navigate(['/gauge',uid,(JSON.parse(localStorage.getItem('currentUser'))).id]);
      }else if(type==='question-and-answer'){
        this.router.navigate(['/qa',uid])
      }else if(type==='real-time-feedback'){
        this.router.navigate(['/rt',uid])
      }else{
          console.log("No survey")
      }
  }

  onCopy(purl,type){
    const baseURL = window.location.protocol + '//' + window.location.host;
let url='';
    if(type==='gauges'){
        url=baseURL+'/gauge/'+purl+'/'+(JSON.parse(localStorage.getItem('currentUser'))).id+'?abd='+(JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.id

      } else if(type==='question-and-answer'){
        url=baseURL+'/qa/'+purl
      }else if(type==='real-time-feedback'){
        url=baseURL+'/rt/'+purl
      }else{
          console.log("No survey")
      }

    this.clipboardService.copyFromContent(url);
    this.toastr.infoToastr("URL is copied to clipboard", "Copied", {position: "bottom-right", animate: "slideFromBottom"});
  }

  // ---This is use to restart survey 
  // ---when click restart button, enable that survey
  // ---remove it from  DisabledSurvey list
  // ---add if into Enabledsurvey list
  restartServey(disabledsurvey:DptNameSurveyUuid){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.surveyService.disabledSurvey(disabledsurvey).pipe(untilDestroyed(this)).subscribe(data=>{
          const index =this.disabledsurveyList.indexOf(disabledsurvey);
          this.disabledsurveyList = this.disabledsurveyList.filter((val,i) => i !== index); 

          let sList = [...this.surveyList];         
          sList.unshift(disabledsurvey)
          this.surveyList = sList; 
          this.toastr.successToastr("Success", "Survey is restarted", {position: "bottom-right", animate: "slideFromBottom"}); 
         }, err => {
          this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
         });
      },
      reject: () => {

      }
  });
   
  }

  // ---get surveyType for dropdown
  getSurveyType(){
    this.surveyService.getServeyType().pipe(untilDestroyed(this)).subscribe(data=>{
      console.log(data);this.serveyType= data;
    },err=>{
      this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
    })
  }

  getSelectedSurveyTypeList(event){

    // ---befor filtering servey type get initial value of the lists
    this.surveyList= this.duplicateSurveyList;
    this.disabledsurveyList=this.duplicateDisabledsurveyList;
    
    // ---filters surveyList by serveyType
    this.surveyList.forEach(data=>{
      if(data.name != event){
        const index =this.surveyList.indexOf(data);
        this.surveyList = this.surveyList.filter((val,i) => i !== index); 
      }
    })
    
    // ---filters disabledsurveyList by serveyType
    this.disabledsurveyList.forEach(data=>{
      if(data.name != event){
        const index =this.disabledsurveyList.indexOf(data);
        this.disabledsurveyList = this.disabledsurveyList.filter((val,i) => i !== index); 
      }
    })
   
  }

  ngOnDestroy() {

  }
}
