import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryReportOfQuestionAnswerComponent } from './summary-report-of-question-answer.component';

describe('SummaryReportOfQuestionAnswerComponent', () => {
  let component: SummaryReportOfQuestionAnswerComponent;
  let fixture: ComponentFixture<SummaryReportOfQuestionAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryReportOfQuestionAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryReportOfQuestionAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
