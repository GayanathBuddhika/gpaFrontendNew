import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SummaryReportOfQuestionAnswerService } from 'src/app/service/summary-report-of-question-answer.service';

@Component({
  selector: 'app-summary-answer',
  templateUrl: './summary-answer.component.html',
  styleUrls: ['./summary-answer.component.css']
})
export class SummaryAnswerComponent implements OnInit,AfterViewInit{
  
  summary : any;
  options:any;
  constructor(private summaryReportOfQuestionAnswerService : SummaryReportOfQuestionAnswerService) { 
    this.options = {
      responsive: true,
      maintainAspectRatio:false,
      legend: {
          display: false
      },
      scales:{
          yAxes:[{
              ticks:{
                  min:0,
                  max:100
              }
          }]
      }
  };
  }

  ngOnInit() {
    this.summaryReportOfQuestionAnswerService.get_summaryDataList_$().subscribe(res =>{

      this.summary = res;
    });
    
   
  }

  ngAfterViewInit(): void {
   
  }

}
