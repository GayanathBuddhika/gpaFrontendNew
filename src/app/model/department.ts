import { Company } from './company';

export class Department {
    id:string;
    ai: number;
    name:string;
    isEnabled: Number;
    company:Company;
    edit: boolean;
    assign?:boolean;

    
    // constructor(id:string,
    //     ai: number,
    //     name:string,
    //     company:Company,
    //     isEnabled: Number,
    //     edit:boolean
    //     ){
    //         this.id=id;
    //         this.ai=ai;
    //         this.name=name;
    //         this.isEnabled=isEnabled;
    //         this.company=company;
    //         this.edit=edit;
    // }
}