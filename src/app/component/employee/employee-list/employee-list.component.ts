import { Company } from 'src/app/model/company';
import { CompanyService } from './../../../service/company.service';
import { ToastrManager } from 'ng6-toastr-notifications';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EmployeeService } from './../../../service/employee.service';
import { Employee } from './../../../model/employee';
import { Component, OnInit, TemplateRef, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import {  Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit,OnDestroy {
  // --- header for employee list table 
  headers: any[];
  // --- header for Duplicate employee table
  headersDuplicate: any[];
  // --- get all employee for employee list table
  employeeList: Employee[] = [];
  // --- for modals
  modalRef: BsModalRef;
  // --- get edit employee to and assing that employee to the "setEditEmployee" input inthe #edit ng-tamplate 
  editEmployee: Employee;
  // --- for get Duplicate employee
  dublicateEmployee: Employee[];
  // --- for get the selected company id by System Admin
  selectedCompanyId: string;

  selectedCompany: Company;
  // --- that variable value is true when click the "get Dublicate" button to view the dublicate table
  clickDuplicateButton: boolean = false;
  // --- for get the selected employee by checke box
  checkedEmployee: Employee[] = [];
  // --- get company list from getCompanylist() methode to view the company dropdow to the System Admin
  CompanyList: Company[];
  // --- Subscription for unSubscrip the subscrip methode
  private subscription: Subscription = new Subscription();
  // --- get loged current user role
  private role: string = (JSON.parse(localStorage.getItem("currentUser"))).role;
  // --- get loged current user company
  private company: Company = (JSON.parse(localStorage.getItem("currentUser"))).assignDeptToBranch.company;
  add: boolean = false;
  addEmployee : Employee;
  // --- get checkbox elementref in the  "dublicate employee table"
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;



  constructor(
    private employeeService: EmployeeService,
    private modalService: BsModalService,
    private companyService: CompanyService,
    // --- for comfirmationForm when delete the employee
    private confirmationService: ConfirmationService,
    public toster: ToastrManager
    ) { }

  ngOnInit() {   
 
    // --- pass current user companyId to the getEmployeelist when user is not System admin 
    if (this.role != 'SYSTEM_ADMIN') {
      this.getEmployeelist(this.company.id);
    }
    // --- header for employee list table 
    this.headers =
      [
        { field: 'no', header: 'No' },
        { field: 'firstname', header: 'First Name' },
        { field: 'lastname', header: 'Last Name' },
        { field: 'email', header: 'Email' },
        { field: 'phone', header: 'Phone' },
        { field: 'branch', header: 'Branch' },
        { field: 'department', header: 'Department' },
        { field: 'edit', header: 'Edit' },
        { field: 'delete', header: 'Delete' }
      ];
      // --- header for dublicate employee table
      this.headersDuplicate =
        [
          { field: 'no', header: 'No' },
          { field: 'firstname', header: 'First Name' },
          { field: 'lastname', header: 'Last Name' },
          { field: 'email', header: 'Email' },
          { field: 'phone', header: 'Phone' },
          { field: 'branch', header: 'Branch' },
          { field: 'department', header: 'Department' },
          { field: 'edit', header: 'Edit' },
          { field: 'delete', header: 'Delete' }
        ];
    // --- hide modal after add employee successFully 
    this.employeeService.get_ngxModal_edit_$().pipe(untilDestroyed(this)).subscribe(data => {
      if (data) {
        this.modalRef.hide();
      }

    });

    // --- add subscribe methode to the subscription object
    this.subscription.add(
      this.employeeService._addUserToList.pipe(untilDestroyed(this)).subscribe(data => {
        this.add =true;
        this.addEmployee = data;
        this.selectedCompany = this.addEmployee.assignDeptToBranch.company;
        this.getEmployeelist(this.addEmployee.assignDeptToBranch.company.id);
        // const empList = [...this.employeeList];
        // empList.unshift(data);
        // this.employeeList = empList;
      })
    );


    // --- add subscribe methode to the subscription object
    this.subscription.add(
      this.employeeService._editUserToList.pipe(untilDestroyed(this)).subscribe(data => {
        const index = this.employeeList.findIndex(employee => employee.id === data.id);
        this.employeeList[index] = data;
      })
    );
   
    this.employeeService._SelectedCompany.pipe(untilDestroyed(this)).subscribe(data =>{
      this.selectedCompany=data;

      this.getEmployeelist(data.id);
    })

    //  // if(this.currentUserRole && this.currentUserRole=== 'SYSTEM_ADMIN'){
    //   this.companyService.get_company_dropdown_$()
    //   .pipe(switchMap(company=>{
    //       return this.userService.findAllUserByCompanyId(company)
    //   }))
    //   .subscribe(res=>{
    //       //console.log(this.companyService.get_company_dropdown_$())
    //       this.userList=res;
    //   })
    this.companyService.get_company_dropdown_$().pipe(untilDestroyed(this)).subscribe(data =>{
      this.selectedCompanyId = data.id;
      
      this.getEmployeelist(data.id);
    },err =>{

    })


  }


  ngOnDestroy() {
    // --- unsubscribe all subscribe methode 
    this.subscription.unsubscribe();
  }

  // --- get all employee when open the this component
  getEmployeelist(companyId: string) {
    // --- add subscribe methode to the subscription object
  
      this.employeeService.getAllEmployee(companyId).pipe(untilDestroyed(this)).subscribe(data => {
        
        this.employeeList = data;
        if(this.add && this.employeeList.length > -1){
          const empList = [...this.employeeList];
          const index = this.employeeList.findIndex(employee => employee.id === this.addEmployee.id);
        
         var addEm = empList[index]; 
         empList[index] = empList[0];
         empList[0] = addEm;
          this.employeeList = empList;
          this.add =false;
        }
       
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })

      })

 
  }
  
  // --- that call by the employee edit button in the employee list table
  update(employee: Employee, edit) {
    this.editEmployee = employee;
    // pass the template to openModal methode
    this.openModal(edit);

  }

  // --- that call by the employee delete button in the employee list table
  delete(employee: Employee) {
    // --- genarate comfirmationform when delete the employee
    this.confirmationService.confirm({

      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

       
          // --- delete the selected employee  object from database
          this.employeeService.deleteEmployee(employee.id).pipe(untilDestroyed(this)).subscribe(data => {
            // ---  get selected employee index number in employee array
            let index = this.employeeList.indexOf(employee);
            // --- remove the selected  employee object from array
            this.employeeList.splice(index, 0);
            // --- get the rest employee  objects without deleted object
            this.employeeList = this.employeeList.filter((val, i) => i != index);
            this.toster.successToastr("Data is deleted", "Success", { position: "bottom-right", animate: "slideFromBottom" })
          }, err => {
            this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })

          })

      },
      reject: () => {
      }
    });


  }

  // --- for pop up the employee add from
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  // // --- get company list for SYSTEM ADIM 
  // getCompanylist() {
  //   this.subscription.add(
  //     this.companyService.listCompany().pipe(untilDestroyed(this)).subscribe(data => {
  //       this.CompanyList = data;

  //     }, err => {
  //       this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })

  //     })
  //   );

  // }

  // // --- get employee list for selected company
  // onSelectedCompnay(company: Company) {
  //   this.selectedCompanyId = company.id;
  //   this.getEmployeelist(this.selectedCompanyId);
  // }


  // --- this methode active when click the "get Dublicate" button
  onClickDublicate() {
    if (this.role === 'SYSTEM_ADMIN') {
      this.getDublicateEmployee(this.selectedCompanyId);
    } else {
      this.getDublicateEmployee(this.company.id);
    }
    this.clickDuplicateButton = true;
  }

  // --- get employee list that have dublicate email
  getDublicateEmployee(selectedCompanyId: string) {
  
      this.employeeService.getDublicates(selectedCompanyId).pipe(untilDestroyed(this)).subscribe(data => {
        this.dublicateEmployee = data;
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })

      })

  }

 
  uncheckAll() {
    // --- unCheck all checkBox in the dublicateEmployee table
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    // --- remove unchecked employee from the checkedEmployeeList
    if (this.checkedEmployee.length > -1) {
      this.checkedEmployee.splice(0, this.checkedEmployee.length);
    }
  }

  
  checkAll() {
    // --- Check all checkBox in the dublicateEmployee table
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = true;
    });
    // --- remove connection between  checkedEmployeeList and dublicateEmployeeList,
    // and assing dublicateEmployeeList to the checkedEmployeeList
    this.checkedEmployee = JSON.parse(JSON.stringify(this.dublicateEmployee));
  }


  onChange(event: any, employee: Employee) {
    // --- add checked employee to the checkedEmployeeList 
    if (event.target.checked) {
      this.checkedEmployee.push(employee);
    }
      // --- remove Unchecked employee from the checkedEmployeeList 
    if (!event.target.checked) {
      let index = this.checkedEmployee.findIndex(employeex => employeex.id === employee.id);
      if (index > -1) {
        this.checkedEmployee.splice(index, 1);
      }
    }



  }

  // --- delete checked employee
  deleteChecked() {


      this.employeeService.deleteCheckedEmployeeList(this.checkedEmployee).pipe(untilDestroyed(this)).subscribe(data => {

        this.checkedEmployee.forEach(employeeX => {
          this.dublicateEmployee = this.dublicateEmployee.filter(employeeY => employeeY.id !== employeeX.id);
          this.employeeList = this.employeeList.filter(employeeZ => employeeZ.id !== employeeX.id);
        });
        this.toster.successToastr("Data is deleted","Success",  { position: "bottom-right", animate: "slideFromBottom" })
      }, err => {
        this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })

      })
    
  }

  // --- check and uncheck all check box
  onChangeAllcheckboxes(event) {
    if (event.target.checked) {
      this.checkAll();
    }
    if (!event.target.checked) {
      this.uncheckAll();
    }
  }

 
}
