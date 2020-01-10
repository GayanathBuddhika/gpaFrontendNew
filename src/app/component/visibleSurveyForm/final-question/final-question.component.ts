import { FinalQA } from './../../../model/finalQA';
import { InputComponentComponent } from './../../../shared/input-component/input-component.component';
import { Question } from './../../../model/question';
import { Component, OnInit, Input, ViewChildren, QueryList, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { StringToJsonObjectPipe } from 'src/app/pipe/string-to-json-object.pipe';

@Component({
  selector: 'app-final-question',
  templateUrl: './final-question.component.html',
  styleUrls: ['./final-question.component.css'],
  //encapsulation: ViewEncapsulation.Native
})
export class FinalQuestionComponent implements OnInit {
 

   // input field from Visible-Question-and-answer.component
   @Input("Oderbyquestion") Oderbyquestion:any[]=[];
   @Input("question") question : Question;
   @Input("qNumber") qNumber: number;
   @Input("modified") modified : boolean;
   @Input("modifiedAnswer") modifiedAnswer : FinalQA[]; 
   @Input("disableInputComponent") disableInputComponent : boolean;
   
   viewErrorMsg: boolean=false;
   
   @ViewChildren(InputComponentComponent) inputComs: QueryList<InputComponentComponent>;

  constructor() { }

  ngOnInit() {
   
  }

}
