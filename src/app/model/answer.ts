import { Question } from './question';

export class Answer {
    id: string;
    ai: number;
    answer: string;
    question: Question;
    placeHolderLable: string;
}