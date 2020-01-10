import { SubscriptionsDetails} from './subscriptionsDetails';
import { Company } from './company';
import { ThrowStmt } from '@angular/compiler';

export class Plan {
    id: string;
    ai: number;
    company: Company;
    subscription: SubscriptionsDetails;
    startDate: string;
    endDate: string;
    enable: boolean;
    date: string;

    // constructor(
    //     id: string,
    //     ai: number,
    //     company: Company,
    //     subscription: SubscriptionsDetails,
    //     startDate: string,
    //     endDate: string,
    //     isEnable: boolean,
    //     date: string
    // ) {
    //     this.id = id;
    //     this.ai = ai;
    //     this.company = company;
    //     this.subscription = subscription;
    //     this.startDate = startDate;
    //     this.endDate = endDate;
    //     this.enable = isEnable;
    //     this.date = date;
    // }


}