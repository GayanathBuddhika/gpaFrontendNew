import { Company } from './company';

export class Reward{
     id:string;
     title:string;
     startDate:string;
     endDate:string;
     message:string;
     disabled:boolean;
     customerCount:number;
     availableBranchs:string;
     company:Company;
     customerId:string;
     noOfClaims:number;
     claimLimits:number;

}