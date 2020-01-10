import { AnswerObject } from './answerObject';
import { Question } from './question';
import { Answer } from './answer';
export class FinalQA {
    id: string;
    ai: string;
    dateTime: string;
    answerId: Answer;
    answer: string;
    uuid: string
}