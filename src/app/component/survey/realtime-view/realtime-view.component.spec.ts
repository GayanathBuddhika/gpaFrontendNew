import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeViewComponent } from './realtime-view.component';

describe('RealtimeViewComponent', () => {
  let component: RealtimeViewComponent;
  let fixture: ComponentFixture<RealtimeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtimeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
