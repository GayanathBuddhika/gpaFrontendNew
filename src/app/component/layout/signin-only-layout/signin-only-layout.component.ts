import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin-only-layout',
  templateUrl: './signin-only-layout.component.html',
  styleUrls: ['./signin-only-layout.component.css']
})
export class SigninOnlyLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.dispatchEvent(new Event("resize"));
    //document.body.className = "hold-transition login-page";

}
}
