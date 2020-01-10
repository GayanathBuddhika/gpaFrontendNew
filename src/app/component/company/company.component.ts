import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { CompanyService } from './../../service/company.service';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, OnDestroy {

 
  // --- for modal
   modalRef: BsModalRef;
 // --- Subscription 
  private subscription: Subscription = new Subscription();

  constructor(
    private companyService: CompanyService,
    private modalService: BsModalService) { }

  ngOnInit() {
    // window.dispatchEvent(new Event('resize'));
    // document.body.className = 'hold-transition skin-blue slider-mini';

    // --- add subscribe methode to the subscription object
    this.subscription.add(
      this.companyService.get_ngxModal_add_$().pipe(untilDestroyed(this)).subscribe(data =>{
        if(data){
          this.modalRef.hide();
          this.companyService._set_ngxModal_add(false)
        }
        
      })
    );
    
  }

  ngOnDestroy() {
   
     // --- unsubscribe all subscribe methode 
     this.subscription.unsubscribe();
  }
// --- for popup the modal 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,{class: 'modal-lg'});
  }



}

