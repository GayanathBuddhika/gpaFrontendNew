import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchDepartmentConstructionComponent } from './branch-department-construction.component';

describe('BranchDepartmentConstructionComponent', () => {
  let component: BranchDepartmentConstructionComponent;
  let fixture: ComponentFixture<BranchDepartmentConstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchDepartmentConstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchDepartmentConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
