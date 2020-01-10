import { AuthService } from 'src/app/core/auth.service';
import { FinalQaServiceService } from './../../../service/final-qa-service.service';
import { PagerService } from './../../../service/pager.service';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/core/src/render3/util';
import { AnswerObject } from './../../../model/answerObject';
import { FinalQuestionComponent } from './../final-question/final-question.component';
import { DatePipe, KeyValuePipe, } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputComponentComponent } from './../../../shared/input-component/input-component.component';


import { FinalQA } from './../../../model/finalQA';
import { Answer } from './../../../model/answer';
import { Question } from './../../../model/question';
import { Component, OnInit, ViewChildren, QueryList, ElementRef, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreferredUrlService } from 'src/app/service/preferred-url.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { RealtimeService } from 'src/app/service/realtime.service';
import { ToastrManager } from 'ng6-toastr-notifications';

import { take } from 'rxjs/operators';
import { StringToJsonObjectPipe } from 'src/app/pipe/string-to-json-object.pipe';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-visible-question-and-answer',
  templateUrl: './visible-question-and-answer.component.html',
  styleUrls: ['./visible-question-and-answer.component.css']
})
export class VisibleQuestionAndAnswerComponent implements OnInit, AfterViewInit, OnDestroy {
  // --- get uuid that come with URL
  uuid: string;
  // --- 
  // questions: Question[];
  // questionx: Question;
  // answers: Answer[] = [];
  // --- get final question-and-answer objects for save 
  finalQAForSave: FinalQA[] = [];

  //startDate: string;
  //endDate: string;
  // --- get current date
  date = new Date();
  // --- this is true if question is required
  isRequiredChecked: boolean = false;

  // groupAnswerByQuestions: any[];
  // --- view submit button when you are in final QA page.
  viewButton: boolean;
  disableInputComponent: boolean = false;
  reSubmitButton: boolean = false;
  // ********************************* get qaObject for test *****************
  data: any;

  modalRef: BsModalRef;
  @ViewChild('realtimeSurvey') realtimeSurvey: TemplateRef<any>


  // viewErrorMassege: boolean= false;
  // --- 
  //@ViewChildren("inputBox") inputBox: QueryList<ElementRef>;
  // --- get list of inputComponent
  @ViewChildren(InputComponentComponent) inputCom: QueryList<InputComponentComponent>;
  // --- get list of FinalQuestionComponent 
  @ViewChildren(FinalQuestionComponent) finalQuestionComponents: QueryList<FinalQuestionComponent>;
  // --- get Main Question-andAnswer object when component start
  questionAndAnswerObject: any[];
  secondQuestionAndAnswerObject: any[];
  // --- get survey name
  surveyName: string;
  // --- pager object
  pager: any = {};

  // --- paged items
  pagedItems: any[];

  viewQaBody: boolean = false;

  // --- when it this is true you can submit final question and answer
  isAlllowToSubmit: boolean = true;
  surveyIdForRealtime: any;
  surveyType: string;

  resubmitbuttonClick : boolean = false;


  constructor(
      private router:Router,
    private authService:AuthService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private pagerService: PagerService,
    private preferredUrlService: PreferredUrlService,
    private stringToJsonPipe: StringToJsonObjectPipe,
    private finalQaSurvice: FinalQaServiceService,
    private modalService: BsModalService,
    private realtimeService: RealtimeService,
    public toastr: ToastrManager,
    private datePipe: DatePipe, private keyValuePipe: KeyValuePipe) { }

  ngOnInit() {
    this.viewQaBody = false;
    this.route.data.subscribe(data => {
      this.surveyType = data.type;
      if (data.type === 'normal') {
        this.uuid = this.route.snapshot.params['uuid'];
        this.getQuestion(this.uuid, this.surveyType);
      } else if (data.type === 'realtime') {
        // --- Not to close the model window by clicking out side or using keyboard
        this.modalRef = this.modalService.show(this.realtimeSurvey, { backdrop: 'static', keyboard: false, ignoreBackdropClick: true })
        this.uuid = this.route.snapshot.params['uuid'];

      }

    })

  }
  ngAfterViewInit(): void {



  }

  onGetSurvey(key) {
    this.realtimeService.getMatchKey(key, this.uuid).subscribe(data => {
      if (!data) {
        this.toastr.errorToastr("The key is incorrect", "Error", { position: "bottom-right", animate: "slideFromBottom" })
      } else {
        this.getQuestion(this.uuid, this.surveyType);
        this.modalRef.hide();

      }
    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" })
    })
  }


