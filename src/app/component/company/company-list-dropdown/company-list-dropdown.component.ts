import { BranchService } from 'src/app/service/branch.service';
import { Company } from './../../../model/company';
import { CompanyService } from './../../../service/company.service';
import { Component, OnInit , ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ToastrManager } from 'ng6-toastr-notifications';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-company-list-dropdown',
  templateUrl: './company-list-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./company-list-dropdown.component.css']
})
export class CompanyListDropdownComponent implements OnInit,OnDestroy  {

  companyList: Company[]; 
  
  constructor(
    private companyService:CompanyService,
    public toastr: ToastrManager) { this.getpComanyList();}

  ngOnInit() {    

  }

  // --- get the list of company for company list dropdown UI
  getpComanyList(){
       this.companyService.listCompany().pipe(untilDestroyed(this)).subscribe(data => {
      this.companyList =data;
    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    })
    
  }

  // --- give next value for companyDropDown
  callCompany(company:any){
    this.companyService._set_company_dropdown(company);
    
  }

  ngOnDestroy() {

  }
}
