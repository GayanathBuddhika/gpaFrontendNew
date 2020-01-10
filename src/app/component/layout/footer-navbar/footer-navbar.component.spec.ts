import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterNavbarComponent } from './footer-navbar.component';

describe('FooterNavbarComponent', () => {
  let component: FooterNavbarComponent;
  let fixture: ComponentFixture<FooterNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
