import { Color } from './color';
import { GaugeTitle } from './gaugeTitle';
import { Survey } from './survey';
export class GaugeTitleWeightedAvg{
    id:string;
    ai:string;
    gaugeTitle:GaugeTitle;
    survey: Survey
    weight:number;
    color:Color;
}