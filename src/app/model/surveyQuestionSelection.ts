import { SbdRelation } from './sbdRelation';
import { QuestionAndAnswer } from './questionAndAnswer';
import { Survey } from './survey';

export class SurveyQuestionSelection {
    survey : Survey;
    questionAndAnswer: any[];
    sbdRelation : SbdRelation[];
}