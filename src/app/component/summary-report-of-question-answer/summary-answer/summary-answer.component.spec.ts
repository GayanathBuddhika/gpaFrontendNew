import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAnswerComponent } from './summary-answer.component';

describe('SummaryAnswerComponent', () => {
  let component: SummaryAnswerComponent;
  let fixture: ComponentFixture<SummaryAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
