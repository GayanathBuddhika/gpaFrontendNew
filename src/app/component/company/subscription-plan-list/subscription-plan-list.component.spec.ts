import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanListComponent } from './subscription-plan-list.component';

describe('SubscriptionPlanListComponent', () => {
  let component: SubscriptionPlanListComponent;
  let fixture: ComponentFixture<SubscriptionPlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionPlanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
