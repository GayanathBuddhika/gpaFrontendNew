import { Company } from 'src/app/model/company';
import { DatePipe } from '@angular/common';
import { Branch } from 'src/app/model/branch';
import { BranchService } from 'src/app/service/branch.service';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { RewardService } from 'src/app/service/reward.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Reward } from 'src/app/model/reward';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidateFields } from 'src/app/function/validate-fields';
import { ConsoleService } from '@ng-select/ng-select/ng-select/console.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css']
})
export class RewardComponent implements OnInit,OnDestroy {

   // ---headers of  Customer list table
   headers:any[];

  // --- to get the current user company Id
  company: Company = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company;

  branchList:Branch[];
 
  // ---for create reward object
  reward:Reward;

  // ---create reward type object array for dropdown
  rewardType:any[];

  // ---create symbol array object for dropdown
  symbols:any[];

  // ---get customer list when reset customer list table 
  customerList:NamePhoneEmailVisits[]=[];

  // ---get object of customer that wanted to remove
  removedCustomer:number = 0;

  // ---get available branchId list form branchIdList object that selected by user 
  availableBranches:string;

  // ---get selectedType of reward from dropdown
  selectedType: boolean=false;

  // ---for reset customer
  duplicateCustomerList:NamePhoneEmailVisits[]=[];

  // ---get existing customer list
  // --- after delete some customer remove that customer from customer list array
  // --- when again click show customer this use to get existing customer
  getExistingCustomer:boolean = false;

  today: Date;
  modalRef_action: BsModalRef;
  addRewardForm: FormGroup;
  finalMessage:string;


  constructor(
            private branchService:BranchService,
            private rewardService:RewardService,
            private modalService: BsModalService,
            private formBuilder: FormBuilder,
            public datePipe:DatePipe,
            public toastr: ToastrManager) { }

  ngOnInit() {

    this.addRewardForm = this.formBuilder.group({
      branch:["",Validators.required],
      type:["",Validators.required],
      startDate:["",Validators.required],
      endtDate:["",Validators.required],
      visitedTime:["",Validators.required],
      symbol:["",Validators.required],
      title:["",[Validators.required,Validators.maxLength(2)]],
      noOfClaims:["",[Validators.required,Validators.pattern('^(?:[1-9][0-9]*)$')]],
      noOfClaimsValue:["unlimited",Validators.required],
      claimLimit:["",[Validators.required,Validators.pattern('^(?:[1-9][0-9]*)$')]],
      claimLimitsValue:["unlimited",Validators.required],
      rewardStartDate:["",Validators.required],
      rewardEndDate:["",Validators.required],
      message:[""]
    })

    this.headers = [
      { field: "no", header: "No" },
      { field: "name", header: "Name" },
      { field: "phone", header: "Phone" },
      { field: "visit", header: "Visits" },
      { field: "delete", header: "Remove"}
    ];
    
    this.getCurrentBranches(this.company.id);

    this.today=new Date();
    
    this.rewardType=[
      {name:"frequency"},
      {name:"customizable"}
    ];

    this.symbols=[
      {name:"<="},
      {name:">="},
      {name:"="}
    ]
  }

  // ---get current Branches list by companyId
  getCurrentBranches(companyId: string){
    this.branchService.getBranch(companyId).pipe(untilDestroyed(this)).subscribe(data=>{
      
      this.branchList =data;
    })
  }



  // ---get value when reward type select
  onChangeRewardType(event){
    
      if(event.name === "frequency")
        {this.selectedType=true;}
      else
      {this.selectedType=false;}

  }
  existCustomer(){
    this.getExistingCustomer= false;
  }

