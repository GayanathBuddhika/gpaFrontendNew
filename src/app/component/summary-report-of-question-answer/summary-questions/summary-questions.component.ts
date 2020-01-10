import { Summary } from './../summary-report-of-question-answer.component';
import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, ViewChild } from '@angular/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SummaryReportOfQuestionAnswerService } from 'src/app/service/summary-report-of-question-answer.service';
@Component({
    selector: 'app-summary-questions',
    templateUrl: './summary-questions.component.html',
    styleUrls: ['./summary-questions.component.css']
})
export class SummaryQuestionsComponent implements OnInit, OnChanges {

    @Input() summaryDataList: any[] = [];

    duplicateSummaryDataList: any[] = []

    constructor(
        private summaryReportOfQuestionAnswerService: SummaryReportOfQuestionAnswerService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes["summaryDataList"].currentValue) {
            this.summaryReportOfQuestionAnswerService._set_summaryDataList(changes["summaryDataList"].currentValue[0]);
            this.duplicateSummaryDataList = this.summaryDataList
        }
    }


    ngOnInit() {
        // let sumQues= document.getElementsByClassName("summ")[0] as HTMLElement;
        // console.log(sumQues)
        // console.log("summaryDataList",this.summaryDataList);
        // this.summaryReportOfQuestionAnswerService._set_summaryDataList(this.summaryDataList[0]);


    }

    onClickQuestion(summary: any) {
        this.summaryReportOfQuestionAnswerService._set_summaryDataList(summary);

    }

    onFilterQuestion(searchterm: string) {

        if (!searchterm) {
            this.duplicateSummaryDataList = this.summaryDataList
        }


        let filteredData = this.summaryDataList.filter(res => {

            return res.summaryReportQAList.question.includes(searchterm)
        })

        this.duplicateSummaryDataList = filteredData;


    }
}
