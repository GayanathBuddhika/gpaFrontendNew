import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeTitleComponent } from './gauge-title.component';

describe('GaugeTitleComponent', () => {
  let component: GaugeTitleComponent;
  let fixture: ComponentFixture<GaugeTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
