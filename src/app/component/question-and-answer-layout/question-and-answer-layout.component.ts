import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SbdRelation } from 'src/app/model/sbdRelation';
import { Survey } from './../../model/Survey';
import { ServeyService } from './../../service/servey.service';
import { QuestionService } from './../../service/question.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnDestroy } from '@angular/core';
import { SurveyQuestionSelection } from 'src/app/model/surveyQuestionSelection';
import { ToastrManager } from 'ng6-toastr-notifications';
import { QuestionAndAnswersComponent } from './question-and-answers/question-and-answers.component';
import { Router } from "@angular/router"
import { untilDestroyed } from 'ngx-take-until-destroy';
//                   QuesionAndAnswerLayout-Component
//    |----------------------------------------------------------|
//    |                                                          |
//    |                      Input-Component                     |
//    |                                                          |
//    |                                                          |
//    |               QuestionAndAnswer-Component                |
//    |       |----------------------------------------|         |
//    |       |       QuestionController-Component     |         |
//    |       |                                        |         |
//    |       |                                        |         |
//    |       |              Input-Component           |         |
//    |       |                                        |         |
//    |       |----------------------------------------|         |
//    |                                                          |
//    |                                                          |
//    |----------------------------------------------------------|


@Component({
  selector: 'app-question-and-answer-layout',
  templateUrl: './question-and-answer-layout.component.html',
  styleUrls: ['./question-and-answer-layout.component.css']
})
export class QuestionAndAnswerLayoutComponent implements OnInit,OnDestroy {

  // --- this is true when when click the "ADD QUESTION" button 
  // --- this is using to view "app-question-and-answers" component 
  viewQuestion = false;
  // --- for modals
  modalRef: BsModalRef;
  savedSurveyName: String;
  surveyKey: String;

  // --- store created question and answer object in array
  qaObjects: any[] = [];


  // --- this is store the edit questionAnswer object when you click the edit button
  // editQaObjects: any;

  // --- this is use to add index number to the questionAnswer Object when u add the object to the "qaObjects" array 
  index: number = 0;

  //assignDeptToBranch: string = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.id;
  // --- for get the survey object from service
  survey: Survey;

  // --- for get the selected SelectionType from service
  selectedSelectionTypeObject: SbdRelation[] = [];

  // --- converter to add survey,question and selections (Braches | Department), sending to backend
  surveyQuestionSelection: SurveyQuestionSelection;

  // --- edit button
  editQuestion: boolean = false;

  // --- index number of the edit qiestion
  objectIndex: number;

  // --- Showing the realtime survey key onve saved
  @ViewChild("saveSurveyModal") saveSurveyModal: TemplateRef<any>;
  @ViewChild(QuestionAndAnswersComponent) questionAndAnswersComponent: QuestionAndAnswersComponent;

