
import { Subscription } from 'rxjs';
import { Department } from './../../../model/department';
import { Company } from 'src/app/model/company';
import { EmployeeService } from './../../../service/employee.service';
import { Employee } from './../../../model/employee';
import { DepToBranch } from './../../../model/DeptToBranch';
import { Branch } from './../../../model/branch';
import { DepartmentAssingToBranchService } from './../../../service/department-assing-to-branch.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, AfterViewInit,OnDestroy,  } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { untilDestroyed } from 'ngx-take-until-destroy';


@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit, AfterViewInit, OnDestroy {

  // --- Subscription 
  private subscription: Subscription = new Subscription();

  // --- for employee reactive from
  employeeForm: FormGroup;
  // --- for get assingDepartmentToBranch object to select the company
  filterCompany: Company[];
  // --- for get the branches to paticuler selected company
  filerDeptoBranch: DepToBranch[];
   // --- for get the branches to paticuler selected company
  filterBranchs: Branch[];
  // --- for get the department to paticuler selected company
  filterdepartments: Department[];

  onChangeCompany = false;
  onChangeBranch = false;

  employee: Employee;
   // ---  get value from parent component employeeLlist.component.html 
  @Input() setEditEmployee: Employee;
  // ---  get value from parent component employeeLlist.component.html 
  // --- this is come to true when selecthe employee to edit
  @Input() edit: boolean = false;

  role:string = (JSON.parse(localStorage.getItem("currentUser"))).role




  constructor(
    private formBuilder: FormBuilder,
    private depToBranchService: DepartmentAssingToBranchService,
    private employeeService: EmployeeService,
    public toster: ToastrManager

  ) { }

  ngOnInit() {
    this.getDepToBranchs();

    

    this.employeeForm = this.formBuilder.group({
      firstname: ["", [Validators.required, Validators.minLength(4)]],
      lastname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      company: ["", Validators.required],
      branch: ["", Validators.required],
      department: ["", Validators.required]
 

    });

    if(this.role && this.role !== "SYSTEM_ADMIN"){
      const userCompany=(JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company
    //  console.log("company ",JSON.parse(localStorage.getItem('currentUser')))
      this.onSelectedCompany(userCompany)
    }

  }



// --- set the selected employee value to the form input when edit value is true
  ngAfterViewInit() {
    if (this.edit) {
      this.employeeForm.get('firstname').patchValue(this.setEditEmployee.firstname);
      this.employeeForm.get('lastname').patchValue(this.setEditEmployee.lastname);
      this.employeeForm.get('email').patchValue(this.setEditEmployee.email);
      this.employeeForm.get('phone').patchValue(this.setEditEmployee.phone);
    }

  }


  ngOnDestroy() {
    // --- unsubscribe all subscribe methode 
    this.subscription.unsubscribe();
}

   // --- convenience getter for easy access to form fields
   get f() {
    return this.employeeForm.controls; 
   }


  // this method for get all depToBranch object
  getDepToBranchs() {
    
      this.depToBranchService.getAllCompany().pipe(untilDestroyed(this)).subscribe(data => { 
        const company: Company[]=[];
        data.forEach(element  => {
          company.push(element.company);
        });
        this.filterCompany = company; 
        if(this.edit){
          this.employeeForm.get('company').patchValue(this.setEditEmployee.assignDeptToBranch.company);
         this.onSelectedCompany(this.setEditEmployee.assignDeptToBranch.company);
        }

      },err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
        })
  
  }




  // this method start when select the company 
  onSelectedCompany(company: Company) {
  
      this.depToBranchService.getBranch(company.id).pipe(untilDestroyed(this)).subscribe(data => {
        const branch: Branch[] = [];
        data.forEach(element => {
          branch.push(element.branch);
        });
        this.filterBranchs = branch;
       if(this.edit){
        this.employeeForm.get('branch').patchValue(this.setEditEmployee.assignDeptToBranch.branch);
        this.onSelectBranch(this.setEditEmployee.assignDeptToBranch.branch);
       }
       if(this.onChangeCompany){
        this.employeeForm.get('branch').patchValue('');
        this.employeeForm.get('department').patchValue('');
       }
      
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
      })
   
   

  }


  // --- this method start when select the branch 
  onSelectBranch(branch: Branch) {
    // --- add subscribe methode to the subscription object
 
      this.depToBranchService.getDepartment(branch.id).pipe(untilDestroyed(this)).subscribe(data => {
        const department: Department[]=[];
        data.forEach(element => {
         department.push(element.department); 
        });
        this.filterdepartments = department;
        if(this.edit){
          this.employeeForm.get('department').patchValue(this.setEditEmployee.assignDeptToBranch.department);
        }
        if(this.onChangeBranch){

          this.employeeForm.get('department').patchValue('');

        }
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
      })
   
  }


  // this methode start when click the submit buttom in the form
  onsubmit() {
    this.validateAllFormFields(this.employeeForm);
    if(!this.employeeForm.valid){
      return;
    }
    // --- set the save company object to company 
    const company = this.employeeForm.get('company').value;
    // --- set the save branch object to branch
    const branch = this.employeeForm.get('branch').value;
     // --- set the save branch object to branch
    const department = this.employeeForm.get('department').value;
    // --- get the employee from object to employee
    this.employee = this.employeeForm.value;

    delete this.employee['company'];
    delete this.employee['branch'];
    delete this.employee['department'];
   
    if(this.edit){
    this.employee.id = this.setEditEmployee.id;
    this.employee.ai = this.setEditEmployee.ai;
    this.employee.edit = this.edit;
    }
   
 
      this.employeeService.saveEmployee(this.employee, company, branch, department).pipe(untilDestroyed(this)).subscribe(data => {
       
         this.employee = data.employee;

        if(!this.edit){
          if(data.action === 'saved'){
            this.employeeService._addUserToList.next(this.employee);
            this.employeeService._set_ngxModal_add(true);
            this.toster.successToastr("Successfully saved", "Success", { position: "bottom-right", animate: "slideFromBottom" });
  
          }else{
            this.toster.errorToastr("Employee already exists add", "Error", { position: "bottom-right", animate: "slideFromBottom" });
          }
         
        }else{
          if(data.action === 'edited'){
            this.employeeService._editUserToList.next(this.employee);
          this.employeeService._set_ngxmodal_edit(true);
          this.toster.successToastr("Successfully edited", "Success", { position: "bottom-right", animate: "slideFromBottom" });
  
          }else{
            this.toster.errorToastr("Employee already exists ","Error",  { position: "bottom-right", animate: "slideFromBottom" });
          }
          
        }
       
      }, err => {
        if(!this.edit){
          this.employeeService._set_ngxModal_add(false);
        }else{
          this.employeeService._set_ngxmodal_edit(false);
        }
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
        
      })

  
  }

  onReset(){
      this.employeeForm.reset();
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
    return !this.employeeForm.get(field).valid && this.employeeForm.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

}











