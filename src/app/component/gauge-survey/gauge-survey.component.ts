import { AuthService } from 'src/app/core/auth.service';
import { FeedbackSliderValGaugeTitleId } from './../../model/feedbackSliderValGaugeTitleId';
import { CustomerService } from 'src/app/service/customer.service';
import { Survey } from 'src/app/model/Survey';
import { GaugeComponent } from './gauge/gauge.component';
import { GaugeTitleService } from './../../service/gauge-title.service';
import { PreferredUrlService } from './../../service/preferred-url.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewChecked, ViewChildren, QueryList, ViewChild, ElementRef,ViewEncapsulation, OnDestroy } from '@angular/core';
import { GaugeTitleWeightedAvg } from 'src/app/model/GaugeTitleWeightedAvg';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Customer } from 'src/app/model/customet';
import { AngularFirestore } from 'angularfire2/firestore';
import { DatePipe } from '@angular/common';
import { ValidateFields } from 'src/app/function/validate-fields';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-gauge-survey',
  templateUrl: './gauge-survey.component.html',
  styleUrls: ['./gauge-survey.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class GaugeSurveyComponent implements OnInit, AfterViewChecked,OnDestroy {
    

    

    // ---gauges survey value from gauge component
    @ViewChildren(GaugeComponent) gaugeChildren: QueryList<GaugeComponent>;
    
    carousel:JQuery;

    // ---This is to get gaugeTitleWeightedAvgs list 
    gaugeTitleWeightedAvgsList : GaugeTitleWeightedAvg[]=[];

    // ---Open Gauges when click next button then viewGaugeTemplate= true
    viewGaugeTemplate: boolean = false;

    // ---Control next button behavior as visible or not
    viewNextBtn:Boolean=true;

    // ---Control previous button behavior as visible or not
    viewPreviousBtn:Boolean=false;
    addGaugeForm: FormGroup;

    // ---String arry for feedback,sliderVal,gaugeTitleId
    feedbackSliderValGaugeTitleId:FeedbackSliderValGaugeTitleId[]=[];

    existCustomer:Customer;
    phone:string;
    name:string;
    email:string;
    additionalComment:string;
    assignDeptToBranch?: string=localStorage.getItem('currentUser')?(JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.id:'';
    //companyId:string=(JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company.id;
    survey: Survey;
    customerFeedbacks: any[];
    gaugeTitleIdRatedVal: any[];
    userId: string;

    constructor(
        private activatedRoute:ActivatedRoute,
        private preferredUrlService:PreferredUrlService,
        private gaugeTitleService:GaugeTitleService,
        private formBuilder: FormBuilder,
        public toastr: ToastrManager,
        private customerService: CustomerService,
        private router: Router, private authService:AuthService,
        private dbStore: AngularFirestore,
        private datePipe:DatePipe      
        ) {    
    }

    ngOnInit() {

        
        this.addGaugeForm = this.formBuilder.group({
            phone:["",Validators.required],
            name:["",[Validators.required,Validators.minLength(2)]],
            email:[""]
          })

          // --- If someone copy the URL, then the assignDept should be the copied string
          // --- So re-assigning the value to assignDeptToBranch
        if(this.activatedRoute.snapshot.queryParamMap.has('abd')){
            this.assignDeptToBranch=this.activatedRoute.snapshot.queryParamMap.get('abd');
        }  

   
        if(this.activatedRoute.snapshot.paramMap.has('uid') && this.activatedRoute.snapshot.paramMap.has('userId')){

            this.userId=this.activatedRoute.snapshot.paramMap.get('userId');
          
        // ---find survey_id and and select  related gaugeTitleWeightedAvgs 
            this.preferredUrlService.getPrefrredUrl(this.activatedRoute.snapshot.params['uid']).pipe(untilDestroyed(this)).subscribe(data=>{

               
                if(data.exist){
                    this.gaugeTitleWeightedAvgsList= data.exist;
                    this.survey = this.gaugeTitleWeightedAvgsList[0].survey;
                }else{
                   
                    this.router.navigate(['/404']);
                }
                
            },err=>{
                this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
            })
        }else{
          
            this.router.navigate(['/404']);
        }
    }

    getExistCustomer(){
        if(this.addGaugeForm.get('phone').valid){
            this.customerService.findCustomerByPhone(this.addGaugeForm.value.phone,this.survey.id).pipe(untilDestroyed(this)).subscribe(data=>{
                
                if(data.customer){
                    this.addGaugeForm.get('name').patchValue(data.customer.name)
                    this.addGaugeForm.get('email').patchValue(data.customer.email);
                }
                
                 this.gaugeTitleIdRatedVal=data.gaugeTitleIdRatedVal;
            },err=>{
                this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
            })  
            
       }
     
   }
    // ---for gauge carousel interface
    ngAfterViewChecked(): void {   
       
        this.carousel=   (<JQuery>$("#carousel")).flipster({
            style : 'flat', //
            spacing : -.1, //flat = -1, carousel = -1
            nav : false,	
            autoplay : false,
            touch : true,
            start: 0,
            buttons: false,
        });
    }

    // ---function for view gauges when customer or employee give valid informstion
    viewGauge(){
        ValidateFields(this.addGaugeForm);
        if (this.addGaugeForm.invalid) {
            return;
        }else{
            this.viewGaugeTemplate=true;
        }

    }

  // ---this is for next button behavior
    next(){
        let el: HTMLElement=document.getElementsByClassName('flipster__item--future-1')[0] as HTMLElement;    
        el.click()

        // --- checking the index against gaugeTitleWeightedAvgs
        if (Array.from(el.parentNode.children).indexOf(el) === 0){
            this.viewPreviousBtn=false;
            this.viewNextBtn=true;
        } else if(Array.from(el.parentNode.children).indexOf(el) >= 0 && Array.from(el.parentNode.children).indexOf(el) != this.gaugeTitleWeightedAvgsList.length) {
            this.viewPreviousBtn=true ;     
            this.viewNextBtn=true;
        } else if (Array.from(el.parentNode.children).indexOf(el) == (this.gaugeTitleWeightedAvgsList.length)){
            this.viewNextBtn=false;
            this.viewPreviousBtn=true;

           var customerFeedbacks=[];
            // ---when click last next button get gauge value for summury page
            this.gaugeChildren.forEach(data =>{
                customerFeedbacks.push( {
                    feedback:data.feedback,
                    sliderVal:data.val,
                    gaugeTitle:data.gaugeTitleWeightedAvg.gaugeTitle.title,

                });

                this.feedbackSliderValGaugeTitleId.push({
                    feedback:data.feedback,
                    sliderVal:((data.val*data.gaugeTitleWeightedAvg.weight)/100).toString(),
                    gaugeTitleId:data.gaugeTitleWeightedAvg.gaugeTitle.id

                });
            
                // --- convert JSON object into string and replace "[" into ""
                //this.values= JSON.stringify(value).replace(/\[/g, "").replace(/\]/g, "");
                
                //this.values= JSON.stringify(value);
            });
        
            this.customerFeedbacks =customerFeedbacks;
        }  

    
    }

        // ---this is for previous button behavior
        previous(){
            let el: HTMLElement=document.getElementsByClassName('flipster__item--past-1')[0] as HTMLElement;    
            el.click()

            // --- checking the index against gaugeTitleWeightedAvgs
            if(Array.from(el.parentNode.children).indexOf(el) == 0){
                this.viewPreviousBtn=false;
                this.viewNextBtn=true;
            } else if(Array.from(el.parentNode.children).indexOf(el) >= 0 && Array.from(el.parentNode.children).indexOf(el) != this.gaugeTitleWeightedAvgsList.length){
                this.viewPreviousBtn=true;      
                this.viewNextBtn=true;
            } else if(Array.from(el.parentNode.children).indexOf(el) == this.gaugeTitleWeightedAvgsList.length){
                this.viewNextBtn=false;
                this.viewPreviousBtn=true;
            }

            
        }

        // ---when click finish button save customer feedback
        saveCustomerFeedback(){
        
        this.phone=this.addGaugeForm.value.phone;
        this.name=this.addGaugeForm.value.name;
        this.email=this.addGaugeForm.value.email;

        let sum = 0;
        this.feedbackSliderValGaugeTitleId.forEach(element=>{
            sum = sum + parseInt(element.sliderVal);
        })
        this.gaugeTitleService.saveCustomerFeedack(this.feedbackSliderValGaugeTitleId,this.additionalComment,this.survey.id,this.assignDeptToBranch,this.phone,this.name,this.email,this.userId).pipe(untilDestroyed(this)).subscribe(
            data=>{
                this.viewGaugeTemplate = false;
                 //---for firebase notification
                 let now = new Date();
                              
                 this.dbStore.collection('alert').add({
                     companyId:JSON.parse(localStorage.getItem("currentUser")).assignDeptToBranch.company.id,
                     branchId:JSON.parse(localStorage.getItem("currentUser")).assignDeptToBranch.branch.id,
                     departmentId:JSON.parse(localStorage.getItem("currentUser")).assignDeptToBranch.department.id,
                     dateTime:this.datePipe.transform(now, "yyyy-MM-dd HH:mm"),
                     feedbackVal:sum,
                     customerName:this.name,
                     customerPhone:this.phone
                 });
            },err=>{
                this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
            }
        );
   }

        
  isFieldValid(field: string) {
    return !this.addGaugeForm.get(field).valid && this.addGaugeForm.get(field).touched;
  }

    // validateAllFormFields(formGroup: FormGroup) {
    //     Object.keys(formGroup.controls).forEach(field => {          
    //         const control = formGroup.get(field);
    //         if (control instanceof FormControl) {
    //             control.markAsTouched({ onlySelf: true });
    //         } else if (control instanceof FormGroup) {
    //             this.validateAllFormFields(control);
    //         }
    //     });
    // }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

    // --- convenience getter for easy access to form fields
    get f() {
    return this.addGaugeForm.controls;
    }


    ngOnDestroy() {

    }
    }