  // ---get customer list related to the sent branches list and the company
  getCustomerList(){
   
    
    let branchIds:any[]=[];

    // ---create array of branchIdList from branchList array
    this.addRewardForm.value.branch.map(obj =>{ 
      branchIds.push(obj.id);
    });

    // ---convert branchIdList into string with symbol
    this.availableBranches =":"+branchIds.toString().replace(/\[/g, "").replace(/\,/g, ":").replace(/\]/g, "")+":";
 
    if(this.getExistingCustomer != true){
          // ---validate for Minimum Reward Sentiments row it cann't be 0 with <= 
        if(this.addRewardForm.get('visitedTime').value == 0 && this.addRewardForm.get('symbol').value.name=="<="){

          this.toastr.errorToastr("Invalid Minimum Reward Sentiments","Error",{position:"bottom-right",animate:"slideFromBottom"})

        }else{

            if(this.selectedType){

              this.rewardService.getCustomerList(JSON.stringify(branchIds),
              this.datePipe.transform(this.addRewardForm.get('startDate').value, "yyyy-MM-dd hh:mm:ss"),
                  this.datePipe.transform(this.addRewardForm.get('endtDate').value, "yyyy-MM-dd hh:mm:ss"),
                  this.addRewardForm.get('visitedTime').value,this.addRewardForm.get('symbol').value.name).pipe(untilDestroyed(this)).subscribe(data=>{
                  this.customerList = data;
                  
                  this.duplicateCustomerList = JSON.parse(JSON.stringify(data));

              },err=>{

                this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
            
              })

            }else{
              
              // ---reward creart for customizable customer
              this.rewardService.getCustomizableCustomer(JSON.stringify(branchIds),this.addRewardForm.get('visitedTime').value,this.addRewardForm.get('symbol').value.name).pipe(untilDestroyed(this)).subscribe(data=>{
                this.customerList = data;
                
                this.duplicateCustomerList = data;
              })

            }
              

        }
    }
      this.getExistingCustomer= true;

    }
   
   
  showCustomerList(template_action){
    
    if(this.getExistingCustomer !=true){
      this.removedCustomer = 0;
    }
    this.getCustomerList();

    this.openModalShowCustomer(template_action);
  }

  openModalShowCustomer(template1: TemplateRef<any>) {
    this.modalRef_action = this.modalService.show(template1, {
      class: "modal-lg"
    });
  }

  // ---remove customer form list 
  removeCustomer(customer){

          let index=this.customerList.indexOf(customer)
          this.customerList = this.customerList.filter((val,i) => i!=index); 
          this.removedCustomer++;
     
  }
 
  // ---reset removed customer
  resetCustomer(){
    
    this.customerList = this.duplicateCustomerList;
    this.removedCustomer=0;
  }

