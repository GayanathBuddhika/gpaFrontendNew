import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninOnlyLayoutComponent } from './signin-only-layout.component';

describe('SigninOnlyLayoutComponent', () => {
  let component: SigninOnlyLayoutComponent;
  let fixture: ComponentFixture<SigninOnlyLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninOnlyLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninOnlyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
