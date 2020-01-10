import { GlobalsService } from './../../../shared/globals.service';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'src/app/model/user';
import { UserService } from './../../../service/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CompanyService } from 'src/app/service/company.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class UserListComponent implements OnInit,OnDestroy {
  
    userList: User[]=[];

    modalRef_Edit: BsModalRef;

    editUser:User;

    user:User;

    headers: any[];

    isEnabled: SelectItem[];

    loggedInUserEmail:string= JSON.parse(localStorage.getItem('currentUser')).email;

    currentUserRole =this.globalService.userObject.role;

    constructor(
        private userService:UserService,
        private modalService: BsModalService, 
        private confirmationService: ConfirmationService,
        public toastr: ToastrManager,private firestore: AngularFirestore, 
        private globalService:GlobalsService, private companyService: CompanyService){}

    ngOnInit() {
        // if add or edit triggers, make them add into the lIst using subject.
        this.userService._addUserToList.pipe(untilDestroyed(this)).subscribe(res=>{            
            let uList = [...this.userList];            
            uList.unshift(res)
            this.userList = uList;
             
        })

        this.userService._editUserToList.pipe(untilDestroyed(this)).subscribe(res=>{
            let itemIndex = this.userList.findIndex(item => item.id == res.id);
            this.userList[itemIndex] = res;
            } )
        

        this.userService.ngxmodel_Edit_$().pipe(untilDestroyed(this)).subscribe(d=>{
            if(d==true){
                this.modalRef_Edit.hide()
                this.userService._set_ngxmodel_Edit(false);
            }
        })

        this.headers = [
            { field: 'no', header: 'No'},
            { field: 'firstname', header: 'First name'},
            { field: 'lastname', header: 'Last name'},
            { field: 'email', header: 'Email'},
            { field: 'isEnabled', header: 'Status'},
            { field: 'role', header: 'Role'},
            { field: 'edit', header: 'Edit'},
            { field: 'delete', header: 'Delete'}


        ];

        this.isEnabled = [
            { label: 'All', value: null },
            {label :'Enabled',value:'Enabled'},
            {label :'Disabled',value:'Disabled'}
        ]

        // if(this.currentUserRole && this.currentUserRole=== 'SYSTEM_ADMIN'){
            this.companyService.get_company_dropdown_$()
            .pipe(switchMap(company=>{
                return this.userService.findAllUserByCompanyId(company)
            })).pipe(untilDestroyed(this))
            .subscribe(res=>{
                //console.log(this.companyService.get_company_dropdown_$())
                this.userList=res;
            })
        // }else{
        //     const userCompany=this.globalService.userObject.assignDeptToBranch.company
        //     this.userService.findAllUserByCompanyId(userCompany).pipe(untilDestroyed(this)).subscribe(
        //         res=>{
        //             this.userList=res;
        //         }
        //     )
        // }

        // Call all users at start up
        //this.getAllUser();
    }

    // Getting all users
    // getAllUser(){
    //     this.userService.getAllUser().pipe(untilDestroyed(this)).subscribe(res=>{
          
    //         this.userList = res;          
    //     })
    // } 
    
    delete(user:User){   

        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.delete(user.username).pipe(untilDestroyed(this)).subscribe(res=>{
                let index=this.userList.indexOf(user)
                this.userList = this.userList.filter((val,i) => i!=index); 
                this.toastr.successToastr("Success","Data is deleted",{position:"bottom-right",animate:"slideFromBottom"}) 
               },err=>{
                this.toastr.errorToastr(err,"Error",{position:"bottom-right",animate:"slideFromBottom"})
               })
            },
            reject: () => {

            }
        });
    }

    


    update(user: User, edit){
        this.editUser=user;
        this.openModal(edit);
      
    
      }

      openModal(template: TemplateRef<any>) {
        this.modalRef_Edit = this.modalService.show(template,{class: 'modal-lg'});
      }

      changeEV(valuse:any) {
        
      }

      getLoggedInUserEmail(){
        
      }

      ngOnDestroy(){
          
      }

     }

interface SelectItem{
    label: string;
    value: string;
}


