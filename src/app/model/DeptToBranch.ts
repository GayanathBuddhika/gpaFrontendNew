import { Branch } from 'src/app/model/branch';
import { Department } from 'src/app/model/department';
import { Company } from './company';
export class DepToBranch{
    id: string;
    ai: String;
    company: Company;
    department: Department;
    branch: Branch;
    

    // constructor(
    //         id: string,
    //         ai: String,
    //         company: Company,
    //         department: Department,
    //         branch: Branch){
    //        this.id=id;
    //        this.company=company;
    //        this.branch=branch;
    //        this.department=department;
    // }
}