import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAndAnswerLayoutComponent } from './question-and-answer-layout.component';

describe('QuestionAndAnswerLayoutComponent', () => {
  let component: QuestionAndAnswerLayoutComponent;
  let fixture: ComponentFixture<QuestionAndAnswerLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAndAnswerLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAndAnswerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
