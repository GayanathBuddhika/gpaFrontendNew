import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeTitleListComponent } from './gauge-title-list.component';

describe('GaugeTitleListComponent', () => {
  let component: GaugeTitleListComponent;
  let fixture: ComponentFixture<GaugeTitleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeTitleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeTitleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