  constructor(
    private questionService: QuestionService,
    private surveyService: ServeyService,
    public toastr: ToastrManager,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit() {

    // --- get edited questionAnswer object 
    this.questionService._setEditedObject.pipe(untilDestroyed(this)).subscribe(data => {
      const index = this.qaObjects.findIndex(qaObject => qaObject.index === data.index)
      this.qaObjects[index] = data;
      this.editQuestion = false;
      this.questionService._getEdit.next(false);

    });

    // --- get survey object from service
    this.surveyService._setSurveyObject.pipe(untilDestroyed(this)).subscribe(data => {
      // ---  redirect to the survey create component if not created survey object
      if (data == null) {
        console.log("redirect asdasd");
        this.router.navigate(['/survey/add']);
        return;
      } else {
        this.survey = data.survey;
        this.selectedSelectionTypeObject = data.sbdRelation;

      }
    
    })

    // --- get the selectedSelectionTypeObject fro service
    // this.surveyService._setselectedSelectionTypeObject.pipe(untilDestroyed(this)).subscribe(data => {
    //   this.selectedSelectionTypeObject = data;
    // })

    // --- get all types from back end
    this.getAnswertypes();
    // **************** only for test 
  //  this.receiveQuesAnsCSSSSSSSS();
  }



  // --- change viewQuestion value to "true" when u click "ADD QUESTION" button 
  // onAddQuestion() {
  //   this.viewQuestion = true;
  // }


  // --- Show the Question and Answer component 
  // --- 1) If click on "ADD QUESTION" button in this component
  // --- 2) If click on "ADD" (child->parent) after creating the answers (@Output())
  showQuesAnsComponent(event: boolean) {
    this.viewQuestion = event;
    
  }

  // --- get new questionAnswer object and push it to the "qaObjects" array when u click "Add" button in QuestionAnsAnswer Component
  // ---  
   /////// ---- ************************** this is real methode Do not delete ***********************
  receiveQuesAns(event) {
    // --- dont delete it
    // --- add this index to the QuaAnsObject for identifiy the that object
    // --- othervice   
    this.editQuestion = false;
    this.index = this.index + 1;
    event.index = this.index;
    this.qaObjects.push(event);
    //this.qaObjects = [{"question":"what is your name ?","answerType":{"id":"3","ai":3,"type":"inputBox"},"answerList":[{"value":""}],"required":true,"index":1},{"question":"what is your address ?","answerType":{"id":"4","ai":4,"type":"textArea"},"answerList":[{"value":""}],"required":false,"index":2},{"question":"what is your gender ? ","answerType":{"id":"1","ai":1,"type":"radio"},"answerList":[{"value":"mail","id":"0b5e74ec-e45d-45cd-8e4f-58be0e64deb1"},{"value":"femail","id":"f84e2fdd-df09-45bf-be04-a6518a52e803"}],"required":true,"index":3},{"question":"what is your job position ?","answerType":{"id":"2","ai":2,"type":"checkBox"},"answerList":[{"value":"software engineer","id":"1d67d278-c936-45a4-8210-28daf0578d6e"},{"value":"web developer","id":"f5cdfa5a-9ee8-49a5-9bba-ee54b83d7174"},{"value":"manager","id":"8435feed-db7a-4fcd-9d26-014e427705c4"},{"value":"QA","id":"45bdb2e0-875d-469f-ba5c-e284d1b467c6"}],"required":true,"index":4},{"question":"Start date ?","answerType":{"id":"5","ai":5,"type":"singalDate"},"answerList":[{"date":""}],"required":false,"index":5},{"question":"rate our company ?","answerType":{"id":"7","ai":7,"type":"rating"},"answerList":[{"rangeValue":""}],"required":false,"index":6}];
    console.log("on click add button viewquetion", JSON.stringify(this.qaObjects));


  }
// // *********** this methode for test only for create CSS ***********************************
//   receiveQuesAnsCSSSSSSSS() {
//     // --- dont delete it
//     // --- add this index to the QuaAnsObject for identifiy the that object
//     // --- othervice   
//     // this.editQuestion = false;
//     // this.index = this.index + 1;
//     // event.index = this.index;
//     // this.qaObjects.push(event);
//     const qaObjects = [{"question":"what is your name ?","answerType":{"id":"3","ai":3,"type":"inputBox"},"answerList":[{"value":""}],"required":true,"index":1},{"question":"what is your address ?","answerType":{"id":"4","ai":4,"type":"textArea"},"answerList":[{"value":""}],"required":false,"index":2},{"question":"what is your gender ? ","answerType":{"id":"1","ai":1,"type":"radio"},"answerList":[{"value":"mail","id":"0b5e74ec-e45d-45cd-8e4f-58be0e64deb1"},{"value":"femail","id":"f84e2fdd-df09-45bf-be04-a6518a52e803"}],"required":true,"index":3},{"question":"what is your job position ?","answerType":{"id":"2","ai":2,"type":"checkBox"},"answerList":[{"value":"software engineer","id":"1d67d278-c936-45a4-8210-28daf0578d6e"},{"value":"web developer","id":"f5cdfa5a-9ee8-49a5-9bba-ee54b83d7174"},{"value":"manager","id":"8435feed-db7a-4fcd-9d26-014e427705c4"},{"value":"QA","id":"45bdb2e0-875d-469f-ba5c-e284d1b467c6"}],"required":true,"index":4},{"question":"Start date ?","answerType":{"id":"5","ai":5,"type":"singalDate"},"answerList":[{"date":""}],"required":false,"index":5},{"question":"rate our company ?","answerType":{"id":"7","ai":7,"type":"rating"},"answerList":[{"rangeValue":""}],"required":false,"index":6}];
   
//     qaObjects.forEach(data => {
//      this.receiveQuesAns(data) ;
//     })
//     console.log("on click add button viewquetion", JSON.stringify(this.qaObjects));


//   }
  // --- this is for dran and drop function to the "qaObjects" array
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.qaObjects, event.previousIndex, event.currentIndex);
  }


  onDelete(index) {
    this.qaObjects = this.qaObjects.filter((val, i) => i !== index);
  }

  // --- filter the selected edit object and send it to the behaviorSubject 
  onEdit(index) {
    this.editQuestion = true;
    let editQAObject: any;
    this.objectIndex = index;
    editQAObject = this.qaObjects.filter((val, i) => i === index);
    
    this.questionService._getEditQuestionAndAnswerObject.next(editQAObject);
    this.questionService._getEdit.next(true);
    this.showQuesAnsComponent(true);
  }

  getAnswertypes() {
    this.questionService.getAnswerType().pipe(untilDestroyed(this)).subscribe(data => {
      // this.questionAndAnswersComponent.questionControllerComponent.answerTypes =data;
      this.questionService._getAnswerTypes.next(data);
    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    });
  }


  saveAll() {

    this.surveyQuestionSelection = new SurveyQuestionSelection();
    this.surveyQuestionSelection.questionAndAnswer = this.qaObjects;
    this.surveyQuestionSelection.survey = this.survey;
    this.surveyQuestionSelection.sbdRelation = this.selectedSelectionTypeObject;
    
    this.surveyService.saveSurvey(this.surveyQuestionSelection).pipe(untilDestroyed(this)).subscribe(data => {

      // if(data.savedSurvey.surveyType.name == "real-time-feedback"){
      //   this.savedSurveyName = data.savedSurvey.name;
      //   this.surveyKey = data.key;
      //   this.openModal(this.saveSurveyModal);

      // }
      this.toastr.successToastr("Successfully saved", "Success", { position: "bottom-right", animate: "slideFromBottom" });
    }, err => {
       this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
    })
  }

  // --- for pop up the employee add from
  openModal(template: TemplateRef<any>) {
  
    this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, ignoreBackdropClick: true });
  }

  hideModal() {
    this.modalRef.hide();
    this.router.navigate(['/survey/add'])
  }

  ngOnDestroy() {

  }
  
}
