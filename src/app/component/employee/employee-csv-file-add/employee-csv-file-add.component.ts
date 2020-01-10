
import { Department } from './../../../model/department';
import { Branch } from 'src/app/model/branch';
import { Company } from 'src/app/model/company';
import { EmployeeService } from './../../../service/employee.service';
import { DepartmentAssingToBranchService } from './../../../service/department-assing-to-branch.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DepToBranch } from './../../../model/DeptToBranch';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-employee-csv-file-add',
  templateUrl: './employee-csv-file-add.component.html',
  styleUrls: ['./employee-csv-file-add.component.css']
})
export class EmployeeCsvFileAddComponent implements OnInit,OnDestroy {

  employeeCsvFileForm: FormGroup;
  // --- Subscription 
  private subscription: Subscription = new Subscription();

  filterCompany: Company[];
  // --- for get the branches to paticuler selected company
  filerDeptoBranch: DepToBranch[];
  // --- for get the branches to paticuler selected company
  filterBranchs: Branch[];
  // --- for get the branches to paticuler selected company
  filterdepartments: any[];
  headers: any[];

  employeeList: any[]=[];
  selectedEmployee: any[];
  disableAllDataButton: boolean = true;



  @ViewChild('csvUploadFile') csvUploadFile:ElementRef;
  constructor(
    private frm: FormBuilder,
    private depToBranchService: DepartmentAssingToBranchService,
    private employeeService: EmployeeService,
    public toster: ToastrManager
  ) { }

  ngOnInit() {
    this.getDepToBranchs();

    this.employeeCsvFileForm = this.frm.group({
      company: ["", Validators.required],
      branch: ["", Validators.required],
      department: ["", Validators.required],
      csvFile: ["", [Validators.required, Validators.pattern(".+(\.csv)$")]]
   

    });

    this.headers =
    [
     
      { field: 'firstname', header: 'firstname'},
      { field: 'lastname', header: 'lastname'},
      { field: 'email', header: 'email'},
      { field: 'phone', header: 'phone'},
    ];


  }


  get f() {
    return this.employeeCsvFileForm.controls;
  }

  
  // this method for get all depToBranch object
  getDepToBranchs() {
    
      this.depToBranchService.getAllCompany().pipe(untilDestroyed(this)).subscribe(data => { 
        const company: Company[]=[];
        data.forEach(element  => {
          company.push(element.company);
        });
        this.filterCompany = company; 
        
        
      },err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
        })
   

  }




  // this method start when select the company 
  onSelectedCompnay(company: Company) {
 
    // --- add subscribe methode to the subscription object
    
      this.depToBranchService.getBranch(company.id).pipe(untilDestroyed(this)).subscribe(data => {
        const branch: Branch[] = [];
        data.forEach(element => {
          branch.push(element.branch);
        });
        this.filterBranchs = branch;
      
      
        this.employeeCsvFileForm.get('branch').patchValue('');
        this.employeeCsvFileForm.get('department').patchValue('');
       
      
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
       
          this.employeeCsvFileForm.get('department').patchValue('');

      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
      })
   
  }

  // this methode start when click the submit buttom in the form
  onsubmit() {
    this.validateAllFormFields(this.employeeCsvFileForm);
    if(!this.employeeCsvFileForm.valid){
      return;
    }
    // --- set the save company object to company 
    const company = this.employeeCsvFileForm.get('company').value;
    // --- set the save branch object to branch
    const branch = this.employeeCsvFileForm.get('branch').value;
    // --- set the save branch object to branch
    const department = this.employeeCsvFileForm.get('department').value;

    const csvfiles: File= this.employeeCsvFileForm.get('csvFile').value;

    let inputEl: HTMLInputElement = this.csvUploadFile.nativeElement;
        let fileCount: number = inputEl.files.length;
        let formData = new FormData();
    
        formData.append('file', inputEl.files.item(0));
  

    this.employeeService.saveCSVfile(formData, company, branch, department).pipe(untilDestroyed(this)).subscribe(data => {
      // --- get return object that is invalid
      this.employeeList = data;
     
      
      if(this.employeeList.length == 0){
        this.toster.successToastr("Successfully saved", "Success", { position: "bottom-right", animate: "slideFromBottom" });
        // this.employeeService._SelectedCompany.next(this.employeeCsvFileForm.get("company").value)
        this.employeeService._set_ngxModal_csv(true);
        this.disableAllDataButton = true; 
      }else{
        this.disableAllDataButton = false; 
        this.toster.errorToastr("your employee CSV file has invalid employee object", "Error", { position: "bottom-right", animate: "slideFromBottom" })
      }
      this.employeeService._SelectedCompany.next(this.employeeCsvFileForm.get("company").value)
    }, err => {

      this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
      this.employeeService._set_ngxModal_csv(false);
    });

  }
  onReset(){
    this.employeeCsvFileForm.reset();
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
    return !this.employeeCsvFileForm.get(field).valid && this.employeeCsvFileForm.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

  ngOnDestroy(){
    
  }
 

}
