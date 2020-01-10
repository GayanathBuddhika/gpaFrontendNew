import { EmployeeService } from './../../service/employee.service';
import { TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit,OnDestroy } from '@angular/core';
import {  Subscription } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit,OnDestroy {
  // --- fro modal
  modalRef: BsModalRef;
  // --- Subscription 
  private subscription: Subscription = new Subscription();
  

  // --- get loged current user role
  currentUserRole: string = (JSON.parse(localStorage.getItem("currentUser"))).role;

  constructor(
    private modalService : BsModalService,
    private employeeService: EmployeeService) { }

  ngOnInit() {
 

     // --- add subscribe methode to the subscription object
     this.subscription.add(
          this.employeeService.get__ngxModal_add_$().pipe(untilDestroyed(this)).subscribe(data => {
            if(data === true){
              this.modalRef.hide();
            }
          })
     );
     // --- add subscribe methode to the subscription object
     this.subscription.add(
      this.employeeService.get_ngxModal_csv_$().pipe(untilDestroyed(this)).subscribe(data => {
        if(data === true){
          this.modalRef.hide();
        }
      })
 );
    
  }

  ngOnDestroy() {
    // --- unsubscribe all subscribe methode 
    this.subscription.unsubscribe();
  }

  openModal(template :TemplateRef<any>){
    this.modalRef = this.modalService.show(template,{class: 'modal-lg'});
  }

}
