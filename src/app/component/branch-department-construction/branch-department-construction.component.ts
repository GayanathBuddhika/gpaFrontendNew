import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, TemplateRef, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { Company } from 'src/app/model/company';
import { CompanyService } from 'src/app/service/company.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BranchService } from 'src/app/service/branch.service';
import { Branch } from 'src/app/model/branch';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationService } from 'primeng/api';
import { DepartmentService } from 'src/app/service/department.service';
import { Department } from 'src/app/model/department';
import { DepartmentAssingToBranchService } from 'src/app/service/department-assing-to-branch.service';
import { DepToBranch } from 'src/app/model/DeptToBranch';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-branch-department-construction',
  templateUrl: './branch-department-construction.component.html',
  styleUrls: ['./branch-department-construction.component.css']
})
export class BranchDepartmentConstructionComponent implements OnInit,OnDestroy {

  // ----------------------------------------------company list dropdown-----------------------------------------//
  //companyList: Company[]; 
  company:Company;
  role:string =JSON.parse((localStorage.getItem('currentUser'))).role;

  // --------------------------------------------------Branch list ---------------------------------------------- //
  branchHeaders:any[];
  branchList: Branch[];
  branch: Branch;
  //clickItemBranch =[];
  addBranchBtn:boolean= false;
  addOrEditBranch:boolean= false;

  // --- Subscription 
  private subscription: Subscription = new Subscription();

  // --- modalRef_addOr_Edit to refer the modal (ngx-bootstrap) which is in branch-list.component.ts
  modalRef_addOr_Edit_Branch: BsModalRef;
   
  // ---get reference value of checkboxes 
 // @ViewChildren("selectBranch") selectBranch: QueryList<ElementRef>;

  // -------------------------------------------Department list --------------------------------------------------- //
  departmentHeaders:any[];
  departmentList: Department [];
  department:Department;
 // clickItemDepartment =[];
  addOrEditDepartment:boolean=false;

  // ---get reference value of checkboxes 
// @ViewChildren("selectDepartment") selectDepartment: QueryList<ElementRef>;

  // --- modalRef_addOr_Edit to refer the modal (ngx-bootstrap) which is in branch-list.component.ts
  modalRef_addOr_Edit_Department: BsModalRef;
  
  // -------------------------------------------Assign Department To Branch --------------------------------------------------- //

  selectedBranch:Branch;
  assignDept:boolean= false;
  assignedOrUnassignedDept:DepToBranch;

  
  constructor(
    private companyService:CompanyService,
    public toastr: ToastrManager,
    private branchService: BranchService,
    private modalService: BsModalService,
    private confirmationService: ConfirmationService,
    private departmentService: DepartmentService,
    private departmentAssignToBranchService: DepartmentAssingToBranchService) { }

