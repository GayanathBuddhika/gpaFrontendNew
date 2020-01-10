import { ClaimConverter } from './../../../model-converter/claimConverter';
import { RewardService } from 'src/app/service/reward.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-reward-claim',
  templateUrl: './reward-claim.component.html',
  styleUrls: ['./reward-claim.component.css']
})
export class RewardClaimComponent implements OnInit,OnDestroy {

  // ---headers of  reward list table
  headers:any[];

  // --- to get the current user branch Id
  branchId: string = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.branch.id;

  rewardList:ClaimConverter[];
  rewardClaimForm:FormGroup;


  constructor(
            private formBuilder: FormBuilder,
            private rewardService:RewardService,
            public toastr: ToastrManager,
            private confirmationService: ConfirmationService,
          ) { }

  ngOnInit() {
    
    this.headers = [
      { field: "no", header: "No" },
      { field: "title", header: "Reward Title" },
      { field: "startDate", header: "Claim Start Date" },
      { field: "endDate", header: "Reward End Date" },
      { field: "remainClaims", header: "Remain Claims"},
      { field: "message", header: "Message"},
      { field: "claim", header: "Claim"},
    ];

    this.rewardClaimForm = this.formBuilder.group({
      phone:["",Validators.required]
    })

  }

 

  // get existing rewardList 
  getExistReward(){

    if(this.rewardClaimForm.invalid){
      return;
    }

    this.rewardService.getExistingReward(this.branchId,this.rewardClaimForm.value.phone).pipe(untilDestroyed(this)).subscribe(data=>{
      
      var allRewardList=data;

      // ---check whether the customer has or not remainclaims
      allRewardList.forEach( (rewardObject,index) =>{
        
        // ---if remainClaims null set noOfClaims as remainClaims
        if(rewardObject.remainClaims == null){

          rewardObject.remainClaims =rewardObject.noOfClaims;

          // ---remove reward when they don't have remainClaims
          if(rewardObject.noOfClaims >0 && rewardObject.remainClaims <= 0 ){
            allRewardList.splice(index,1);
            this.rewardList = allRewardList;
          }

        }else{

          // ---remove reward when they don't have remainClaims
          if(rewardObject.noOfClaims >0 && rewardObject.remainClaims <= 0 ){
            allRewardList.splice(index,1);
            this.rewardList = allRewardList;

          }
            this.rewardList = allRewardList;
        }
        
      })

    },err=>{
      this.toastr.errorToastr(err.error.details,"Error", {position: "bottom-right", animate: "slideFromBottom"});
    })
    
  }

  // ---check whether the customer can claim or not
  claim(reward:ClaimConverter){

    // ---check whether there are existing reward or not
    if(reward.claimLimits>0 && reward.alreadyClaimed==reward.claimLimits){

      this.toastr.errorToastr("claim limit exceeded","Error",{position:"bottom-right",animate:"slideFromBottom"})

    }else{

      this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          
          // ---create claim 
          this.rewardService.createClaim(reward,this.rewardClaimForm.value.phone).pipe(untilDestroyed(this)).subscribe(data=>{

            let itemIndex =this.rewardList.findIndex(item=> item.rewardId ==data.rewardId);

            if(data.remainClaims == 0){

              this.rewardList.splice(itemIndex,1);
              this.rewardList = this.rewardList;

            }else{

              this.rewardList[itemIndex] = data;

            }
            

          },err=>{

            this.toastr.errorToastr("claim limit exceeded","Error",{position:"bottom-right",animate:"slideFromBottom"})
          })
           
        },
        reject: () => {

        }
    });
      
    }

  }

  isFieldValid(field: string) {
    return !this.rewardClaimForm.get(field).valid && this.rewardClaimForm.get(field).touched;
  }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {          
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

    // --- convenience getter for easy access to form fields
    get f() {
    return this.rewardClaimForm.controls;
    }

    ngOnDestroy() {

    }
  

}
