import { BussinessType } from './../../model/bussinessType';
import { BussinessTypeService } from './../../service/bussiness-type.service';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-business-type',
  templateUrl: './business-type.component.html',
  styleUrls: ['./business-type.component.css']
})
export class BusinessTypeComponent implements OnInit,OnDestroy  {

  // --- Subscription 
  private subscription: Subscription = new Subscription();
  
  // --- modalRef_bussinessType to refer the modal (ngx-bootstrap) which is in bussiness-type.component.ts
  modalRef_bussinessType: BsModalRef;
  headers:any[];
  bussinessType:BussinessType[];
  bussinessTypeForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private bussinessTypeService:BussinessTypeService,
              private modalService: BsModalService,
              public toastr: ToastrManager,
              private confirmationService: ConfirmationService) { 

  }

  ngOnInit() {

    // ---Reactive form 
    this.bussinessTypeForm = this.formBuilder.group({
      type:["",[Validators.required,Validators.minLength(2)]]
    })

     // ---This is for headers in the Business Type  table
    this.headers =
    [
      {field: 'no', header: 'No'},
      { field: 'type', header: 'Business Type'},
      { field: 'delete', header: 'Delete'},
    ];

    this.getBusinessType();
  }

  // ---Get existing business type
  getBusinessType(){
    this.subscription.add(
    this.bussinessTypeService.getBusinessType().pipe(untilDestroyed(this)).subscribe(data=>{
      this.bussinessType=data
    },err=>{
      this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
    }))
  }

  // ---Delete business Type
  deleteBusinessType(bussinessType:BussinessType){
    
    // ---This will ask to confirm befor delete the value
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.bussinessTypeService.deleteBussinessType(bussinessType.id).pipe(untilDestroyed(this)).subscribe(data=>{
            const index =this.bussinessType.indexOf(bussinessType);
            this.bussinessType = this.bussinessType.filter((val,i) => i !== index);
          this.toastr.successToastr("Data is deleted","Success",{position:"bottom-right",animate:"slideFromBottom"}) 
         },err=>{
          this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
         })
      },
  });
    
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef_bussinessType = this.modalService.show(template);
  }

  // ---Add new bussiness type
  onSubmit(){

    if (this.bussinessTypeForm.invalid) {
      return;
    }

    this.bussinessTypeService.saveBussinessType(this.bussinessTypeForm.value).pipe(untilDestroyed(this)).subscribe(data=>{
      if(data.action=== 'saved'){
        // let bList = [...this.bussinessTypeList];         
        // bList.unshift(data.type)
        // this.bussinessTypeList = bList;
        this.toastr.successToastr( "Successfully Saved","Success", {position: "bottom-right", animate: "slideFromBottom"});
        // ---hide the model that use to add bussiness type
        this.modalRef_bussinessType.hide();
      }else{

        // ---If there is duplicate value this error massage will display
        this.toastr.successToastr( "Bussiness Type already exists","Error", {position: "bottom-right", animate: "slideFromBottom"});
      }
      
    },err=>{
      this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    })
  }

  
  isFieldValid(field: string) {
    return !this.bussinessTypeForm.get(field).valid && this.bussinessTypeForm.get(field).touched;
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
  return this.bussinessTypeForm.controls;
}

ngOnDestroy(){

}
}
