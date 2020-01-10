import { GlobalsService } from './../../shared/globals.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './../../service/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy, TemplateRef } from "@angular/core";
import { ToastrManager } from 'ng6-toastr-notifications';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit, OnDestroy {  
    
    // --- modalRef_add to refer the modal (ngx-bootstrap) which is in user.component.ts
    modalRef_add: BsModalRef;    
    currentUserRole =this.globalsService.userObject.role;

    constructor(private modalService: BsModalService, 
        private userService:UserService, private globalsService:GlobalsService,
        public toastr: ToastrManager) { }       

    ngOnInit() {
        // window.dispatchEvent(new Event("resize"));
        // document.body.className = "hold-transition skin-blue slider-mini";
        
        // --- Since _ngxmodel_Add is a Subject<>(), this is added when the component loads itself
        // --- The value is being passed from user-add.component.ts
        this.userService.ngxmodel_Add_$().pipe(untilDestroyed(this)).subscribe(res => {      
            if (res === true) {
                this.modalRef_add.hide();
                this.userService._set_ngxmodel_Add(false);
            }
        });
    }
  
    openModal(template: TemplateRef<any>) {
     
        this.modalRef_add = this.modalService.show(template,{class: 'modal-lg',backdrop: 'static', keyboard: false, ignoreBackdropClick: true});
    } 

    ngOnDestroy() {
      
    }
}
