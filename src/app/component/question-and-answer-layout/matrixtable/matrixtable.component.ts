import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-matrixtable',
  templateUrl: './matrixtable.component.html',
  styleUrls: ['./matrixtable.component.css']
})
export class MatrixtableComponent implements OnInit {
@Input('matrixObject') matrixObject: any;
answer = {
  levels:["level_1","level_2","level_3","level_4","level_5",],
  points:["point_1","point_2","point_3","point_4"]
  };

 
  constructor() { }

  ngOnInit() {
  }

}
