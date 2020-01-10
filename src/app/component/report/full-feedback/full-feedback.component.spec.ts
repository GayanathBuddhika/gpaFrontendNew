import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullFeedbackComponent } from './full-feedback.component';

describe('FullFeedbackComponent', () => {
  let component: FullFeedbackComponent;
  let fixture: ComponentFixture<FullFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