  ngOnInit() {
  
    this.companyService.get_company_dropdown_$().subscribe(res=>{

        this.company=res;
        this.getBranchList();
        this.getDepartment();
    })
    
    // ---get company list for companyListDropdown
   // this.getpComanyList();
    
   //-------------------------------------------------------Branch-----------------------------------------------//


    // ---This is for headers in the BRANCH table
    this.branchHeaders =
    [
      {field: 'no', header: 'No'},
      { field: 'name', header: 'Name'},
      { field: 'address', header: 'Address'},
      { field: 'edit', header: 'Edit'},
      { field: 'delete', header: 'Delete'}
    ];
 
    // ---If role!== SYSTEM_ADMIN show branches when page load
    if(JSON.parse((localStorage.getItem('currentUser'))).role != "SYSTEM_ADMIN"){
      
      this.company=(JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company
    
      this.getBranchList();
      this.getDepartment();
    }

    // ---if add or triggers, make them add into the lIst using subject.
     this.subscription.add(
      this.branchService.addBranchToList_$().pipe(untilDestroyed(this)).subscribe(res=>{            
        let bList = [...this.branchList];         
        bList.unshift(res)
        this.branchList = bList; 
       
      }))
     

    // ---if edit or triggers, make them add into the lIst using subject.
    this.subscription.add(
      this.branchService.editBranchToList_$().pipe(untilDestroyed(this)).subscribe(res => {
        let itemIndex = this.branchList.findIndex(item => item.id == res.id);
        this.branchList[itemIndex] = res;
        } ))

    // --- Here subscribe the _ngxmodel_branch_edit to get next value 
    // --- if it is true then close the model
    this.subscription.add(
     this.branchService.ngxmodel_branch_edit_$().pipe(untilDestroyed(this)).subscribe(data=> {
      if (data) {
        this.modalRef_addOr_Edit_Branch.hide();
    }
    }));

    //-----------------------------------------------------Department--------------------------------------------------//
    this.departmentHeaders =
    [ {field: 'no', header: 'No'},
      { field: 'name', header: 'Name'},
      { field: 'assign', header: 'Status'},
      { field: 'edit', header: 'Edit'},
      { field: 'delete', header: 'Delete'}
    ];

    // ---if add  triggers, make them add into the lIst using subject.
    this.subscription.add(
      this.departmentService.addDeptToList_$().pipe(untilDestroyed(this)).subscribe(res=>{     
           
       let dList = [...this.departmentList];         
       dList.unshift(res)
       this.departmentList = dList; 
     }))
 
     // ---if edit  triggers, make them add into the lIst using subject.
     this.subscription.add(
     this.departmentService.editDeptToList_$().pipe(untilDestroyed(this)).subscribe(res=>{
       let itemIndex = this.departmentList.findIndex(item => item.id == res.id);
       this.departmentList[itemIndex] = res;
       } ))
 
     // --- Here subscribe the _ngxmodel_dept_edit to get next value 
     // --- if it is true then close the model
     this.subscription.add(
     this.departmentService.ngxmodel_dept_edit_$().pipe(untilDestroyed(this)).subscribe(data=>{
       if (data) {
         this.modalRef_addOr_Edit_Department.hide();
     }
     }))

     // -------------------------------------------Assign Department To Branch --------------------------------------------------- //
   

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //------------------------------------------Branch ---------------------------------------------//

  // --- get the list of company for company list dropdown UI
//   getpComanyList(){
//     this.companyService.listCompany().subscribe(data => {
//     this.companyList =data;
//     }, err => {
//       this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
//     })
    
//   }

  // --- give next value for companyDropDown
  callCompany(company:Company){
  
    // ---for remove status of previous company and show new status
    this.assignDept = false;
    this.companyService._set_company_dropdown(company);
    
    this.company=company;
    this.getBranchList();
    this.getDepartment();
  }

   // --- get  branch list
  getBranchList() {
    this.branchService.getBranch(this.company.id).pipe(untilDestroyed(this)).subscribe(branchData => {
      this.branchList = branchData;
    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    });
  }

  // --- update branch list
  updateBranch(branch: Branch, template_edit) {
    this.addOrEditBranch= true;
    this.branch = branch;
    this.openModalUpdateBranch(template_edit);
  }

  openModalUpdateBranch(template1: TemplateRef<any>) {
    this.modalRef_addOr_Edit_Branch = this.modalService.show(template1,{class: 'modal-lg'});
  }

  // --- get information for delete a branch
  deleteBranch(branchId) { 
      
    // ---This will ask to confirm befor delete the value
       this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
        
            this.branchService.deleteBranch(branchId.id,JSON.parse((localStorage.getItem('currentUser'))).assignDeptToBranch.id).pipe(untilDestroyed(this)).subscribe(res => {
           
              if(res.notexist){
                // ---when delete the branch real time update branch-list
                const index =this.branchList.indexOf(branchId);
                this.branchList = this.branchList.filter((val,i) => i !== index); 
                this.toastr.successToastr( "Data is deleted","Success", {position: "bottom-right", animate: "slideFromBottom"}); 
              }else{
                this.toastr.errorToastr(res.exist,"Error", {position: "bottom-right", animate: "slideFromBottom"});
              }
              
           }, err => {
                this.toastr.errorToastr(err.error.details,"Error", {position: "bottom-right", animate: "slideFromBottom"});
           });
        },
        reject: () => {

        }
    });
  }  

  // ---This is delete all selected branches
  // deleteAllBranch() {
  //   this.selectBranch.forEach((element) => {
  //     element.nativeElement.checked = true;
  //   });

  //   // ---assign value of branchList into clickItem 
  //   // ---after assigning the value there is no connection between them
  //   // this.clickItem=JSON.parse(JSON.stringify(this.branchList))

  //   this.confirmationService.confirm({
  //     message: 'Are you sure that you want to proceed?',
  //     header: 'Confirmation',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.subscription.add(
  //         this.branchService.deleteAll(this.clickItemBranch).subscribe(res => {
  //           for (let i = 0; i < this.clickItemBranch.length; i++) {
  //             const index = this.branchList.indexOf(this.clickItemBranch[i]);
  //             this.branchList = this.branchList.filter((val, i) => i !== index); 
  //           }
  //         this.toastr.successToastr( "Data is deleted","Success", {position: "bottom-right", animate: "slideFromBottom"}); 
  //        }, err => {
  //         this.toastr.errorToastr(err.error.details,"Error", {position: "bottom-right", animate: "slideFromBottom"});
  //        }));
  //     },
  //     reject: () => {

  //     }
  // });
    
  // }

  // ---get ckecked value from front end for delete
  // onChangeBranch(event: any, branch: Branch) {
  //   if (event.target.checked) {
  //     this.clickItemBranch.push(branch);
  //   } 
  // // ---Remove unchecked element from clickItem array
  //   if (!event.target.checked) {
  //     const index = this.clickItemBranch.indexOf(branch);

  //     if (index > -1) {

  //       this.clickItemBranch.splice(index, 1);
  //     }
  //   }
  // }

  // ---add new branch
  addBranch(template: TemplateRef<any>,branch:Branch) {

    this.addOrEditBranch=false;
    this.modalRef_addOr_Edit_Branch = this.modalService.show(template,{class: 'modal-lg'});
  } 

  //------------------------------------------Departmet ---------------------------------------------//

   // --- get list of department by company id
   getDepartment(){
    this.subscription.add(
    this.departmentService.getDepartment(this.company.id).pipe(untilDestroyed(this)).
    subscribe(departmentData=>{
    this.departmentList = departmentData;
    }, err => {
      this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
    }))
  }

  // --- update Department
  updateDepartment(department: Department, tem){

    this.addOrEditDepartment=true;
    this.department=department;
    this.openModalUpdateDepartment(tem);
  }

  openModalUpdateDepartment(template: TemplateRef<any>) {
    this.modalRef_addOr_Edit_Department = this.modalService.show(template,{class: 'modal-lg'});
  }

  // --- Delete depatrtment
  deleteDepartment(department:Department){

    // ---This will ask to confirm befor delete the value
       this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.departmentService.deleteDepartment(department.id,JSON.parse((localStorage.getItem('currentUser'))).assignDeptToBranch.id)
            .pipe(untilDestroyed(this)).subscribe(data =>{
            
              if(data["notexist"]){
                // ---when delete the department real time update department-list
                let index=this.departmentList.indexOf(department)
                this.departmentList = this.departmentList.filter((val,i) => i!=index); 
                this.toastr.successToastr("Data is deleted","Success",{position:"bottom-right",animate:"slideFromBottom"}) 
              }else{
                this.toastr.errorToastr(data["exist"],"Error", {position: "bottom-right", animate: "slideFromBottom"});
              }
              
           },err=>{
            this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
           })
        },
        reject: () => {

        }
    });
    
  }

  // ---This is delete all selected branches
  // deleteAllDepartment(){

  //   this.selectDepartment.forEach((element) => {
  //     element.nativeElement.checked = true;
  //   });
    
  //   this.confirmationService.confirm({
  //     message: 'Are you sure that you want to proceed?',
  //     header: 'Confirmation',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //         this.departmentService.deleteAll(this.clickItemDepartment).subscribe(res=>{
  //           for(var i=0;i<this.clickItemDepartment.length;i++){
  //             let index=this.departmentList.indexOf(this.clickItemDepartment[i]);
  //             this.departmentList = this.departmentList.filter((val,i) => i!=index); 
  //           } 
  //         this.toastr.successToastr("Data is deleted","Success",{position:"bottom-right",animate:"slideFromBottom"}) 
  //        },err=>{
  //         this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
  //        })
  //     },
  //     reject: () => {

  //     }
  // });
    
  // }

  // ---get ckecked value from front end for delete
  // onChangeDepartment(event:any,dept:Department){
  //   if (event.target.checked) {

  //     this.clickItemDepartment.push(dept);
  //   } 
  // // ---Remove unchecked element from clickItem array
  //   if (!event.target.checked) {
  //     let index = this.clickItemDepartment.indexOf(dept);

  //     if (index > -1) {

  //       this.clickItemDepartment.splice(index, 1);
  //     }
  //   }
    
  // }

   // ---add new Department
   addDepartment(template: TemplateRef<any>,branch:Department) {
    
    this.addOrEditDepartment=false;
    this.modalRef_addOr_Edit_Department = this.modalService.show(template,{class: 'modal-lg'});
  } 

  // -------------------------------------------Assign Department To Branch --------------------------------------------------- //

  // ---get assign or un assigned department
  // assignDeptToBranch(){
    
 // }

  
  onRowSelect(event){
    
    this.selectedBranch = event.data;

    // ---get all assigned and unassigned department
    this.departmentAssignToBranchService.assignDeptToBranch(this.selectedBranch.id).pipe(untilDestroyed(this))
      .subscribe(data=>{
        this.assignDept= true;
 
        const departmentList=[];
      
        data.assignedDept.forEach(element => {
          element.assign = true;
          departmentList.push(element);
        });

        data.unassignedDept.forEach(element=>{
          element.assign =false;
          departmentList.push(element);
        })
        
        this.departmentList = departmentList;
        
        
     }, err => {
      this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
     })
  }

  assignDepartment(department:Department){


    // ---save assigned departmemnt
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
                
    this.assignedOrUnassignedDept = new DepToBranch();

    this.assignedOrUnassignedDept.company=this.company;
    this.assignedOrUnassignedDept.department = department;
    this.assignedOrUnassignedDept.branch=this.selectedBranch;

    // ---remove property from department 
    delete this.assignedOrUnassignedDept.department['assign'];

        this.departmentAssignToBranchService.assignDepartment(this.assignedOrUnassignedDept).pipe(untilDestroyed(this)).subscribe(data=>{
        
          let itemIndex = this.departmentList.findIndex(item => item.id == data.department.id);
          this.departmentList[itemIndex]['assign'] = true; 
          this.toastr.successToastr("Department is Assigned","Success",{position:"bottom-right",animate:"slideFromBottom"}) 
         },err=>{
          this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
         })
      },
      reject: () => {

      }
  });
  
  
  }

  // ---save unassigned department 
  unassignDept(department:Department){
    
   
    
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.assignedOrUnassignedDept = new DepToBranch();

    this.assignedOrUnassignedDept.company=this.company;
    this.assignedOrUnassignedDept.department = department;
    this.assignedOrUnassignedDept.branch=this.selectedBranch;
    
    delete this.assignedOrUnassignedDept.department['assign'];

          this.departmentAssignToBranchService.UnassignDepartment(this.assignedOrUnassignedDept).pipe(untilDestroyed(this)).subscribe(data=>{
         
            if(data.notexist){
              this.toastr.successToastr( "Successfully Unassigned","Success", {position: "bottom-right", animate: "slideFromBottom"});
            }else{
              this.toastr.errorToastr(data.exist,"Error",{position:"bottom-right",animate:"slideFromBottom"})
              
              let itemIndex = this.departmentList.findIndex(item => item.id == department.id);
              this.departmentList[itemIndex]['assign'] = true;
            }

            
          },err=>{
            let itemIndex = this.departmentList.findIndex(item => item.id == department.id);
            this.departmentList[itemIndex]['assign'] = true;
            this.toastr.errorToastr(err.error.details,"Error",{position:"bottom-right",animate:"slideFromBottom"})
          })
        },
        reject: () => {
  
        }
    });
  }

}


