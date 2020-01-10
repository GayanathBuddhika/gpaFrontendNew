import { AnswerObject } from './answerObject';
//import { AnswerListAnswer } from './answer';
export class QuestionAndAnswer{
    question : string;
    answer ?: AnswerObject[];
    answerList?: string;
    answerType: string;
    index: number;
}