import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';

import { Company } from './../../../model/company';
import { CompanyService } from './../../../service/company.service';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Subscription } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit,OnDestroy  {

  // --- Subscription 
  private subscription: Subscription = new Subscription();

  companyList: Company[] = [];

  headers: any[];

  selectedComIdForPlan: string;

  // --- this variable define for get company object after click the edit button
  // --- this is bind  with [selectcompany] property in the #companyEditTemplate in the companyList.component.html
  onSelectedCompany: Company;

  // --- for modal
  modalRefOfCompanyList: BsModalRef;

  constructor(
    private companyService: CompanyService,
    private modalService: BsModalService,
    private confirmationService: ConfirmationService,
    public toster: ToastrManager

  ) { }

  ngOnInit() {

    this.getCompanyList();
    // -- for primeNG table
    this.headers =
      [
        { field: 'no', header: 'No' },
        { field: 'name', header: 'Name' },
        { field: 'address', header: 'Address' },
        { field: 'email', header: 'Email' },
        { field: 'businessType', header: 'BusinessType' },
        { field: 'edit', header: 'Edit' },
        { field: 'delete', header: 'Delete' },
        { field: 'isEnabled', header: 'Status'},
        { field: 'subscriptionPlan', header: 'Subscription' }
      ];

    this.companyService.get_ngxModal_edit_$().pipe(untilDestroyed(this)).subscribe(data => {

      if (data) {
        this.modalRefOfCompanyList.hide();
      }
    })

    // this.companyService.get_ngxModal_add_$().subscribe(data => {

    //   if (data) {
    //     this.modalRefOfCompanyList.hide();
    //     this.companyService._set_ngxModal_add(false)
    //   }
    // })
    // --- add subscribe methode to the subscription object
    this.subscription.add(
      this.companyService._addCompanyToList.pipe(untilDestroyed(this)).subscribe(data => {
        let comList = [...this.companyList];       
        comList.unshift(data);
        this.companyList = comList;
      })
    );

    // --- add subscribe methode to the subscription object
    this.subscription.add(
      this.companyService._editCompanyToList.pipe(untilDestroyed(this)).subscribe(data => {
        let index = this.companyList.findIndex(company => company.id === data.id);
        this.companyList[index] = data;
      })
    );


  }

  ngOnDestroy() {
    // --- unsubscribe all subscribe methode 
    this.subscription.unsubscribe();
  }

  // --- for delete company
  delete(company: Company) {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        // --- add subscribe methode to the subscription object

        this.companyService.deleteCompany(company.id).pipe(untilDestroyed(this)).subscribe(data => {
          let index = this.companyList.indexOf(company)
          this.companyList.splice(index, 0);
          this.companyList = this.companyList.filter((val, i) => i != index);
          this.toster.successToastr("Data is deleted", "Success", { position: "bottom-right", animate: "slideFromBottom" })
        }, err => {
          this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
        })


      },
      reject: () => {

      }
    });
  }

  // change company isEnabled property 
  changeIsEnabled(company: Company, number : number){    
      company.isEnabled = number;
      company.edit = true;
      this.companyService.addCompany(company,null,null,null,null).subscribe(data =>{
       
        this.toster.successToastr("company is updated", "Success", { position: "bottom-right", animate: "slideFromBottom" })
       
      });

  }

  update(company: Company, upadateTemplate) {
    this.onSelectedCompany = company;
    // --- pass the reference template to openModal methode
    this.openModal(upadateTemplate);
  }

  onClickPlan(company: Company, subscriptionListTemplate) {
    this.selectedComIdForPlan = company.id;
    this.companyService._selectCompanyForPlan.next(company);
    this.openModal(subscriptionListTemplate);
  }

  // --- for popup the modal
  openModal(template: TemplateRef<any>) {
    this.modalRefOfCompanyList = this.modalService.show(template, { class: 'modal-lg' });
  }


  getCompanyList() {

    this.companyService.listCompany().pipe(untilDestroyed(this)).subscribe(data => {

      this.companyList = data;
     // console.log("company status", this.coma);
    }, err => {
      this.toster.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
    })


  }


}
