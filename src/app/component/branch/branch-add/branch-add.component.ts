import { CompanyService } from './../../../service/company.service';
import { Company } from './../../../model/company';
import { BranchService } from './../../../service/branch.service';
import { Branch } from './../../../model/branch';
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-branch-add',
  templateUrl: './branch-add.component.html',
  styleUrls: ['./branch-add.component.css']
})
export class BranchAddComponent implements OnInit,AfterViewInit,OnDestroy  {
  
  // --- Subscription 
  private subscription: Subscription = new Subscription();

  // --- Get value of role from branch-list component
  @Input() role:string;

  // --- if click edit button, add function work as edit function, because of edit: true
  // --- The parent of ADD - branch.component.ts which value is alwasys false
  // --- The parent of EDIT - branch-list.component.ts which value is alwasys true
  @Input() edit:false;

  // --- get the branch object from parent component branch-list.component.ts when edit button clicks
  @Input() editBranch:Branch;


   private branch:Branch;
   company: Company;
   newSavedVal: Branch;
   branchAddOrEditForm: FormGroup;
   

  constructor(
    private formBuilder: FormBuilder,
    private branchService: BranchService,
    private companyService: CompanyService,
    public toastr: ToastrManager) { }

  ngOnInit() {

    // ---Reactive form 
    this.branchAddOrEditForm = this.formBuilder.group({
      name:["",[Validators.required,Validators.minLength(2)]],
      address:[""],
      isEnabled:["1", Validators.required],
      company:[""],
      edit:[]
    })

    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // ---this support to when branch edit, this provid previos value of edit branch
  ngAfterViewInit() {
    if(this.edit){
      this.branchAddOrEditForm.get('name').patchValue(this.editBranch.name);
      this.branchAddOrEditForm.get('address').patchValue(this.editBranch.address);
    }
  }

  // --- get values from edit or add branch modal
  onSubmit(){

  // this.errorDisplayService.validateAllFormFields(this.branchAddOrEditForm);
    this.validateAllFormFields(this.branchAddOrEditForm);

  // --- get edited or add branch value
    this.branch = this.branchAddOrEditForm.value;
    
  // --- stop here if form is invalid
  if (this.branchAddOrEditForm.invalid) {
    return;
  }

  // --- check if edit is true and get id an ai from object that come from parent component named branch-list.component.ts
  // --- This will create as a new object at adding, so no need to assign
    if(this.edit){
      
      this.branch.id=this.editBranch.id;
      this.branch.ai=this.editBranch.ai;
      this.branch.edit=this.edit;
    } 
     
  // --- get company object by subscribing the BehaviourSubject of company-list-dropdown.component.ts.
  this.subscription.add(
    this.companyService.get_company_dropdown_$().pipe(untilDestroyed(this)).subscribe(res => {
      this.company =res;
      this.branch.company=this.company; 
      
   }))

   // ---If role!== SYSTEM_ADMIN get company Id when page load
   if(this.role && this.role !== "SYSTEM_ADMIN"){
    this.branch.company=(JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company
  }
    

 // --- update branch or save branch
 if(this.branchAddOrEditForm.valid){

  this.branchService.saveBranch(this.branch).pipe(untilDestroyed(this))
  .subscribe(data => {
    this.newSavedVal=data.branch;
    if(this.edit){

          if(data.action ==='edited'){

                // ---When user edit the branch information set _editBranchToList.next value as edited value 
                this.branchService._editBranchToList.next(this.newSavedVal);
                this.toastr.successToastr( "Successfully edited","Success", {position: "bottom-right", animate: "slideFromBottom"});
                
                // --- If edit value is true that come from branch-add-component send the true value to _set_ngxmodel_branch_edit()
                // ---Then set next value of _ngxmodel_branch_edit 
                this.branchService._set_ngxmodel_branch_edit(true);
                
          }else{
                // ---If there is duplicate value this error massage will display
                this.toastr.successToastr( "Branch already exists","Error", {position: "bottom-right", animate: "slideFromBottom"});
          }
      
    } else{

          if(data.action==='saved'){
               
                // ---When user add a new branch information set _addBranchToList.next value as added value
                this.branchService._addBranchToList.next(this.newSavedVal);
                this.toastr.successToastr( "Successfully saved","Success", {position: "bottom-right", animate: "slideFromBottom"});
              
                // --- If edit value is true that come from branch-add-component send the true value to _set_ngxmodel_branch_add()
                // ---Then set next value of _ngxmodel_branch_add
                this.branchService._set_ngxmodel_branch_edit(true);

          }else{
                // ---If there is duplicate value this error massage will display
            this.toastr.errorToastr( "Branch already exists","Error", {position: "bottom-right", animate: "slideFromBottom"});
          
          }
      
    }
  }, err => {
    this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    
  })

 }
  
 
   
  }

  isFieldValid(field: string) {
    return !this.branchAddOrEditForm.get(field).valid && this.branchAddOrEditForm.get(field).touched;
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
  return this.branchAddOrEditForm.controls;
}



}

