import { AnswerObject } from './answerObject';
import { DepToBranch } from './DeptToBranch';
import { AnswersType } from './answersType';
import { Survey } from './survey';

export class Question {
    id: string;
    ai: number;
    question: string;
    assignDepToBranch: DepToBranch;
    answersType: AnswersType;
    survey: Survey;
    required : boolean;
    answer: string;
}