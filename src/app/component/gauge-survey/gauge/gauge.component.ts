import { Component, OnInit ,ViewEncapsulation, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GaugeTitleWeightedAvg } from 'src/app/model/GaugeTitleWeightedAvg';
import { AngularFireStorage } from 'angularfire2/storage';
@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css'],
   encapsulation: ViewEncapsulation.None
})
export class GaugeComponent implements OnInit,OnChanges {
   
  // --------------------------------prevev gauge--------------------------------------
  @Input() gaugeTitle:any;
  @Input() colorWhiteLable:string;
  @Input() colorSurveyName:string;
  @Input() colorTitle:string;
  @Input() background:string;
  @Input() surveyName:string;
  @Input() whiteLabel:string;
  
  viewGaugeTitle:any;
  titleColor:string;

  whightLableColor:string;
  whiteLabelName:string;

  surveyNameColor:string;
  nameOfSurvey:string;
  backgroundColor:string;
 

  firestoreImageURL=''


  // --------------------------------real gauge--------------------------------------
  @Input() gaugeTitleWeightedAvg:GaugeTitleWeightedAvg;

  // ---get previous rated value for gauge
  @Input() gaugeTitleIdRatedVal:any;
  //@Input() index:number;
  
  val: number =50;
  feedback:string;
  
  constructor(private afStorage: AngularFireStorage,) { }

  ngOnInit() {
   
  }

  setVal(val:number){
    this.val=val;
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    // --------------------------------real gauge--------------------------------------
    if(changes["gaugeTitleWeightedAvg"]){
      
      if ( this.gaugeTitleWeightedAvg && this.gaugeTitleWeightedAvg.gaugeTitle.imageType === "image") {
        this.afStorage.ref(`gauge-images/${this.gaugeTitleWeightedAvg.gaugeTitle.image}`).getDownloadURL().subscribe(res=>{
          this.firestoreImageURL =res
         
       });
      
       
     }
        
    }

    // --------------------------------review gauge--------------------------------------
    if(changes['gaugeTitle']){
      this.viewGaugeTitle=changes['gaugeTitle'].currentValue;

      if (this.viewGaugeTitle && this.viewGaugeTitle.imageType === "image") {
        this.afStorage.ref(`gauge-images/${this.viewGaugeTitle.image}`).getDownloadURL().subscribe(res=>{
          this.firestoreImageURL =res
         
       });

      }
      
    }if(changes['colorWhiteLable']){
      this.whightLableColor =changes['colorWhiteLable'].currentValue;
     
    }if(changes['colorSurveyName']){
      this.surveyNameColor=changes['colorSurveyName'].currentValue;
      
    }if(changes['colorTitle']){
      this.titleColor=changes['colorTitle'].currentValue;
   
    }if(changes['background']){
      this.backgroundColor=changes['background'].currentValue;
      
    }if(changes['surveyName']){
      this.nameOfSurvey=changes['surveyName'].currentValue;
      
    }if(changes['whiteLabel']){
      this.whiteLabelName=changes['whiteLabel'].currentValue;
      
    }

  
    
}

styleObject(): Object {
  
 
 
    if(this.gaugeTitleWeightedAvg && this.gaugeTitleWeightedAvg.gaugeTitle.imageType ==='url' ){
    
      return {'background-image': 'url(' + this.gaugeTitleWeightedAvg.gaugeTitle.image + ')','background-size':'cover'}
      
    }else if( this.gaugeTitleWeightedAvg && this.gaugeTitleWeightedAvg.gaugeTitle.imageType ==='image' ){
   
    return {'background-image': 'url(' + this.firestoreImageURL+ ')','background-size':'cover'}
    }
      
  
 else{
  

  if(this.viewGaugeTitle && this.viewGaugeTitle.imageType ==='url' ){
    return {'background-image': 'url(' + this.viewGaugeTitle.image + ')','background-size':'cover'}
  }else if(this.viewGaugeTitle &&  this.viewGaugeTitle.imageType ==='image' ){
    return {'background-image': 'url(' + this.firestoreImageURL+ ')','background-size':'cover'}
  }
  

 } 

}

}



