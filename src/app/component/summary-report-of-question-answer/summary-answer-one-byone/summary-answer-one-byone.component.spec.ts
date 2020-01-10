import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAnswerOneByoneComponent } from './summary-answer-one-byone.component';

describe('SummaryAnswerOneByoneComponent', () => {
  let component: SummaryAnswerOneByoneComponent;
  let fixture: ComponentFixture<SummaryAnswerOneByoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryAnswerOneByoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryAnswerOneByoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
