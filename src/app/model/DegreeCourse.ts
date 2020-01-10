import { Lecture } from './Lecture';
import { Course } from './Course';
import { DegreeProgram } from './DegreeProgram';
export class DegreeCourse{
    id: string;
    ai: string;
    degreeProgram: DegreeProgram;
    course: Course;
    lecture: Lecture;
}
