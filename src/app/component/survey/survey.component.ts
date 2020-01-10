import { DepToBranch } from './../../model/DeptToBranch';
import { Component, OnInit } from '@angular/core';
import { ServeyService } from 'src/app/service/servey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  //assingDepBranch : DepToBranch = localStorage.getItem('currentUser')).assignDeptToBranch;
  constructor(private surveySurvice: ServeyService) { }

  ngOnInit() {


    
  }

}