  // --- create page with 5 question
  setPage(page: number, next: boolean) {
    // if click next button call onSubmit() methode for validate the page questions  and set finalQa object to the main array
    // else(click previouse button) call this.createAnswerObjectWhenClickPrevious() methode for set finalQa object to the main array and not validate
    if (next) {
      this.onSubmit();
    } else {
      this.createAnswerObjectWhenClickPrevious();
    }

    // --- move to next page if current page correctly fill
    if (this.isAlllowToSubmit) {
      // ---  get oager object return by pagersurveiceS
      this.pager = this.pagerService.getPager(this.questionAndAnswerObject.length, page);

      if (this.pager.currentPage === this.pager.endPage) {
        if (this.resubmitbuttonClick ) {
          this.reSubmitButton = true;
          this.viewButton = false;
        } else {
          this.reSubmitButton = false;
          this.viewButton = true;
      
        }

      } else {
        if (this.viewButton) {
          this.resubmitbuttonClick  = false;
        }
        this.reSubmitButton = false;
        this.viewButton = false;
      }

      // get current page of items
      this.pagedItems = JSON.parse(JSON.stringify(this.questionAndAnswerObject.slice(this.pager.startIndex, this.pager.endIndex + 1)));

    }

  }


  getQuestion(uuid: string, surveyType: string) {

        this.preferredUrlService.getAnswerObjecs(uuid, surveyType).subscribe(data => {

      // --- convert map object to the array 
      this.questionAndAnswerObject = this.keyValuePipe.transform(data)

      // sort the question by there ai number
      this.questionAndAnswerObject = this.questionAndAnswerObject.sort((a, b) => a.value[0].ai - b.value[0].ai);

      let number: number = 0;
      this.questionAndAnswerObject.forEach(object => {
        number += 1;
        // --- create indexNum for number the questions
        object.indexNum = number;
        // ---- create modified variable to identufy question is modified or not
        object.modified = false;
      });

      this.secondQuestionAndAnswerObject = JSON.parse(JSON.stringify(this.questionAndAnswerObject));
      // --- get survey name from QA object
      this.surveyName = this.questionAndAnswerObject[0].value[0].question.survey.name;
      // --- initialize to page 1
      this.setPage(1, false);

      this.viewQaBody = true;

    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    })
  }

  cancelModel(){

    if(this.authService.authenticated()){
        this.modalRef.hide()
        this.router.navigate(['main/surveylist/add']);
    }else{
        this.modalRef.hide()
        this.router.navigate(['/real-time-survey'])
    }
    
  }

  onReSubmit() {
    this.resubmitbuttonClick = false;
    this.disableInputComponent = false;
   // this.pagedItems = [];
    this.questionAndAnswerObject = JSON.parse(JSON.stringify(this.secondQuestionAndAnswerObject));
     // --- initialize to page 1
     this.setPage(1, false);
  }


