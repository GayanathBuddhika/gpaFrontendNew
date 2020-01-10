import { SubscriptionService } from './../../service/subscription.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  modalRef : BsModalRef;

  constructor(private modalService: BsModalService, private subscriptionService: SubscriptionService) { }

  ngOnInit() {
    // window.dispatchEvent(new Event('resize'));
    // document.body.className = 'hold-transition skin-blue slider-mini';
    
    this.subscriptionService.get_ngxModal_add_$().subscribe(data =>{
      if(data === true){
        this.modalRef.hide();
      }
    });
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,{class: 'modal-lg'});
  }

}
