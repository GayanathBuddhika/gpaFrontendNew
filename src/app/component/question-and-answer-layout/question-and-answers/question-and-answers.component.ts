import { InputComponentComponent } from '../../../shared/input-component/input-component.component';
import { AnswerObject } from './../../../model/answerObject';
import { AnswersType } from './../../../model/answersType';
import { QuestionControllerComponent } from './question-controller/question-controller.component';
import { Component, OnInit, ViewChildren, ViewChild, QueryList, ElementRef, Output, EventEmitter, AfterViewInit, SimpleChanges, AfterViewChecked, OnChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { QuestionService } from 'src/app/service/question.service';
import { v4 as uuid } from 'uuid';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-question-and-answers',
  templateUrl: './question-and-answers.component.html',
  styleUrls: ['./question-and-answers.component.css']
})
export class QuestionAndAnswersComponent implements OnInit, AfterViewInit,OnDestroy{


  // --- Preview question and answer in QuestionAndAnswerLayoutComponent
  @Output() viewQuestion = new EventEmitter<boolean>();

  // --- send QuestionAnswer object to the QuestionAndAnswerLayoutComponent
  @Output() rerunQA = new EventEmitter<any>();

  edit = false;

  // --- get whole edit object 
  editQuestionObject: any;

  // --- get answers of the edit object 
  editAnswers: AnswerObject[] = []

  // --- visible radio-component in question-and-answer-component
  radio = false;

  // --- visible checkBox-component in question-and-answer-component
  checkbox = false;

  // // ---Get values from question-controller-component(child) to question-and-answer-component(parent) 
  // @ViewChildren(QuestionControllerComponent) questionController: QueryList<QuestionControllerComponent>;

  // ---Get values from question-controller-component(child) to question-and-answer-component(parent) 
  @ViewChild(QuestionControllerComponent) questionControllerComponent: QuestionControllerComponent;

  @ViewChild(InputComponentComponent) inputComponentComponent: InputComponentComponent;

  @ViewChildren("typedAnswer") answer: QueryList<ElementRef>;


  // --- For matrix, not implemented yet
  @ViewChildren("level") level: QueryList<ElementRef>;

    // --- For matrix, not implemented yet
  @ViewChildren("point") point: QueryList<ElementRef>;


  // --- this is use to fill "addAnswerRows" array. Increasing one by one
  answerArrayIndex: number = 0;

  // --- this is use to manage answer rows
  addAnswerRows = [];

  // --- get answers 
  answers: string[] = [];

  // --- get question 
  question: string;

  // --- this is "true" after select the Answertype
  // --- when this is true , view the question and answer edit form
  viewAnswerRowAddButton = false;

  viewAddButton = false;

  // --- get the answerType selected from the questionControllerComponent 
  answerType: AnswersType;

  // --- get QuestionAndAnswer object, if is not edit
  questionAndAnswer: any;

  // --- disable when dropdown selected
  qTypeDisable: boolean;

  required = false;

  disableAdd = false;

  answerObject: AnswerObject[] = [];

  answerRemoveButton: boolean;

  reciveQuestionType = true;



  // formatrix question and answers 
  addLevelRows = [];
  addPointRows = [];
  editLevels = [];
  editPoints = [];
  matrixAnswer = {
    points: [],
    levels: []
  }
  viewmatrix = false;
  validInput = false;
  viewmassege = false;

  // differ: KeyValueDiffer<string, any>;

  constructor(
    private questionService: QuestionService, private cdRef: ChangeDetectorRef

  ) { }

  ngOnInit() {

    this.questionService._getEdit.pipe(untilDestroyed(this)).subscribe(data => {
      this.edit = data;

    });



    // --- get edit object form the behaviorSubject
    if (this.edit) {

      this.questionService.edit_QuestionAndAnswerObject_$().pipe(untilDestroyed(this)).subscribe(data => {
      
        if (data.length != 0) {
          // --- get edit object
          this.editQuestionObject = data[0];
          // --- get edit answers 
          this.editAnswers = this.editQuestionObject.answerList;

          if (this.editQuestionObject.answerType.type === "matrixTable") {
            this.editLevels = this.editQuestionObject.answerList.levels;
            this.editPoints = this.editQuestionObject.answerList.points;
            this.editQuestionObject.answerList.levels.forEach(element => {
              this.answerArrayIndex = this.answerArrayIndex + 1;
              this.addLevelRows.push(this.answerArrayIndex);
            });
            this.editQuestionObject.answerList.points.forEach(element => {
              this.answerArrayIndex = this.answerArrayIndex + 1;
              this.addPointRows.push(this.answerArrayIndex);
            });


          } else {
            this.editQuestionObject.answerList.forEach(element => {
              this.answerArrayIndex = this.answerArrayIndex + 1;
              // --- create addAnswerRow array for the edit object answers
              this.addAnswerRows.push(this.answerArrayIndex);
            });
          }


        }

      });

    }

  }


