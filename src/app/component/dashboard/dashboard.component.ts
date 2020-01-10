import { DashboardService } from './../../service/dashboard.service';
import { AuthService } from './../../core/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxPowerBiService } from 'ngx-powerbi';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

    private powerBiService: NgxPowerBiService;
    private pbiContainerElement: HTMLElement;

    private reportId = "93d760b2-d843-489c-9985-e446968a0453";
    private groupId = "109d62d9-cfa5-490f-ab38-436e847da98c";
    private filterPaneEnabled= false;
    private navContentPaneEnabled= true;
    
  constructor(private authService: AuthService,private dashboardService:DashboardService) {
    this.powerBiService = new NgxPowerBiService();
   }

  ngOnInit() {

    // this.dashboardService.getAccessToken().pipe(untilDestroyed(this)).subscribe(token=>{
    //     const config = {
    //         type: 'report',
    //         id: this.reportId,
    //         embedUrl:
    //           'https://app.powerbi.com/reportEmbed?' +
    //           'reportId='+this.reportId +
    //           '&groupId='+ this.groupId,
    //         accessToken:token.accessToken,
    //         settings: {
    //           filterPaneEnabled: this.filterPaneEnabled,
    //           navContentPaneEnabled: this.navContentPaneEnabled
    //         },
    //         filters:[{
    //             $schema: "http://powerbi.com/product/schema",
    //             filterType:1,
    //             target: {
    //               table: "Master",
    //               column: "companyId"
    //             },
    //             operator: "In",
    //             values: [101]		

    //           }]
    //       };
    //     console.log(config)
    //     this.pbiContainerElement = <HTMLElement>(document.getElementById('pbi-container'));
    //     this.powerBiService.embed(this.pbiContainerElement, config);
    // })

   
    
  }

  ngOnDestroy(){
    // document.body.className = '';
  }

  logout() {
    this.authService.logout();
  }
}
