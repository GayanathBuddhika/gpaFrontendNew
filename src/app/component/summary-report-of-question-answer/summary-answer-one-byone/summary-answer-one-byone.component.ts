import { PagerService } from './../../../service/pager.service';
import { KeyValuePipe } from '@angular/common';
import { FinalQA } from './../../../model/finalQA';
import { Component, OnInit, Input } from '@angular/core';
import { ConcatSource } from 'webpack-sources';
import { copyStyles } from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-summary-answer-one-byone',
  templateUrl: './summary-answer-one-byone.component.html',
  styleUrls: ['./summary-answer-one-byone.component.css']
})
export class SummaryAnswerOneByoneComponent implements OnInit {

  @Input('allAnswersMapByUuid') allAnswersMapByUuid: any[];
  @Input('answers') answers : any[];
  // --- get munber of submition
  totalRecord : number 
  // --- get one users answers
  selectedFinalQa : FinalQA[];
  // --- get finalQA map object that map by question id
  finalQAmapByqId: any [];
  finalQAmapByqIdArrayList: any[];
  answerArrayList: any[];
   // --- pager object
   pager: any = {};
     // --- paged items
  pagedItems: any[];
  constructor(
    private keyValuePipe: KeyValuePipe,
    private pagerService: PagerService
  ) { }

  ngOnInit() {

    this.totalRecord = this.allAnswersMapByUuid.length;
    const pagenum: any ={"page":0,"first":0,"rows":1,"pageCount":4}
       // initialize to page 1
    this.userNumner(pagenum);
      
  }

  userNumner(event){   
    this.finalQAmapByqIdArrayList = [];
    this.answerArrayList = [];
    // get final answer that map by uuid
    this.selectedFinalQa = this.allAnswersMapByUuid[event.page].value;
    // convert to final-question-answer-map-by-question-id from final-question-answer-map-by-uuid 
    this.finalQAmapByqId = this.formatedCerts(this.selectedFinalQa);
    this.finalQAmapByqIdArrayList = this.keyValuePipe.transform(this.finalQAmapByqId);
    this.answerArrayList = this.keyValuePipe.transform(this.answers);
    console.log("answer array list befor merge", this.answerArrayList);
    this.mergeFinalQaAndAnswer(this.answerArrayList,this.finalQAmapByqIdArrayList);
   
   console.log("answer array list after merge", this.answerArrayList);
    this.setPage(1);
  }

  mergeFinalQaAndAnswer(answer: any[], finalQa: any[]){
    this.answerArrayList.forEach(answer =>{
      answer.finalAnswer = [];
      this.finalQAmapByqIdArrayList.forEach(finalAnswer =>{
         
        if(answer.key === finalAnswer.key){
          answer.finalAnswer = finalAnswer.value;
        }

      })
    })
    //this.finalQAmapByqIdArrayList = this.finalQAmapByqIdArrayList.sort((a,b) =>a.value[0].question.ai - b.value[0].question.ai);
    this.answerArrayList = this.answerArrayList.sort((a,b)=>a.value[0].question.ai - b.value[0].question.ai);
   
  }

  formatedCerts(array :any[]) {
    return array.reduce((prev, now) => {
      if (!prev[now.answerId.question.id]) {
        prev[now.answerId.question.id] = [];
      }

      prev[now.answerId.question.id].push(now);
      return prev;
    }, {});

   }

   setPage(page: number) {
      // ---  get oager object return by pagersurveiceS
    this.pager = this.pagerService.getPager(this.answerArrayList.length, page);
    // enable submit button when current page is last QA page
    if(this.pager.currentPage === this.pager.endPage){
    // this.viewSubmitButton = true;
   // this.viewButton = true;
    } else {
      //this.viewButton = false; 
    }
  // get items of current page 
  this.pagedItems = JSON.parse(JSON.stringify(this.answerArrayList.slice(this.pager.startIndex, this.pager.endIndex + 1)));

 console.log(" ####################",this.pagedItems);
   }
   
}
