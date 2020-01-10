import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeSurveyComponent } from './gauge-survey.component';

describe('GaugeSurveyComponent', () => {
  let component: GaugeSurveyComponent;
  let fixture: ComponentFixture<GaugeSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
