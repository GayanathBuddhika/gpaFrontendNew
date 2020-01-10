import { SubscriptionsDetails } from '../../../model/subscriptionsDetails';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SubscriptionService } from './../../../service/subscription.service';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-subscription-add',
  templateUrl: './subscription-add.component.html',
  styleUrls: ['./subscription-add.component.css']
})
export class SubscriptionAddComponent implements OnInit,OnDestroy {

   // --- Subscription 
   private subscription: Subscription = new Subscription();
 
  // --- for reactive form
  subscriptionFrom: FormGroup;
  subscriptionForSave : SubscriptionsDetails;

  private savedSubscription : SubscriptionsDetails;


  constructor(private frm: FormBuilder, private subscriptionService: SubscriptionService, public toster: ToastrManager) { }

  ngOnInit() {
    // --- fro reactive form
    this.subscriptionFrom = this.frm.group({
      planName: ["",Validators.required],
      noOfCustomer: ["",[Validators.required,Validators.pattern("^[1-9][0-9]*$")]],
      noOfSurvey: ["",[Validators.required,Validators.pattern("^[1-9][0-9]*$"),Validators.min(1),Validators.max(3)]],
      validMonths: ["",[Validators.required,Validators.pattern("^[1-9][0-9]*$"),Validators.min(1),Validators.max(12)]]
    });
  }
  
  ngOnDestroy() {
    // --- unsubscribe all subscribe methode 
    this.subscription.unsubscribe();
}

  get f(){
    return this.subscriptionFrom.controls;
  }


  onsubmit() {
    console.log(this.subscriptionFrom.value);
      
    this.validateAllFormFields(this.subscriptionFrom)
    if (this.subscriptionFrom.invalid) {  
         
      return;
    }
    this.subscriptionForSave = this.subscriptionFrom.value;
     this.subscription.add(
     
      this.subscriptionService.saveSubscription(this.subscriptionForSave).subscribe(data => {
        console.log(data);
  
        this.savedSubscription = data;
        this.toster.successToastr("success", "data successfully saved", {position:"bottom-right", animate: "slideFromBottom"})
        this.subscriptionService._set_ngxModal_add(true);
        this.subscriptionService._addSubscribeToList.next(this.savedSubscription);
      }, err => {
        
        this.toster.errorToastr(JSON.parse(JSON.stringify(err)).error.message, "Error", {position:"bottom-right", animate: "slideFromBottom"})
        this.subscriptionService._set_ngxModal_add(true);
      })
      
     );

   
  }

  onReset(){
    this.subscriptionFrom.reset();
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



  isFieldValid(field: string) {
    return !this.subscriptionFrom.get(field).valid && this.subscriptionFrom.get(field).touched;
  }




  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }


}
