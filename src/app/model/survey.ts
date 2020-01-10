import { SurveyType } from 'src/app/model/surveyType';
import { stringify } from '@angular/core/src/util';
import { DepToBranch } from './DeptToBranch';
export class Survey {
    id: string;

    ai: number;

    name: string;

    assignDeptToBranch: DepToBranch;

    description: string;

    startDateTime: string;

    endDateTime: string;

    selectionType: string;

    surveyType: SurveyType;

    surveyFor: string;

    createdDate: string;

    createUser: string;

    enabled: boolean;

    isSurveyDeleted: boolean;

    wightLable: string;


}