import { CustomerService } from './../../service/customer.service';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Customer } from 'src/app/model/customet';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit,OnDestroy {

  // --- modalRef_edit to refer the modal (ngx-bootstrap) which is in customer-list.component.ts
  modalRef_edit: BsModalRef;

  headers:any[];
  customerList:Customer[];
  customer: Customer;
  constructor(private modalService: BsModalService,
              private customerService: CustomerService) { }

  ngOnInit() {
    this.getCustomerList();
    this.headers =
    [
      { field: 'no', header: 'No'},
      { field: 'name', header: 'Name'},
      { field: 'phone', header: 'Phone No'},
      { field: 'email', header: 'Email'},
      { field: 'edit', header: 'Edit'}
    ];
  }

  getCustomerList() {
    this.customerService.findAll().pipe(untilDestroyed(this)).subscribe(data=>{
      this.customerList=data;
    })
  }

  editCustomer(customer:Customer,template_edit){
    this.customer=customer;
    this.openModal1(template_edit);
  }

  openModal1(template1: TemplateRef<any>) {
    this.modalRef_edit = this.modalService.show(template1,{class: 'modal-lg'});
  }

  // ---hide modalRef_edit modal
  recevie($event){
    if ($event) {
      this.modalRef_edit.hide();
  }
  }

  ngOnDestroy(){

  }

}


