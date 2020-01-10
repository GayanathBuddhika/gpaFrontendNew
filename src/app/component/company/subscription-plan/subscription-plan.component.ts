import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs';

import { CompanyService } from './../../../service/company.service';
import { Company } from './../../../model/company';
import { PlanService } from './../../../service/plan.service';
import { SubscriptionsDetails } from '../../../model/subscriptionsDetails';
import { SubscriptionService } from './../../../service/subscription.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Plan } from 'src/app/model/plan';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrManager } from 'ng6-toastr-notifications';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.css']
})
export class SubscriptionPlanComponent implements OnInit, OnDestroy {

  
  // --- Subscription 
  private subscription: Subscription = new Subscription(); 
  // ---  for Get the Subscription plan when selecte the plan
  selectedSubscription: SubscriptionsDetails;
  // --- for disable the ngx DatePicker
  dateDisable: boolean = true;
  // --- for view the plan datials after select the start date( when create the starte date this will be a true)
  viewPlanDeatials: boolean = false;
  // --- for get the EndDateForSelectPlan as yyyy-mm-dd format
  formatEndDateForSelectPlan: string;
  // --- for get the startDate as yyyy-mm-dd format
  formatStartDate: string;
  // --- from subscription-plan-list-componnt
  @Input() editplan: Plan;
  // --- get plan for change from subscription-plan-list-componnt
  @Input() changePlan: Plan;
  // ---  from subscription-plan-list-componnt
  @Input() edit: boolean;
  // --- get start date from subscription-plan-list-componnt
  @Input() startDate: string;
  // --- if select the question this is true
  // ---from subscription-plan-list-componnt
  @Input() questionStatus: boolean;
  // --- get question type from subscription-plan-list-componnt
  @Input() questiontype:string;
  // --- this is true when select the start date
  selectDate:boolean=false;
  // --- get valid monts for each subscription paln
  validMonth: number;

  datePickerConfig: Partial<BsDatepickerConfig>;
  selectedComapanyForPlan: Company;
  subscriptionPlanForm: FormGroup;
  subscriptionPlanList: SubscriptionsDetails[] = [];

  private plan: Plan;

  constructor(
    private frm: FormBuilder,
    private subscriptionService: SubscriptionService,
    private planService: PlanService,
    private companyService: CompanyService,
    public toster: ToastrManager
  ) { }

  ngOnInit() {  
    this.getAllSubscription();
    this.subscriptionPlanForm = this.frm.group({
      company: [""],
      subscription: ["", Validators.required],
      startDate: [new Date().toJSON(),Validators.required],
      endDate: [""],
      enable: [""],
      date: [""]
    });

 

  // --- get selected company for create the plan
    this.subscription.add( 
      this.companyService._selectCompanyForPlan.pipe(untilDestroyed(this)).subscribe(data => {
        this.selectedComapanyForPlan = data;

      })
    );

    // --- check when we try extend the plan if it is enable or disable
    if(this.questionStatus){
      // --- if the plan is enable and we select the question set the vale for the subscriptionPlanFrom and set the mindate
       this.datePickerConfig = Object.assign({},
        {
          dateInputFormat: 'YYYY-MM-DD',
          minDate: new Date(this.startDate),        
        });
        this.subscriptionPlanForm.get('subscription').patchValue(this.changePlan.subscription);
        this.subscriptionPlanForm.get('company').patchValue(this.changePlan.company);     
        this.subscriptionPlanForm.get('startDate').patchValue(new Date(this.startDate));
        this.selectedSubscription =this.changePlan.subscription; 
        this.onSelectedStartDate()
     }else{     
          this.datePickerConfig = Object.assign({},
            {
              dateInputFormat: 'YYYY-MM-DD',   
              minDate: new Date(),          
            });   
     }
  }

  // --- convenience getter for easy access to form fields
  get f() {
    return this.subscriptionPlanForm.controls;
  }

  ngOnDestroy() {
    // --- unsubscribe all subscribe methode 
    this.subscription.unsubscribe();
  }

   // --- get all subscriptions
  getAllSubscription() {
      this.subscriptionService.listSubscription().pipe(untilDestroyed(this)).subscribe(data => {
        this.subscriptionPlanList = data;       
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
      })
  }

  onsubmit() {
    this.plan = this.subscriptionPlanForm.value;  
    if(this.questionStatus && this.questiontype ==="today"){      
       this.planService.changeEnablePlan(this.changePlan , this.questiontype).pipe(untilDestroyed(this)).subscribe(data => {   
          this.planService._addChangePlanToList.next(data);
          }, err =>{
            this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
      })
    }
    // --- create plan object for save if edit or new
    if (!this.edit) {  
      this.plan.company = this.selectedComapanyForPlan;     
    } else {
      this.plan.id = this.editplan.id;
      this.plan.ai = this.editplan.ai;
      this.plan.enable = this.editplan.enable;

    }
  // --- save plan
  this.subscription.add(
      this.planService.savePlan(this.plan, this.edit).pipe(untilDestroyed(this)).subscribe(data => {    
          if (!this.edit) {
            this.toster.successToastr("Successfully saved","Success", { position: "bottom-right", animate: "slideFromBottom" });          
            this.planService._addPlanToList.next(data);
            this.planService._set_ngxModal_add(true);      
          } else {
            this.toster.successToastr("Successfully edited","Success",  { position: "bottom-right", animate: "slideFromBottom" });
            this.planService._set_ngxmodal_edit(true);
            this.planService._editPlanToList.next(data);
          }      
      }, err => {
        
          if (!this.edit ) {
            this.planService._set_ngxModal_add(true);
          } else {
            this.planService._set_ngxmodal_edit(false);
          }
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })

      })
    );
      
  }

  compareplan(s1: SubscriptionsDetails, s2: SubscriptionsDetails) {
    return s1.id === s2.id;
  }

  onSelectedSubscription(subscription: SubscriptionsDetails) {
    this.selectedSubscription = subscription;   
        if(this.questionStatus){
          this.dateDisable = true;
          this.onSelectedStartDate();
        }else{
          this.dateDisable = false;
        }

        this.onSelectedStartDate();
  }

  onSelectedDate(){
    this.selectDate= true;
    this.onSelectedStartDate();
  }


  // --- get valid month when change the startdate and get plan object with endDate
  onSelectedStartDate(){ 
    const subscriptionPlan: Plan = this.subscriptionPlanForm.value;
    subscriptionPlan.company = this.selectedComapanyForPlan; 
        if(this.questionStatus){    
              if(this.dateDisable){
                this.validMonth= this.selectedSubscription.validMonths; 
              }else{
                this.validMonth = this.changePlan.subscription.validMonths;
              }
        }else{
          this.validMonth= this.selectedSubscription.validMonths;
        }   
      // --- for get the end date by back-end.    
        this.planService.getEndDate(this.validMonth, subscriptionPlan).pipe(untilDestroyed(this)).subscribe(data => {
        this.formatEndDateForSelectPlan = data.endDate;
        this.formatStartDate = data.startDate;  
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
      })  
    this.viewPlanDeatials = true;

  }



}
