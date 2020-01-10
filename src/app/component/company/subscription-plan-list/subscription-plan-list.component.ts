import { forEach } from '@angular/router/src/utils/collection';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PlanService } from './../../../service/plan.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Plan } from 'src/app/model/plan';
import { Subscription } from 'rxjs';
import { JsonPipe, DatePipe } from '@angular/common';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-subscription-plan-list',
  templateUrl: './subscription-plan-list.component.html',
  styleUrls: ['./subscription-plan-list.component.css']
})
export class SubscriptionPlanListComponent implements OnInit, OnDestroy {
  // --- for plan list table
  headers: any[];
  // --- get all created plan 
  planList: Plan[]=[]; 
  // --- for unsubscribe the subscribe methode
  private subscription: Subscription = new Subscription();
  // --- for modal
  modalRefSubPlanList: BsModalRef;
  // --- get plan when we try to edit
  selectPlan: Plan;
  // --- get rest plan of the planList without selectPlan
  changePlan: Plan;
  // --- for disable the planAdd button when planList have two plans
  disableButton: boolean = true; 
  // --- get answer for question when try to change paln in the plan duration
  planStart:string;
  // --- get current Date to compair first Plan startDate 
  currentDate = new Date();
  // --- 
 // planStatus: string;
   
 // --- for get the current date possition
  currentDateStatus: boolean;
  // --- for view the tow question for extend the subscription plan when plan is enable
  questionStatus: boolean= false;
  // --- get startDate of the first Plan in the planlist array and 
  // --- pass it to the subscription-plan-component.ts 
  startDate: string;
   // --- get selected company from companyList component
   @Input() selectedComId: string;

  constructor(
    private datePipe: DatePipe,
    private planService: PlanService,
     private modalService: BsModalService,
     public toster: ToastrManager) { }

  ngOnInit() {

    this.headers =
      [
        { field: 'no', header: 'No' },
        { field: 'plan_Name', header: 'Plan Name' },
        { field: 'start_date', header: 'Start Date' },
        { field: 'end_date', header: 'End Date' },
        { field: 'isEnabled', header: 'status' },
        { field: 'edit', header: 'Edit' }
      ];

    // -- get all plan by selectedComId
    this.getAllPlan();

    // --- add change plan to the planList (it is disable)
    this.planService._addChangePlanToList.pipe(untilDestroyed(this)).subscribe(data =>{
        this.questionStatus = false;     
        let pList = [...this.planList];
        pList.push(data);
        // --- remove change plan if it is enable
        this.planList= pList.filter((val,i)=>!(val.id === data.id && val.enable));     
    })


    // --- hide the subPlan template after edit the plan
    this.subscription.add(      
      this.planService.get_ngxModal_edit_$().pipe(untilDestroyed(this)).subscribe(data => {       
        if (data) {
          this.modalRefSubPlanList.hide();
        }
      })
    );


    // --- hide the subPlan template after add new plan
  this.subscription.add(      
    this.planService.get__ngxModal_add_$().pipe(untilDestroyed(this)).subscribe(data => {
      
      if (data) {
        this.modalRefSubPlanList.hide();
      }
    })
  );


   // --- get the edited plan object and shift it to the first eliment of the planList 
    this.subscription.add(
      this.planService._addPlanToList.pipe(untilDestroyed(this)).subscribe(data => {
        this.questionStatus = false;
        this.planStart = null;
        let pList = [...this.planList];
        pList.unshift(data);
        this.planList = pList;
        this.currentDateStatus= this.currentDate.getTime() < new Date(this.planList[0].startDate).getTime();
            // --- check currentDate and enable variable in the plan to disable the Extent Subscription Plan button 
            if(this.currentDateStatus && !this.planList[0].enable){           
              this.disableButton = true;                  
            }
            if(!this.currentDateStatus){         
              this.disableButton = false;
            }
      })
    );


    // --- get the new created plan object and shift it to the first eliment of the planList 
    this.subscription.add(
      this.planService._editPlanToList.pipe(untilDestroyed(this)).subscribe(data => {
        let index = this.planList.findIndex(plan => plan.id === data.id);
        this.planList[index] = data;
         // --- disable subscription add button if there is more than 2 subscription
              if (this.planList.length < 2) {
                this.disableButton = false;              
              }else{
                this.disableButton = true;
              }
      })
    );
  }

    // --- get all plan from backend
    getAllPlan() {       
      this.planService.findAllplanByComId(this.selectedComId).pipe(untilDestroyed(this)).subscribe(data => {
        if(data.length > 0){
            this.planList = data.sort((a,b)=> b.ai - a.ai);          
            this.currentDateStatus= this.currentDate.getTime() < new Date(this.planList[0].startDate).getTime();
            if(this.currentDateStatus && !this.planList[0].enable){           
              this.disableButton = true;                  
            } 
            if(!this.currentDateStatus){          
              this.disableButton = false;         
            }
          
        }else{
          this.disableButton = false;
        }
      
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
      })
  }


  onAdd(template){
    if(!this.currentDateStatus && this.planList.length>0 && this.planList[0].enable){
      this.questionStatus = true;         
    }else{
      this.openModal(template);
    }   
  }

  openModal(template: TemplateRef<any>) {  
    this.modalRefSubPlanList = this.modalService.show(template,{class: 'modal-lg'});
  }



  ngOnDestroy() {
    this.planService._set_ngxModal_add(false);
    this.planService._set_ngxmodal_edit(false);
    // --- unsubscribe all subscribe methode 
    this.subscription.unsubscribe();
  }

  onAddQuestion(queston:string,template){
        switch(queston){
            case "today":
                this.startDate = this.datePipe.transform(this.currentDate, "yyyy-MM-dd");
              break;
            case "afterEndDate":
                this.startDate = this.planList[0].endDate;     
              break;
        }
      this.changePlan = this.planList[0];
      this.openModal(template);
  }

}




