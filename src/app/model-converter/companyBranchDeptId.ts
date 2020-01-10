export class CompanyBranchDepartment{
    company: string;
    branch : string;
    department: string;

    constructor(company: string,
        branch : string,
        department: string){
            this.company=company;
            this.branch=branch;
            this.department=department
        }
}