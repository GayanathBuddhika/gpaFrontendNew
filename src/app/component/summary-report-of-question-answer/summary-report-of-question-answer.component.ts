import { KeyValuePipe } from '@angular/common';
import { Survey } from 'src/app/model/survey';
import { SummaryReportQuestionAnswer } from './../../model/summaryReportQuestionAnswer';
import { SummaryReportOfQuestionAnswerService } from './../../service/summary-report-of-question-answer.service';
import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ServeyService } from 'src/app/service/servey.service';
import { TouchSequence } from 'selenium-webdriver';
import { switchMap, tap } from 'rxjs/operators';


@Component({
    selector: 'app-summary-report-of-question-answer',
    templateUrl: './summary-report-of-question-answer.component.html',
    styleUrls: ['./summary-report-of-question-answer.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SummaryReportOfQuestionAnswerComponent implements OnInit {

    summaryReportQAList: SummaryReportQuestionAnswer[] = [];

    // --- for pagination, get total records
    private totalRecords: number = 0;

    // --- ChartData and DataSet are used for Chrt.js, So additoin details will go to summary class
    chartData: ChartData;
    dataSets: DataSet;
    summary: Summary;

    surveyId = "265fba27-5ced-4e17-a450-efa37f7ecd91"

    mapQuestionAnswers: any;
    summaryDataList: any[] = [];
    options: any;
    question: string;

    surveyList: Survey[];
    viewButtonOneByOne: boolean = false;

    selectedSurvey: Survey;
    // get all answers that map by uuid
    allAnswersMapByUuid: any[] = [];
    // get all answers of the survey
    answers: any[];

    viewOneByOne: boolean = false;

    // --- rowsPerPage at init
    private rowsPerPage: number = 10;

    screenHeight:any;
    screenWidth:any;


    constructor(
        private surveyService: ServeyService,
        private keyValuePipe: KeyValuePipe,
        private summaryReportofQuesAndAnsService: SummaryReportOfQuestionAnswerService,
        public toastr: ToastrManager) {
        this.options = {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100
                    }
                }]
            }
        };

        this.getScreenSize();


    }

    ngOnInit() {
        this.getAllSurveyOfAssingDepToBranchId();
        // const assingDepToBranchId : string = localStorage.getItem('currentUser'))).assignDeptToBranch.
        // this.getSummaryDataOfSurvey("9ad81de5-26d1-452e-937e-530f06c3ba8f",this.totalRecords,this.rowsPerPage);
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight-110+'px';
          this.screenWidth = window.innerWidth-110+'px';
        
         
    }

    getAllSurveyOfAssingDepToBranchId() {

        const assingDepToBranchId = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.id;
        this.surveyService.getAllSurveysOfAssingDEpToBranchId(assingDepToBranchId).subscribe(data => {
         
            this.surveyList = data;
        }, err => {
            this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
        });
    }

    onSelectedSurvey(survey: Survey) {
        this.summaryDataList = [];
        this.answers = [];
        this.allAnswersMapByUuid = [];
        this.viewOneByOne = false;
        this.viewButtonOneByOne = false; 
        this.selectedSurvey = survey;
        this.getSummaryDataOfSurvey(survey.id);
    }

    // --- Get the summary of survey, parameters - SurveyId, Index of new page, Numbers of rows to display in new page
    getSummaryDataOfSurvey(surveyId: string) {
      
        this.summaryReportofQuesAndAnsService.getSummaryData(surveyId).subscribe(res => {
          
            this.summaryReportQAList = res;
           // this.totalRecords = res['totalElements']

            // --- arrage all data to show in summary
            // this.summaryData = [];

            this.summaryReportQAList.sort((a, b) => a.ai - b.ai)
            this.summaryReportQAList.forEach(data => {
                this.summary = new Summary();
                this.chartData = new ChartData();
                this.dataSets = new DataSet();

                const jsonAnswers = JSON.parse(JSON.stringify(JSON.parse(data.answers)))
                data.answers = jsonAnswers;

                jsonAnswers.forEach(ans => {
                    // --- Get the answers and push to lables of ChartData class
                    this.chartData.labels.push(ans.answer)
                    // --- First set the data in DataSet class
                    this.dataSets.backgroundColor = '#42A5F5';
                    this.dataSets.borderColor = '#1E88E5';

                    this.dataSets.data.push(ans.count * 100 / data.totalSubmission)
                    // --- Then set the array to Dataset class of  ChartData class
                    this.chartData.datasets.push(this.dataSets);
               
                });


                this.summary.summaryReportQAList = data;
                this.summary.chartData = this.chartData;
                this.summaryDataList.push(this.summary);

              

                //  console.log("Summary ",JSON.stringify(this.summaryDataList));
            });
        }, err => {
            this.toastr.errorToastr(err, "Error", { position: "bottom-right", animate: "slideFromBottom" })
        })
    }

    //   setPage(i, event:any){
    //       event.preventDefault()
    //       this.page=i;
    //       this.getSummaryDataOfSurvey("df25305c-85f5-4412-b0fb-c31af9d5683e",this.page)
    //   }

    filterData(dateTime) {
       
        const filterList = this.summaryDataList.filter(res => { return res.summaryReportQAList.dateTime === dateTime })
        this.summaryDataList = filterList;

    }

   
    changeReportView(value: boolean) {
        this.viewButtonOneByOne = value;
        if (value) {
              if(this.allAnswersMapByUuid.length === 0){
                const answerObserver = this.summaryReportofQuesAndAnsService.getAllAnswersOfSurvey(this.selectedSurvey.id);
                const finalAnswerObserver = this.summaryReportofQuesAndAnsService.getAllFinalAnswersOfSurvey(this.selectedSurvey.id);
                answerObserver.pipe(switchMap(answers => {
                    return finalAnswerObserver.pipe(tap(finalAnswers => {
                        
                        this.answers = answers;
                        this.allAnswersMapByUuid = this.keyValuePipe.transform(finalAnswers);
                        this.viewOneByOne = true;

                                
                    }))
                })).subscribe()
    
    
              }else{
                this.viewOneByOne = true;

              }
              
  
        } else {
            this.viewOneByOne = false;
        }

    }



}

export class Summary {
    chartData: ChartData;
    summaryReportQAList: SummaryReportQuestionAnswer;
}

export class ChartData {
    labels: string[] = [];
    datasets: DataSet[] = [];
}

export class DataSet {
    data: any[] = []
    label?: string;
    backgroundColor?: string;
    borderColor?: string;
    constructor() { }
}