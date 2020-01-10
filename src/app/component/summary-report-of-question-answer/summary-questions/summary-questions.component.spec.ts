import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryQuestionsComponent } from './summary-questions.component';

describe('SummaryQuestionsComponent', () => {
  let component: SummaryQuestionsComponent;
  let fixture: ComponentFixture<SummaryQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
