import { DepToBranch } from './DeptToBranch';
import { Branch } from './branch';
import { Company } from './company';
import { Department } from './department';
import { ThrowStmt } from '@angular/compiler';
export class Employee {

    id: string;
    ai: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    assignDeptToBranch: DepToBranch;
    edit: boolean;

    constructor(
        id: string,
        ai: string,
        firstname: string,
        lastname: string,
        email: string,
        phone: string,
        assignDeptToBranch: DepToBranch,
        edit: boolean

    ) {
        this.id = id;
        this.ai = ai;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.assignDeptToBranch = assignDeptToBranch;
        this.edit = edit;
    }


}