import { Company } from './../../../model/company';
import { CompanyService } from './../../../service/company.service';
import { DepartmentService } from './../../../service/department.service';
import { Department } from './../../../model/department';
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.css']
})
export class DepartmentAddComponent implements OnInit,AfterViewInit,OnDestroy {

  // --- Get value of role from department-list component
  @Input() role:string;

  // --- Subscription 
  private subscription: Subscription = new Subscription();
  
  // --- if ckick edit button add function work as edt function because of edit: true
  @Input() edit:false;
  // --- get the department object from parent component when going to edit it
  // --- parent component is department list component
  @Input() editDepartment:Department;
  company: Company;
  department:Department;
  newSavedVal: Department;
  deptAddrOrEditForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    public toastr: ToastrManager){ }

  ngOnInit() {
    this.deptAddrOrEditForm= this.formBuilder.group({
      name:["",[Validators.required,Validators.minLength(2)]],
      isEnabled:["1", Validators.required],
      company:[""],
      edit:[]

    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
 }
  ngAfterViewInit() {
    if(this.edit){
      this.deptAddrOrEditForm.get('name').patchValue(this.editDepartment.name);

    }
  }
  // --- get values from edit or add department modal
  onSubmit(){
    // --- get edited or add branch value
    this.department= this.deptAddrOrEditForm.value;
    
    // --- stop here if form is invalid
    if (this.deptAddrOrEditForm.invalid) {
      return;
    }
    // --- check if edit true and get id an ai from object that come from parent component named department list 
    if(this.edit){
      this.department.id=this.editDepartment.id;
      this.department.ai=this.editDepartment.ai;
      this.department.edit=this.edit;
    }
    
    
    // --- get company object by subscribing the companyDropDown value
    this.subscription.add(
    this.companyService.get_company_dropdown_$().pipe(untilDestroyed(this)).subscribe(
      res =>{
        this.company = res;
        this.department.company=this.company;
      }))

    // ---If role!== SYSTEM_ADMIN get company Id when page load
    if(this.role && this.role !== "SYSTEM_ADMIN"){
      this.department.company=(JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company
    }


    // --- update department or save department
    this.departmentService.saveDepartment(this.department).pipe(untilDestroyed(this)).subscribe(
      data=>{
        this.newSavedVal= data.department;
        if(this.edit){
            if(data.action ==='edited'){

                  // ---When user edit the department information set _editdepartmentToList.next value as edited value 
                  this.departmentService._editDeptToList.next(this.newSavedVal);
                  this.toastr.successToastr( "Successfully edited","Success", {position: "bottom-right", animate: "slideFromBottom"});

                  // --- If edit value is true that come from department-add-component send the true value to _set_ngxmodel_dept_edit()
                  // ---Then set next value of _ngxmodel_dept_edit
                  this.departmentService._set_ngxmodel_dept_edit(true);

            }else{
                  // ---If there is duplicate value this error massage will display
                  this.toastr.successToastr( "Department already exists","Error", {position: "bottom-right", animate: "slideFromBottom"});
            } 
         
          } else{

            if(data.action==='saved'){

                  // ---When user add a new department information set _addDepthToList.next value as added value
                  this.departmentService._addDeptToList.next(this.newSavedVal);
                  this.toastr.successToastr( "Successfully saved","Success", {position: "bottom-right", animate: "slideFromBottom"});

                  // --- If edit value is true that come from department-add-component send the true value to _set_ngxmodel_dept_add()
                  // ---Then set next value of _ngxmodel_dept_add
                  this.departmentService._set_ngxmodel_dept_edit(true);

            }else{
                  // ---If there is duplicate value this error massage will display
                  this.toastr.successToastr( "Department already exists","Error", {position: "bottom-right", animate: "slideFromBottom"});
           
            }
          
          }
      }, err=>{
        this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
      })
  }

   
  isFieldValid(field: string) {
    return !this.deptAddrOrEditForm.get(field).valid && this.deptAddrOrEditForm.get(field).touched;
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
  return this.deptAddrOrEditForm.controls;
}

  
}

