import { FormArray } from '@angular/forms';
import {SelectItem} from 'primeng/api';
import { SurveyType } from './../../../model/surveyType';
import { ServeyService } from 'src/app/service/servey.service';
import { forEach } from '@angular/router/src/utils/collection';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';

import { DepartmentAssingToBranchService } from './../../../service/department-assing-to-branch.service';
import { DepartmentService } from './../../../service/department.service';
import { BranchService } from './../../../service/branch.service';
import { Department } from './../../../model/department';
import { Branch } from './../../../model/branch';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PlanService } from './../../../service/plan.service';
import { Plan } from './../../../model/plan';
import { SubscriptionsDetails } from '../../../model/subscriptionsDetails';
import { SubscriptionService } from './../../../service/subscription.service';
import { BussinessType } from './../../../model/bussinessType';
import { BussinessTypeService } from '../../../service/bussiness-type.service';

import { Company } from '../../../model/company';
import { CompanyService } from '../../../service/company.service';
import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DepToBranch } from 'src/app/model/DeptToBranch';
import { Observable, Subscription } from 'rxjs';
import { SurveySelction } from "src/app/model/surveySelection";
import { MultiSelect } from 'primeng/multiselect';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styleUrls: ['./company-add.component.css'],
  
})
export class CompanyAddComponent implements OnInit, OnDestroy {
  //---for reactive form
  companyForm: FormGroup;
  // --- for modal
  modalRefSubPlanList: BsModalRef;
  // --- get all businessType when component open
  bussinessTypeList: BussinessType[];
  // --- Subscription for unsubscribe
  private subscription: Subscription = new Subscription();
  // --- for get the company object to save
  private company: Company;
  // --- We are putting the image to this variable to preview
  public imagePath;
  imgURL: any;
  private userImage: any;
  imageCollections: AngularFirestoreCollection<ImageDetails>;
  images: Observable<ImageDetails[]>;
  // --- URL of image where the image stored in firebase, So when editing, it will preview
  downloadURL: Observable<string>;
  // --- for get the plan object that set the endDate
  plan: Plan;  
  // --- for create multyselect object 
  surveyTypeItems: SelectItem[];
  // --- for get the surveyType object when opent the component
  surveyTypes: SurveyType[]=[];
  // --- this is for create the selectedSurveyType Array in the company form
  selectedSurveyType : FormControl;
  // --- for get the number of max surveyTypes objects to the select
  maxLengthCheckedSurveyTypes: number;
  // --- for get the selected Subscriptions
  selectedSubscription: SubscriptionsDetails;
  // --- for view the complete SubscriptionPlan after select the start date
  planTable: boolean =true;
  // ---  this is for the get formated Subscriptions list  to the view p-dropdown 
  subscriptionPlanList: any[] = [];
  // --- for view subscriptionPlan StartDate after select the subscription 
  viewStartDate: boolean= true;
  // --- for clander
  datePickerConfig: Partial<BsDatepickerConfig>;
  // --- for get the selected surveyType Json object as Stirng
  stringSurveySelection: string;
  // --- for get the default branch Name
  branchName: string;
  // --- for get the default department Name
  departmentName: string;
  // --- for get the SubscriptionPlan Object as Stirng
  stringPlan: string;
  // --- for get the selected surveyType list
  surveySelections : SurveySelction[]=[];
  @ViewChild("multiSelect") multiSelect: MultiSelect;
  // ---  get value from parent componentcompanyList.component.html   
  @Input() selectcompany: Company;
  // ---  get value from parent componentcompanyList.component.html   
  @Input() edit = false;

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private bussinessTypeService: BussinessTypeService,
    private subscriptionService: SubscriptionService,
    public toster: ToastrManager,
    private afStorage: AngularFireStorage,
    private dbStore: AngularFirestore,
    private modalService: BsModalService,
    private planService: PlanService,
    private surveyService: ServeyService
  ) { }

  ngOnInit() {
    this.getBusinessTypes();
    this.getAllSubscription();
    this.getAllSurveyType();
    this.companyForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      description: [""],
      address: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      website: [""],
      phone: ["", [Validators.required]],
      image: [""],
      smsApiKey: [""],
      isEnabled: ["1", Validators.required],
      businessType: ["", Validators.required],
      branchName: ["", Validators.required],
      departmentName: ["Administration"],
      subscriptionType:["",Validators.required],
      startDate:[new Date().toJSON(),Validators.required],
      selectedSurveyType:[this.selectedSurveyType,Validators.required]
    });


      this.datePickerConfig = Object.assign({},
      {
        dateInputFormat: 'YYYY-MM-DD',   
        minDate: new Date(),          
      });   

     // this.companyForm.value.selectedSurveyType.length =0;
  }

  ngOnDestroy() {
    // --- unsubscribe all subscribe methode 
    this.subscription.unsubscribe();
  }



  // --- set the selected employee value to the form input when edit value is true
  ngAfterViewInit() {
    if (this.edit) {
      this.companyForm.get('name').patchValue(this.selectcompany.name);
      this.companyForm.get('description').patchValue(this.selectcompany.description);
      this.companyForm.get('address').patchValue(this.selectcompany.address);
      this.companyForm.get('email').patchValue(this.selectcompany.email);
      this.companyForm.get('website').patchValue(this.selectcompany.website);
      this.companyForm.get('phone').patchValue(this.selectcompany.phone);
      this.companyForm.get('image').patchValue(this.selectcompany.image);
      this.companyForm.get('smsApiKey').patchValue(this.selectcompany.smsApiKey);
      this.companyForm.get('isEnabled').patchValue(this.selectcompany.isEnabled);
      this.companyForm.get('businessType').patchValue(this.selectcompany.businessType);
      this.companyForm.removeControl('branchName');
      this.companyForm.removeControl('departmentName');
      this.companyForm.removeControl('subscriptionType');
      this.companyForm.removeControl('startDate');
      this.companyForm.removeControl('selectedSurveyType');

      this.imageCollections = this.dbStore.collection('company', ref => ref.where('path', '==', this.selectcompany.id));
      this.imageCollections.snapshotChanges().pipe(untilDestroyed(this)).subscribe(data => {

        if (data && data.length != 0) {
          this.downloadURL = this.afStorage.ref(`company/${this.selectcompany.id}`).getDownloadURL();
        }
      })
    }


    

  }


  // --- get bussiness type
  getBusinessTypes() {
    this.bussinessTypeService.getBusinessType().pipe(untilDestroyed(this)).subscribe(data => {
      this.bussinessTypeList = data;
    }, err => {
      this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    })
  }

  
  // --- save and edit company methode
  saveCompany() {

   
    this.validateAllFormFields(this.companyForm)
    if (this.companyForm.invalid) {  
         
      return;
    }

    this.company = this.companyForm.value;
    // --- if user edits Company, this.edit==true and assing selected company id and ai to company id and ai
    if (this.edit) {
      this.company.id = this.selectcompany.id;
      this.company.ai = this.selectcompany.ai;
      this.company.edit = this.edit;
    }else{
    // --- change plan start date format
    this.plan.startDate = new Date(this.plan.startDate).toJSON();
    this.plan.date = new Date().toJSON();
    this.plan.id =null;
    // --- convert plan object to string
    this.stringPlan= JSON.stringify(this.plan);   
    this.companyForm.value.selectedSurveyType.forEach(surveyType =>{
      const surveySelection = new SurveySelction();
      surveySelection.subscription = this.selectedSubscription;
      surveySelection.surveytype = surveyType;
      this.surveySelections.push(surveySelection);
    })    
    this.stringSurveySelection = JSON.stringify(this.surveySelections);
    // ---  for add the default value for the department input field
    this.branchName = this.companyForm.get('branchName').value;
    // ---  for add the defolt value for the branch input field
    this.departmentName= this.companyForm.get('departmentName').value;         
    // --- company object dose not have branch name and department name. so we have to remove both before saving company
    delete this.company['branchName'];
    delete this.company['departmentName'];
    delete this.company['subscriptionType'];
    delete this.company['startDate'];
    delete this.company['selectedSurveyType'];
    }
    // pass the branch name , department name, and edit value with the company object to create the default comany and branch 
    this.companyService.addCompany(this.company, this.branchName, this.departmentName, this.stringPlan,this.stringSurveySelection).pipe(untilDestroyed(this)).subscribe(data => {
      this.startUpload(data.company.id)
      // --- for identify  new company or edit object by front end
      if (!this.edit) {
        // --- for identify  new company by back end
        if (data.action === 'saved') {
          this.toster.successToastr("Successfully saved", "Success", { position: "bottom-right", animate: "slideFromBottom" });
          this.companyService._set_ngxModal_add(true);
          // --- this saved company object return from the back end after saving the company
          this.companyService._addCompanyToList.next(data.company);
        } else {
          this.toster.errorToastr("Company already exists", "Error", { position: "bottom-right", animate: "slideFromBottom" });
        }
      } else {
        // --- for identify editd company by back end
        if (data.action === 'edited') {
          this.toster.successToastr("Successfully edited", "Success", { position: "bottom-right", animate: "slideFromBottom" });
          this.companyService._set_ngxModal_edit(true);
          this.companyService._editCompanyToList.next(data.company);
        } else {
          this.toster.errorToastr("Company already exists", "Error", { position: "bottom-right", animate: "slideFromBottom" });
        }
      }
    }, err => {
      if (!this.edit) {
        this.companyService._set_ngxModal_add(false);
      } else {
        this.companyService._set_ngxModal_edit(false);
      }
      this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    })
  }



  // --- view company in the select tag as a defolt when employee edit
  compareBussinessType(b1: BussinessType, b2: BussinessType): boolean {
    return b1 && b2 && b1.id === b2.id;
  }



  // --- show the preview of uploaded image
  onImagePreview(event: FileList) {
    this.downloadURL = null;
    const files = event.item(0);
    if (event.length === 0) { return; }
    var mimeType = files.type;
    if (mimeType.match(/image\/*/) == null) {
      this.toster.errorToastr("Only images are supported.", "Cannot upload image", { position: "bottom-right", animate: "slideFromBottom" });
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
    this.userImage = event.item(0)
  }



  startUpload(filename) {
    // The File object
    const file = this.userImage;
    if (!file) { return; }
    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      this.toster.errorToastr("Only images are supported.", "Cannot upload image", { position: "bottom-right", animate: "slideFromBottom" })
      return;
    }
    // The storage path
    const path = `company/${filename}`;
    // Totally optional metadata
    const customMetadata = { app: 'Pulsebeat v2 User' };
    // --- saving in the database
    if (this.edit) {
      this.subscription.add(
        this.dbStore.collection('company', ref => ref.where('path', '==', this.selectcompany.id)).snapshotChanges().pipe(untilDestroyed(this)).subscribe(data => {
          if (data.length == 0) {
            this.dbStore.collection('company').add({ 'path': filename })
          }
        })
      )

    } else {
      this.dbStore.collection('company').add({ 'path': filename })
    }
    // The main task
    this.afStorage.upload(path, file, { customMetadata });
  }



  get f() {
    return this.companyForm.controls;
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
    return !this.companyForm.get(field).valid && this.companyForm.get(field).touched;
  }




  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }



  // --- get all subscriptions
  getAllSubscription() {
    this.subscriptionService.listSubscription().pipe(untilDestroyed(this)).subscribe(data => {
      const editSubscription : any[]=[];
        data.forEach(element =>{
          editSubscription.push({'subscription':element ,'subWithSurvey' : element.planName+"  (#Survey - "+element.noOfSurvey+" )"})
        })      
      this.subscriptionPlanList = editSubscription;       
    }, err => {
      this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    })
  }



  onSelectedSubscription(changeSubscription){
    this.maxLengthCheckedSurveyTypes=Number.MAX_VALUE;
    this.selectedSubscription = changeSubscription.subscription;
    this.maxLengthCheckedSurveyTypes = changeSubscription.subscription.noOfSurvey;
    this.viewStartDate = false;
    // for change the subscription plan
    this.onSelectedDate();  
    // --- reset the  <p-multiSelect></p-multiSelect>
    this.multiSelect.value=null;
    this.multiSelect.maxSelectionLimitReached=false;
    this.multiSelect.updateLabel()

    
  }


  // --- get valid month when change the startdate and get plan object with endDate
  onSelectedDate(){  
    const dummiPlan = new Plan();
    var validMonth: number = this.companyForm.get('subscriptionType').value.subscription.validMonths;
    dummiPlan.subscription = this.companyForm.get('subscriptionType').value.subscription;
    dummiPlan.startDate = this.companyForm.get('startDate').value; 
      // --- for get the end date by back-end.    
        this.planService.getEndDate(validMonth, dummiPlan).pipe(untilDestroyed(this)).subscribe(data => {
          this.plan = data;
          this.planTable = false;      
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
      }) 
  }


  getAllSurveyType(){
    this.surveyService.getSurveyTypes().pipe(untilDestroyed(this)).subscribe(data =>{
      this.surveyTypes = data;       
      this.surveyTypeItems = [];
      this.surveyTypes.forEach(surveyType =>{
        this.surveyTypeItems.push({label: surveyType.name, value: surveyType});
      });
    },err=>{
      this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    })
  }

  onReset(){
    this.companyForm.reset();
    this.companyForm.get("isEnabled").patchValue(1);
}

}



interface ImageDetails {
  path: string;
}


