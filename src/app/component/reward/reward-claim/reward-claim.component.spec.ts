import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardClaimComponent } from './reward-claim.component';

describe('RewardClaimComponent', () => {
  let component: RewardClaimComponent;
  let fixture: ComponentFixture<RewardClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
