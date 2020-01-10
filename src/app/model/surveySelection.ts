import { Company } from './company';
import { SurveyType } from './surveyType';
import { SubscriptionsDetails } from './subscriptionsDetails';
import { stringify } from '@angular/core/src/render3/util';

export class SurveySelction{
  
    id: string;
    ai: number;
    subscription: SubscriptionsDetails;
    surveytype: SurveyType;
    company: Company;



}