import { DepToBranch } from 'src/app/model/DeptToBranch';
import { Department } from './department';
import { Branch } from './branch';
import { Company } from './company';

export class User{
    id:string;
    ai:number;
    firstname:string;
    lastname:string;
    email:string;
    image:string;
    isEnabled:number;
    assignDeptToBranch: DepToBranch;
    role: string;
    username: string;
    edit?:boolean;
    password?:string;
}