  ngAfterViewInit(): void {
    if (this.edit) {
      if (this.editQuestionObject.answerType.type === "matrixTable") {

        this.level.forEach((element, i) => {
          element.nativeElement.value = this.editLevels[i];
        });
        this.point.forEach((element, i) => {
          element.nativeElement.value = this.editPoints[i];
        });

      } else {

        // --- set the answers to the each answer input 
        this.answer.forEach((element, i) => {
          switch (this.editQuestionObject.answerType.type) {

            case "dateRange":
              this.inputComponentComponent.start.nativeElement.value = this.editAnswers[i].startDate
              this.inputComponentComponent.end.nativeElement.value = this.editAnswers[i].endDate;
             
              break;
            case "radio":
            case "checkBox":
            case "inputBox":
            case "textArea":             
              element.nativeElement.value = this.editAnswers[i].value;
              break;
            case "singalDate":
              element.nativeElement.value = this.editAnswers[i].date;
              break;
            case "rating":
              element.nativeElement.value = this.editAnswers[i].rangeValue;
              break;



          }
          //element.nativeElement.value = this.editAnswers[i].value;
          // console.log("answer object", JSON.parse(this.editAnswers[i]).value);
        });

      }
    }
  }

  // ---Get answer type from question-controller-component(child) 
  receiveAnswerType($event) {

    // --- remove question contend when change the question type   
    if (this.edit && this.reciveQuestionType) { } 
    else {
      this.addAnswerRows = [];
      this.answer.forEach(element => {
        if (this.answerType.type === 'dateRange') {
          this.inputComponentComponent.start.nativeElement.value = null;
          this.inputComponentComponent.end.nativeElement.value = null;

        } else {
          element.nativeElement.value = null;
        }

      })
    }
    this.reciveQuestionType = false;
    this.viewAddButton = true;
    this.answerType = $event;
    if (this.answerType.type === "matrixTable") {
      this.viewmatrix = true;
    } else {
      this.viewmatrix = false;
    }

    if (this.answerType.type === 'dateRange' || this.answerType.type === "singalDate" ||
      this.answerType.type === "rating" || this.answerType.type === "matrixTable") {

      this.viewAnswerRowAddButton = false;


    } else {
      this.viewAnswerRowAddButton = true;
    }
    if (this.addAnswerRows.length < 1) {
     
      this.addAnswerRows.push(0);
    }
    if (this.addLevelRows.length < 1) {
      this.addLevelRows.push(0);
    }
    if (this.addPointRows.length < 1) {
      this.addPointRows.push(0);
    }
    this.answerRemoveButton = this.addAnswerRows.length === 1 ? false : true;

  }

