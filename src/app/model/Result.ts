import { Course } from './Course';
import { Student } from './Student';
export class Result {
    id: string;
    ai: string;
    result: string;
    examDate: string;
    student: Student;
    course: Course;
}
