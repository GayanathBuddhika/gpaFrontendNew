import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[lkRemoveLeadingZero]'
})
export class LkRemoveLeadingZeroDirective {
 
    // --- Removed space " " in nodemodules/ngz-international-phone-number/index.js line 2200
  private phoneNumber:string;

  constructor() { }

    
    @HostListener('keypress', ['$event']) handleKeyPress(event) { 

      if((event.target.value).trim().substring(0,3)==="+94" && (event.target.value).trim().length===3){  
        if(event.key === "0"){
          event.preventDefault()
        }    
      }else{
        this.phoneNumber=event.target.value
      }
    }

    @HostListener('keyup', ['$event']) handleKeyUp(event) {      
      if((event.target.value).trim().substring(0,3)==="+94" &&  (event.target.value).trim().replace(" ","").indexOf("0")===3){
        event.target.value=this.phoneNumber  }
    }
}
