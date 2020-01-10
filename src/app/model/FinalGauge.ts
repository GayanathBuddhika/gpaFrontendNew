import { Survey } from './survey';
import { DepToBranch } from './DeptToBranch';
export class FinalGauge{
    id:string;
    ai:string;
    dateTime:string;
    uuid:string;
    avgWeightedValue:number;
    additionalFeedback:string;
    survey:Survey;
    customerOrEmployeeId:string;
    assignDeptToBranch:DepToBranch;
}