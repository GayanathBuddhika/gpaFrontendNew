import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideNavbarComponent } from './aside-navbar.component';

describe('AsideNavbarComponent', () => {
  let component: AsideNavbarComponent;
  let fixture: ComponentFixture<AsideNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
