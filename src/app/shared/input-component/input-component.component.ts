import { forEach } from '@angular/router/src/utils/collection';
import { FinalQA } from './../../model/finalQA';
import { Answer } from './../../model/answer';
import { Question } from './../../model/question';
import { AnswerObject } from '../../model/answerObject';

import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { QuestionService } from 'src/app/service/question.service';

@Component({
  selector: 'app-input-component',
  templateUrl: './input-component.component.html',
  styleUrls: ['./input-component.component.css']
})
export class InputComponentComponent implements OnInit ,AfterViewInit{

  @Input() type: string;
  @Input() finalQA: boolean = false;
  @Input() qalayout: boolean = false;

  @Input() inputDisable: boolean = false;
  @Input() question: Question;

  @Input() answer: string;
  @Input() answerObject: Answer;
  @Input() viewQuestion: boolean = false;

  @ViewChild("start") start: ElementRef;
  @ViewChild("end") end: ElementRef;
  @ViewChild("radio") radio: ElementRef;
  @ViewChild("checkbox") checkbox: ElementRef;
  @ViewChild("inputbox") inputbox: ElementRef;
  @ViewChild("textarea") textarea: ElementRef;
  @ViewChild("singaldate") singaldate: any;
  @ViewChild("startDate") startDate: any;
  @ViewChild("endDate") endDate: any;
  //@ViewChild("rate") rate: any;
  @Input("modified") modified: boolean;
  @Input("modifiedAnswer") modifiedAnswer: FinalQA[];

  rate : string = '0';
  // [modified]="modified"
  //     [modifiedAnswer]="modifiedAnswer"

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
   // this.answer = this.answerObject.value;
 
// if(this.reportQA){
//  this.type = this.question.answersType.type
//  console.log("########################33",this.type) ;
// }
  
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if(this.modified){
    
      this.setValueToInputField();
    }
      // --- for solve Expression ___ has changed after it was checked error
    this.cdr.detectChanges();
  }
  // --- set filled input field valuves when click next and previous button
  setValueToInputField() {
    this.modifiedAnswer.forEach(modifyAnswer =>{
      switch (this.question.answersType.type){

         case "radio":
           
            if(modifyAnswer.answerId.id === this.answerObject.id){
              this.radio.nativeElement.checked = true;
            }

         break;

        case "checkBox":
            if(modifyAnswer.answerId.id === this.answerObject.id){
              this.checkbox.nativeElement.checked = true;
            }
         break;

        case "inputBox":
            if(modifyAnswer.answerId.id === this.answerObject.id){
         
              this.inputbox.nativeElement.value = modifyAnswer.answer;
            }

         break;

        case "textArea":
            if(modifyAnswer.answerId.id === this.answerObject.id){
              this.textarea.nativeElement.value = modifyAnswer.answer;
            }

         break;

        case "singalDate":
            console.log("single date 111111")
          if(modifyAnswer.answerId.id === this.answerObject.id){
            console.log("single date ******")
            this.singaldate.nativeElement.value = modifyAnswer.answer;
          }

         break;

        case "dateRange":

         break;
        case "rating":
            if(modifyAnswer.answerId.id === this.answerObject.id){
              
              this.rate = modifyAnswer.answer;
            }
       
         break;
      }

    });
  }

}
