import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Customer } from 'src/app/model/customet';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomerService } from 'src/app/service/customer.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css']
})
export class CustomerAddComponent implements OnInit,OnDestroy {

  // --- if click edit button, add function work as edit function, because of edit: true
  @Input() edit:false;
  
  // ---get customer object from customerview.component.ts 
  @Input() editCustomer:Customer;

  // ---get customer list from customerview.component.ts
  @Input() customerList:Customer[];

  // ---This customerEvent create emit boolean value to parent
  @Output() customerEvent = new EventEmitter<boolean>(false);

  customerAddOrEditForm: FormGroup;
  customer:Customer;

  constructor(private formBuilder: FormBuilder,
              private customerService:CustomerService,
              public toastr: ToastrManager) { }

  ngOnInit() {
    this.customerAddOrEditForm = this.formBuilder.group({
      name:["",[Validators.required,Validators.minLength(2)]],
      phone:["",Validators.required],
      email:["", Validators.email]
    })
  }

  ngAfterViewInit() {
    if(this.edit){
      this.customerAddOrEditForm.get('name').patchValue(this.editCustomer.name);
      this.customerAddOrEditForm.get('phone').patchValue(this.editCustomer.phone);
      this.customerAddOrEditForm.get('email').patchValue(this.editCustomer.email);
    }
  }

  onSubmit(){
    this.customer=this.customerAddOrEditForm.value;

    // --- stop here if form is invalid
    if (this.customerAddOrEditForm.invalid) {
      return;
    }

    if(this.edit){
        
      this.customer.id=this.editCustomer.id;
      this.customer.ai=this.editCustomer.ai;
    } 
    
    this.customerService.saveCustomer(this.customer).pipe(untilDestroyed(this)).subscribe(data=>{
      let itemIndex = this.customerList.findIndex(item => item.id == this.customer.id);
      this.customerList[itemIndex] = this.customer;

      this.customerEvent.emit(true);
      
      this.toastr.successToastr("Success", "Successfully edited", {position: "bottom-right", animate: "slideFromBottom"});
    },err=>{
      this.toastr.errorToastr(err, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    })
  }

  
  isFieldValid(field: string) {
    return !this.customerAddOrEditForm.get(field).valid && this.customerAddOrEditForm.get(field).touched;
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
  return this.customerAddOrEditForm.controls;
}

ngOnDestroy(){

}

}
