import { TitleCasePipe } from '@angular/common';
import { AnswersType } from './../../../../model/answersType';
import { QuestionService } from './../../../../service/question.service';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { SentenceCasePipe } from 'src/app/pipe/sentence-case.pipe';
import { ToastrManager } from 'ng6-toastr-notifications';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-question-controller',
  templateUrl: './question-controller.component.html',
  styleUrls: ['./question-controller.component.css']
})
export class QuestionControllerComponent implements OnInit,OnDestroy{
  // pass answerType object to the QuestionAndAnswerConponent(parent)
  @Output() answertypeEvent = new EventEmitter<AnswersType>();
  @Input('dropdownDisable') dropdownDisable : boolean; 
  edit :boolean = false;

  // --- get edit question
  editQuestion:any;

  // --- get selected answerTypeObject
  answersType:AnswersType;

  // --- get question
  question: string;

  // --- get all answerType objects
  answerTypes: any[];

  // --- get edit answerType object
  editAnswertype : any;

  constructor(private questionService : QuestionService,
    private sentenceCasePipe : SentenceCasePipe,
    private titlecasepaipe: TitleCasePipe,
    public toastr: ToastrManager,) {

 
   
   }

  ngOnInit() {
  // --- get all types from back end
    this.editAnswertypes();

    this.questionService._getEdit.pipe(untilDestroyed(this)).subscribe(data =>{
      this.edit = data;
     
    });

    if(this.edit){
// --- pass question type, answers objects, question, and required as an object  
      this.questionService.edit_QuestionAndAnswerObject_$().pipe(untilDestroyed(this)).subscribe(data =>{
        if(data.length !=0){
        this.editQuestion = data;
        this.question = this.editQuestion[0].question;
        // --- translate answerType camelCase to titleCase "this.titlecasepaipe.transform(this.sentenceCasePipe.transform(this.editQuestion[0].answerType.type)"
        this.editAnswertype = {'type':this.editQuestion[0].answerType , 'sentenceCaseType':this.titlecasepaipe.transform(this.sentenceCasePipe.transform(this.editQuestion[0].answerType.type))};
        // --- pass the edit answerType object to the "selectedAnswerType" methode
        this.selectedAnswerType(this.editAnswertype);
     
        } 
      });
  

    }

  }

  editAnswertypes(){
    this.questionService._getAnswerTypes.pipe(untilDestroyed(this)).subscribe(data =>{
      this.answerTypes =data;
      const answerTypeList : any[]=[];
      // --- translate answerType camelCase to titleCase "this.titlecasepaipe.transform(this.sentenceCasePipe.transform(this.editQuestion[0].answerType.type)"
      // --- create new json object like "{type:{id:"",ai:"",type:""},editType:"Titlecase Strign"}" and push that object to dummiAnswerType object array 
      this.answerTypes.forEach(element => {
        /// --- remove daterange answer type from the answerList array.
        /// ---- becouse when we implement it , program is very complex
        if(element.type !=="dateRange"){
          answerTypeList.push({'type': element , 'sentenceCaseType':this.titlecasepaipe.transform(this.sentenceCasePipe.transform(element.type))})
        }
      
     });
   this.answerTypes = answerTypeList;

    },err =>{
      this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    })
     
    
  }


  selectedAnswerType(value:any){

    this.answersType =value.type;
    this.answertypeEvent.emit(this.answersType);

  }

  ngOnDestroy() {

  }

}