  createMessage(event){
    
   // --- when select customizable set default value for startDate field 
   // --- then it becom as valid field
   if(this.addRewardForm.controls['startDate'].invalid && !this.selectedType){
    this.addRewardForm.controls['startDate'].setValue("Thu Jul 04 2019 12:25:59 GMT+0530");
   }

   // --- when select customizable set default value for endDatefield 
   // --- then it becom as valid field
   if(this.addRewardForm.controls['endtDate'].invalid && !this.selectedType){
    this.addRewardForm.controls['endtDate'].setValue("Thu Jul 04 2019 12:25:59 GMT+0530");
   }

   // --- when select unlimited set default value for noOfClaims field 
   // --- then it becom as valid field
   if(this.addRewardForm.controls['noOfClaims'].invalid && this.addRewardForm.get('noOfClaimsValue').value =="unlimited"){
      this.addRewardForm.controls['noOfClaims'].setValue(5);
    }

    // --- when select unlimited set default value for claimLimit field 
    // --- then it becom as valid field
    if(this.addRewardForm.controls['claimLimit'].invalid && this.addRewardForm.get('claimLimitsValue').value =="unlimited"){
        this.addRewardForm.controls['claimLimit'].setValue(5);
    }  
    
    // ---when first click set the end date otherwise that value show as null
    // --- then form addRewardForm is invalid
    this.addRewardForm.controls['rewardEndDate'].setValue(event);

    // ---create message acording to input value 
   if(this.addRewardForm.valid && this.addRewardForm.get('noOfClaimsValue').value =="unlimited"){

      this.finalMessage ="CONGRATS!\nYou have earned unlimited rewards, "
        +" Valid till "+this.datePipe.transform(event, "yyyy-MM-dd")
        +". \nreward No: "+ (Math.floor(Math.random()*90000) + 10000);

   }
   if(this.addRewardForm.valid && this.addRewardForm.get('noOfClaimsValue').value =="limited"){

      this.finalMessage ="CONGRATS!\nYou have earned "+ this.addRewardForm.get('noOfClaims').value+" rewards, "
          +" Valid till "+this.datePipe.transform(event, "yyyy-MM-dd")
          +". \nreward No: "+ (Math.floor(Math.random()*90000) + 10000);
     
   }

  }

  
  // ---create reward
  createReward(){

  this.reward = new Reward();

  // --- call common function 
  ValidateFields(this.addRewardForm);

  let customerId:any[]=[];
  this.customerList.map(obj =>{ 
    customerId.push(obj.customerId);
   });

   // --- when select unlimited set default value for noOfClaims field 
   // --- then it becom as valid field
   if(this.addRewardForm.get('noOfClaimsValue').value =="unlimited"){
    this.addRewardForm.controls['noOfClaims'].setValue(5);
    this.reward.noOfClaims =0;

    }else{
    this.reward.noOfClaims= this.addRewardForm.get('noOfClaims').value;
    }

    // --- when select unlimited set default value for claimLimit field 
    // --- then it becom as valid field
    if(this.addRewardForm.get('claimLimitsValue').value =="unlimited"){
        this.addRewardForm.controls['claimLimit'].setValue(5);
        this.reward.claimLimits =0;

    }else{
    this.reward.claimLimits= this.addRewardForm.get('claimLimit').value;
    }

    // --- when select customizable set default value for startDate field 
    // --- then it becom as valid field
    if(this.addRewardForm.controls['startDate'].invalid && !this.selectedType){
    this.addRewardForm.controls['startDate'].setValue("Thu Jul 04 2019 12:25:59 GMT+0530");
    }

    // --- when select customizable set default value for endDatefield 
    // --- then it becom as valid field
    if(this.addRewardForm.controls['endtDate'].invalid && !this.selectedType){
    this.addRewardForm.controls['endtDate'].setValue("Thu Jul 04 2019 12:25:59 GMT+0530");
    }

    // --- stop here if form is invalid
    if (this.addRewardForm.invalid) {
    return;
    }


   this.reward.title = this.addRewardForm.get('title').value;
   this.reward.startDate =  this.datePipe.transform(this.addRewardForm.get('rewardStartDate').value, "yyyy-MM-dd hh:mm:ss");
   this.reward.endDate = this.datePipe.transform(this.addRewardForm.get('rewardEndDate').value, "yyyy-MM-dd hh:mm:ss");
   this.reward.message= this.finalMessage;
   this.reward.disabled= false;
   this.reward.customerCount= this.customerList.length;
   this.reward.availableBranchs = this.availableBranches;
   this.reward.company= this.company;
   this.reward.customerId= ":"+customerId.toString().replace(/\[/g, "").replace(/\,/g, ":").replace(/\]/g, "")+":";
   
   if(this.reward.customerCount == 0){
    this.toastr.errorToastr("Number Of Customers is 0","Error",{position:"bottom-right",animate:"slideFromBottom"})
   }else{
    
    this.rewardService.saveReward(this.reward).pipe(untilDestroyed(this)).subscribe(data=>{
      
      this.toastr.successToastr( "Reward created", "Success", { position: "bottom-right", animate: "slideFromBottom" });
    },err=>{
      this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
    })
   }
  }

  onReset(){
    this.addRewardForm.reset();
    
}

  isFieldValid(field: string) {
    return !this.addRewardForm.get(field).valid && this.addRewardForm.get(field).touched;
  }

  // validateAllFormFields(formGroup: FormGroup) {
  //   Object.keys(formGroup.controls).forEach(field => {          
  //       const control = formGroup.get(field);
  //       if (control instanceof FormControl) {
  //           control.markAsTouched({ onlySelf: true });
  //       } else if (control instanceof FormGroup) {
  //           this.validateAllFormFields(control);
  //       }
  //   });
  // }

  displayFieldCss(field: string) {
    return {
        'has-error': this.isFieldValid(field),
        'has-feedback': this.isFieldValid(field)
    };
  }

  // --- convenience getter for easy access to form fields
  get f() {
    return this.addRewardForm.controls;
  }

  ngOnDestroy() {

  }
}