  onSubmit() {

    const finalQA: FinalQA[] = [];
    // --- when it this is true you can submit final question and answer
    this.isAlllowToSubmit = true;
    // excecute answer object one by one
    this.finalQuestionComponents.forEach(finalQuestionComponent => {
      // --- check that answer is rewuired or not 
      this.isRequiredChecked = false;
      // --- true that answer object has a value
      let answerValue = false;

      // --- execute input field of the answer one by one
      finalQuestionComponent.inputComs.forEach(inputCom => {

        switch (inputCom.question.answersType.type) {

          case "radio":

            var finalQARadio = new FinalQA();
            // --- if that input field has value get it and creat FinalQA object  
            if (inputCom.radio.nativeElement.checked) {
              this.isRequiredChecked = false;
              answerValue = true;
              finalQARadio.answer = inputCom.radio.nativeElement.value;
              finalQARadio.answerId = inputCom.answerObject;
              finalQARadio.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQARadio);
            } else {
              if (finalQuestionComponent.question.required) {
                this.isRequiredChecked = true
              }
            }

            break;

          case "checkBox":
            var finalQACheckbox = new FinalQA();
            // --- if that input field has value get it and creat FinalQA object  
            if (inputCom.checkbox.nativeElement.checked) {
              this.isRequiredChecked = false;
              answerValue = true;
              finalQACheckbox.answer = inputCom.checkbox.nativeElement.value;
              finalQACheckbox.answerId = inputCom.answerObject;
              finalQACheckbox.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQACheckbox);
            } else {
              if (finalQuestionComponent.question.required) {
                this.isRequiredChecked = true
              }
            }

            break;

          case "inputBox":
            // --- if that input field has value get it and creat FinalQA object  
            if (!(inputCom.inputbox.nativeElement.value === "")) {
              var finalQAInputbox = new FinalQA();
              this.isRequiredChecked = false;
              answerValue = true;
              finalQAInputbox.answer = inputCom.inputbox.nativeElement.value;
              finalQAInputbox.answerId = inputCom.answerObject;
              finalQAInputbox.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQAInputbox);
            } else {
              if (finalQuestionComponent.question.required) {
                this.isRequiredChecked = true;
              }

            }

            break;

          case "textArea":
            // --- if that input field has value get it and creat FinalQA object           
            if (!(inputCom.textarea.nativeElement.value === "")) {
              var finalQAtextArea = new FinalQA();
              this.isRequiredChecked = false;
              answerValue = true;
              finalQAtextArea.answer = inputCom.textarea.nativeElement.value;
              finalQAtextArea.answerId = inputCom.answerObject;
              finalQAtextArea.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQAtextArea);
            } else {
              if (finalQuestionComponent.question.required) {
                this.isRequiredChecked = true;
              }
            }

            break;

          case "singalDate":
            // --- if that input field has value get it and creat FinalQA object                           
            if (!(inputCom.singaldate.nativeElement.value === "")) {
              var finalQAsingleDate = new FinalQA();
              this.isRequiredChecked = false;
              answerValue = true;

              //inputCom.answerObject.date = this.datePipe.transform(inputCom.singaldate.value,"yyyy-MM-dd hh:mm:ss");
              // finalQAsingleDate.answer ="["+JSON.stringify(JSON.parse(JSON.stringify(inputCom.answerObject)))+"]";

              //finalQAsingleDate.answer = inputCom.singaldate.inputFieldValue;
              finalQAsingleDate.answer = inputCom.singaldate.nativeElement.value;
              finalQAsingleDate.answerId = inputCom.answerObject;
              finalQAsingleDate.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss");
              finalQA.push(finalQAsingleDate);
            } else {
              if (finalQuestionComponent.question.required) {
                this.isRequiredChecked = true;            
              }

            }

            break;

          case "dateRange":
            // --- if that input field has value get it and creat FinalQA object  
            if (!(inputCom.startDate.inputFieldValue === "" || inputCom.endDate.inputFieldValue === "")) {
              var finalQADaterange = new FinalQA();
              var answerobject = new AnswerObject();
              this.isRequiredChecked = false;
              answerValue = true;
              answerobject.startDate = this.datePipe.transform(inputCom.startDate.value, "yyyy-MM-dd hh:mm:ss");
              answerobject.endDate = this.datePipe.transform(inputCom.endDate.value, "yyyy-MM-dd hh:mm:ss");
              finalQADaterange.answer = "[" + JSON.stringify(JSON.parse(JSON.stringify(answerobject))) + "]";
              finalQADaterange.answerId = inputCom.answerObject;
              finalQADaterange.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQADaterange);
            } else {
              if (finalQuestionComponent.question.required) {
                this.isRequiredChecked = true;
              }
            }

            break;

          case "rating":
            // --- if that input field has value get it and creat FinalQA object  
            if (inputCom.rate) {
              this.isRequiredChecked = false;
              answerValue = true;
              var finalQARating = new FinalQA();
              finalQARating.answer = inputCom.rate;
              finalQARating.answerId = inputCom.answerObject;
              finalQARating.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQARating);
            } else {
              if (finalQuestionComponent.question.required) {
                this.isRequiredChecked = true;
              }

            }
            break;

        } // <----- end switch case -------->

      });// <--------- innerforeach end ------------>


      // --- check if required field has not answer
      // --- true -> viewErrorMsg variable in finalQuestionComponent
      // --- false  ->isAlllowToSubmit    
      if (!answerValue && this.isRequiredChecked) {
        finalQuestionComponent.viewErrorMsg = true;
        this.isAlllowToSubmit = false;        
      } else {
        finalQuestionComponent.viewErrorMsg = false;       

      }
    });// <----------------main foreach end ------------>

    // --- if isAlllowToSubmit is false,
    // --- stope submit
    if (!this.isAlllowToSubmit) {
      this.isRequiredChecked = false;
      return;

    }

    // --- set finalQA to the main question-and-answer object  
    this.setfinalAnswerToMainQAarray(finalQA);


    this.finalQuestionComponents = null;
    this.inputCom = null;
    // --- save function is run when you in the final QA page
    if (this.viewButton) {
      this.saveQuestion();
    }

  }

  saveQuestion() {
    this.disableInputComponent = true;
    this.reSubmitButton = true;
    this.resubmitbuttonClick  = true;
    this.viewButton = false;
    // crete finalQA answere array 
    // that array has only filled question and answer
    this.questionAndAnswerObject.forEach(answer => {
      if (answer.modified) {
        answer.createdAnswer.forEach(finalAnswer => {
          this.finalQAForSave.push(finalAnswer);
        });
      }

    });
      // save final answer object
      this.finalQaSurvice.saveFinalQuestionAndAnswer(this.finalQAForSave).pipe(untilDestroyed(this)).subscribe(data => {
    }, err => {
      console.log(err);
    });  

    this.finalQAForSave = [];

  }



  setfinalAnswerToMainQAarray(finalAnswerObject: FinalQA[]) {

    this.questionAndAnswerObject.forEach(qaObject => {
      const answerArray: FinalQA[] = [];
      let unique: boolean = false;
      // --- set filled answer to paticular question as a array
      // ---  if user filled answer of question noties that question is modified == true
      finalAnswerObject.forEach(answer => {
        if (answer.answerId.question.id === qaObject.key) {
          unique = true;
          answerArray.push(answer);
          qaObject.modified = true;
        }
      });

      if (unique) {
        qaObject.createdAnswer = answerArray;
      }

    });

  }
  // --- create finalQA object when click the previous button
  createAnswerObjectWhenClickPrevious() {
    const finalQA: FinalQA[] = [];

    // excecute answer object one by one
    this.finalQuestionComponents.forEach(finalQuestionComponent => {

      // --- execute input field of the answer one by one
      finalQuestionComponent.inputComs.forEach(inputCom => {

        switch (inputCom.question.answersType.type) {

          case "radio":

            var finalQARadio = new FinalQA();
            // --- if that input field has value get it and creat FinalQA object  
            if (inputCom.radio.nativeElement.checked) {
              finalQARadio.answer = inputCom.radio.nativeElement.value;
              finalQARadio.answerId = inputCom.answerObject;
              finalQARadio.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQARadio);

            }

            break;

          case "checkBox":
            var finalQACheckbox = new FinalQA();
            // --- if that input field has value get it and creat FinalQA object  
            if (inputCom.checkbox.nativeElement.checked) {
              finalQACheckbox.answer = inputCom.checkbox.nativeElement.value;
              finalQACheckbox.answerId = inputCom.answerObject;
              finalQACheckbox.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQACheckbox);
            }

            break;

          case "inputBox":
            // --- if that input field has value get it and creat FinalQA object  
            if (!(inputCom.inputbox.nativeElement.value === "")) {
              var finalQAInputbox = new FinalQA();
              finalQAInputbox.answer = inputCom.inputbox.nativeElement.value;
              finalQAInputbox.answerId = inputCom.answerObject;
              finalQAInputbox.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQAInputbox);
            }

            break;

          case "textArea":
            // --- if that input field has value get it and creat FinalQA object           
            if (!(inputCom.textarea.nativeElement.value === "")) {
              var finalQAtextArea = new FinalQA();
              finalQAtextArea.answer = inputCom.textarea.nativeElement.value;
              finalQAtextArea.answerId = inputCom.answerObject;
              finalQAtextArea.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQAtextArea);
            }

            break;

          case "singalDate":
            // --- if that input field has value get it and creat FinalQA object                     
            if (!(inputCom.singaldate.inputFieldValue === "")) {
              var finalQAsingleDate = new FinalQA();
              finalQAsingleDate.answer = inputCom.singaldate.nativeElement.value;
              finalQAsingleDate.answerId = inputCom.answerObject;
              finalQAsingleDate.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss");
              finalQA.push(finalQAsingleDate);
            }

            break;

          case "dateRange":
            // --- if that input field has value get it and creat FinalQA object  
            if (!(inputCom.startDate.inputFieldValue === "" || inputCom.endDate.inputFieldValue === "")) {
              var finalQADaterange = new FinalQA();
              var answerobject = new AnswerObject()
              this.isRequiredChecked = false;
              // answerValue = true;
              answerobject.startDate = this.datePipe.transform(inputCom.startDate.value, "yyyy-MM-dd hh:mm:ss");
              answerobject.endDate = this.datePipe.transform(inputCom.endDate.value, "yyyy-MM-dd hh:mm:ss");
              finalQADaterange.answer = "[" + JSON.stringify(JSON.parse(JSON.stringify(answerobject))) + "]";
              finalQADaterange.answerId = inputCom.answerObject;
              finalQADaterange.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQADaterange);
            } else {
              if (finalQuestionComponent.question.required) {
                this.isRequiredChecked = true
              }

            }
            break;
          case "rating":
            // --- if that input field has value get it and creat FinalQA object  
            if (inputCom.rate) {
              var finalQARating = new FinalQA();
              finalQARating.answer = inputCom.rate;
              finalQARating.answerId = inputCom.answerObject;
              finalQARating.dateTime = this.datePipe.transform(this.date, "yyyy-MM-dd hh:mm:ss")
              finalQA.push(finalQARating);
            }

            break;

        } // < --------- end switch ----------->


      });// <-----------------innerforeach end ------------>
      if (!this.reSubmitButton) {
        this.setfinalAnswerToMainQAarray(finalQA);
      }


    });// <----------- main foreach end --------------->
  }

  ngOnDestroy() {

  }
}





