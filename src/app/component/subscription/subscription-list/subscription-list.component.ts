import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import { SubscriptionsDetails } from '../../../model/subscriptionsDetails';
import { SubscriptionService } from './../../../service/subscription.service';
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit,OnDestroy {

  // --- for primeNG table headers
  headers: any[];
  subscriptionList: SubscriptionsDetails[];
  //disable delete button when user is not SYSTEM-ADMIN
  buttonDisable: boolean;
  private role:string = (JSON.parse(localStorage.getItem("currentUser"))).role;

   // --- Subscription 
   private subscription: Subscription = new Subscription();


  constructor(
    private subscriptionService: SubscriptionService,
    private confirmationService: ConfirmationService, 
    public toster: ToastrManager ,) { }

  ngOnInit() {
    // --- definr table headers
    this.headers =
      [
        { field: 'no', header: 'No' },
        { field: 'planName', header: 'planName' },
        { field: 'noOfCustomer', header: 'No of Customer' },
        { field: 'noOfSurvey', header: 'No of Survey' },
        { field: 'delete', header: 'Delete' }
      ];

    this.getSubscriptionList(); 

    if(this.role && this.role !== "SYSTEM_ADMIN"){

      this.buttonDisable = true;
   
    }else{
      this.buttonDisable = false;
    }

    // --- add subscribe methode to the subscription object
    this.subscription.add(
      this.subscriptionService._addSubscribeToList.subscribe(data =>{
        let subList = [...this.subscriptionList];
        subList.unshift(data);
        this.subscriptionList = subList;
      })
    );

    
  }

  ngOnDestroy() {
    // --- unsubscribe all subscribe methode 
    this.subscription.unsubscribe();
  }


  getSubscriptionList() {
    // --- add subscribe methode to the subscription object
    this.subscription.add(
      this.subscriptionService.listSubscription().subscribe(data => {
        this.subscriptionList = data;
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
      }
  
      )

    );
  


  }

  delete(subscription: SubscriptionsDetails) {
 
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // --- add subscribe methode to the subscription object
        this.subscription.add(
          this.subscriptionService.deleteSubscription(subscription.id).subscribe(data=>{
            let index=this.subscriptionList.indexOf(subscription)
            this.subscriptionList.splice(index,0);      
            this.subscriptionList = this.subscriptionList.filter((val,i) => i!=index); 
            this.toster.successToastr("Success","Data is deleted",{position:"bottom-right",animate:"slideFromBottom"}) 
           },err=>{
            this.toster.errorToastr(JSON.parse(JSON.stringify(err)).error.message,"Error",{position:"bottom-right",animate:"slideFromBottom"})
           })
        );
         
      },
      reject: () => {

      }
  });


  }
}
