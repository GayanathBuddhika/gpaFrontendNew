import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleQuestionAndAnswerComponent } from './visible-question-and-answer.component';

describe('VisibleQuestionAndAnswerComponent', () => {
  let component: VisibleQuestionAndAnswerComponent;
  let fixture: ComponentFixture<VisibleQuestionAndAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibleQuestionAndAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleQuestionAndAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