  // --- this is for the drag and drop function for the answers array
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.addAnswerRows, event.previousIndex, event.currentIndex);
  }

  // --- increase addAnswerRows array when click the + mark
  onAddAnswer() {

    this.answerArrayIndex = this.answerArrayIndex + 1;

    // --- stop the add answerrows when there are have enpty input 
    let keepGoing = true;
    this.answer.forEach(f => {
      if (keepGoing && this.addAnswerRows.length > 0 && f.nativeElement.value === "") {        
          keepGoing = false;       
      }
    })

    if (!keepGoing) return;

    this.addAnswerRows.push(this.answerArrayIndex);
    // if (this.addAnswerRows.length != 0) {
    //   this.qTypeDisable = true;
    // }
    this.answerRemoveButton = this.addAnswerRows.length === 1 ? false : true;


  }

  // --- remove answer when click the - mark
  onRemoveAnswer(number) {
    // this.answerRemoveButton = this.addAnswerRows.length == 1?false:true;
    this.addAnswerRows = this.addAnswerRows.filter((val, i) => i !== number);
    this.answers = this.answers.filter((val, i) => i !== number);

    // if (this.addAnswerRows.length == 0) {
    //   this.qTypeDisable = false;
    //   console.log("dropdown disable in aq com", this.qTypeDisable);
    // }
    this.answerRemoveButton = this.addAnswerRows.length == 1 ? false : true;
  }


  onAdd() {

    // ---get The Question
    this.question = this.questionControllerComponent.question;

    if (this.answerType.type !== "matrixTable") {
   
      switch (this.answerType.type) {

        case "dateRange":

          if (this.inputComponentComponent.start.nativeElement.value === "" || this.inputComponentComponent.end.nativeElement.value === "") {
            this.viewmassege = true;
            this.answerObject = [];
           
            return;

          }
          const dateRange = new AnswerObject();
          // const ansObjectend = new AnswerObject();
          dateRange.startDate = this.inputComponentComponent.start.nativeElement.value;
          dateRange.endDate = this.inputComponentComponent.end.nativeElement.value;
          this.answerObject.push(dateRange);
          ///  this.answerObject.push(ansObjectend);
        
          break;
        case "radio":
        case "checkBox":
          var keepGoing = true;
          // ---AnswersArry
          this.answer.forEach((element) => {
            if (keepGoing && !element.nativeElement.validity.valid) {
              this.viewmassege = true;
              keepGoing = false;
            }
            // --- create answer object if answertype radio or checkBox              
            const ansObject = new AnswerObject();
            ansObject.value = element.nativeElement.value;
            ansObject.id = uuid();
            this.answerObject.push(ansObject);

          });
          if (!keepGoing) {
            this.answerObject = [];
            return;
          }
          break;

        case "inputBox":
        case "textArea":
          var keepGoing = true;
          // ---AnswersArry
          this.answer.forEach((element) => {
            // if (keepGoing && !element.nativeElement.validity.valid) {
            //   this.viewmassege = true;
            //   keepGoing = false;
            // }                  
            // --- create answer object if answertype  inputBox                 
            const ansObject = new AnswerObject();
            ansObject.value = element.nativeElement.value;
            this.answerObject.push(ansObject);

          });
          if (!keepGoing) {
            this.answerObject = [];
            return;
          }
          break;

          //   (- -)
          // \/  | \/
        case "singalDate":
          var keepGoing = true;
          // ---AnswersArry
          this.answer.forEach((element) => {
            // if (keepGoing && !element.nativeElement.validity.valid) {
            //   this.viewmassege = true;
            //   keepGoing = false;
            // }                  
            // --- create answer object if answertype  inputBox                 
            const ansObject = new AnswerObject();
            ansObject.date = element.nativeElement.value;
            this.answerObject.push(ansObject);

          });
          if (!keepGoing) {
            this.answerObject = [];
            return;
          }
          break;
        case "rating":
          var keepGoing = true;
          // ---AnswersArry
          this.answer.forEach((element) => {
            // if (keepGoing && !element.nativeElement.validity.valid) {
            //   this.viewmassege = true;
            //   keepGoing = false;
            // }                  
            // --- create answer object if answertype  inputBox                 
            const ansObject = new AnswerObject();
            ansObject.rangeValue = element.nativeElement.value;
            this.answerObject.push(ansObject);

          });
          if (!keepGoing) {
            this.answerObject = [];
            return;
          }
          break;







      }

      if (!this.question) {
        this.viewmassege = true;
        return;
      }



    } else {

      this.level.forEach((element) => {
        this.matrixAnswer.levels.push(element.nativeElement.value);
      });

      this.point.forEach((element) => {
        this.matrixAnswer.points.push(element.nativeElement.value);
      });


    
    }

    if (this.edit) {

      this.editQuestionObject.question = this.question;
      this.editQuestionObject.answerType = this.answerType;
      if (this.answerType.type !== "matrixTable") {
        this.editQuestionObject.answerList = this.answerObject;
      } else {
        this.editQuestionObject.answerList = this.matrixAnswer;
      }
      this.editQuestionObject.required = this.required;
      this.questionService._setEditedObject.next(this.editQuestionObject);
    } else {
      if (this.answerType.type !== "matrixTable") {
        this.questionAndAnswer = {
          question: this.question,
          answerType: this.answerType,
          answerList: this.answerObject,
          required: this.required,
          index: null
        };

      } else {
        this.questionAndAnswer = {
          question: this.question,
          answerType: this.answerType,
          answerList: this.matrixAnswer,
          required: this.required,
          index: null
        };

      }

      this.rerunQA.emit(this.questionAndAnswer);
    }

    this.viewAnswerRowAddButton = false;
    this.viewQuestion.emit(false);

  }

  onReSet() {
    this.questionControllerComponent.question = null;
    this.questionControllerComponent.editAnswertype = null;
    this.answer.forEach(element => {
      if (this.answerType.type === 'dateRange') {
        this.inputComponentComponent.start.nativeElement.value = null;
        this.inputComponentComponent.end.nativeElement.value = null;

      } else {
        element.nativeElement.value = null;
      }
    })
    this.addAnswerRows = [];


  }

  onCancel() {
    this.viewQuestion.emit(false);
  }

  // --- matrix table -----------

  // -- levels
  onAddLevels() {
    this.answerArrayIndex = this.answerArrayIndex + 1;
    this.addLevelRows.push(this.answerArrayIndex);
  }
  onRemoveLevel(number) {
    this.addLevelRows = this.addLevelRows.filter((val, i) => i !== number);
    this.matrixAnswer.levels = this.matrixAnswer.levels.filter((val, i) => i != number);
  }
  dropForLevels(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.addLevelRows, event.previousIndex, event.currentIndex);
  }

  // --- points
  onAddPoints() {
    this.answerArrayIndex = this.answerArrayIndex + 1;
    this.addPointRows.push(this.answerArrayIndex);
  }
  onRemovePoint(number) {
    this.addPointRows = this.addPointRows.filter((val, i) => i !== number);
    this.matrixAnswer.points = this.matrixAnswer.points.filter((val, i) => i != number);
  }
  dropForPoints(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.addPointRows, event.previousIndex, event.currentIndex);
  }


  ngOnDestroy() {

  }
}
