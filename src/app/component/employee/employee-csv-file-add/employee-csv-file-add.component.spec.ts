import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCsvFileAddComponent } from './employee-csv-file-add.component';

describe('EmployeeCsvFileAddComponent', () => {
  let component: EmployeeCsvFileAddComponent;
  let fixture: ComponentFixture<EmployeeCsvFileAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeCsvFileAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCsvFileAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
