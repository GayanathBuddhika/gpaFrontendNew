import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyListDropdownComponent } from './company-list-dropdown.component';

describe('CompanyListDropdownComponent', () => {
  let component: CompanyListDropdownComponent;
  let fixture: ComponentFixture<CompanyListDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyListDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyListDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
