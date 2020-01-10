import { BussinessType } from './bussinessType';

export class Company {
    id: string;
    ai: number;
    name: string;
    description: string;
    address: string;
    email: string;
    website: string;
    phone: string;
    image: string;
    smsApiKey: string;
    isEnabled: number;
    businessType: BussinessType;
    edit : boolean;
   

    constructor(name: string, description: string, address: string, 
        email: string, website: string, phone: string, image: string, smsApiKey: string,
         isEnabled: number, businessType: BussinessType, edit: boolean)
          {
        this.name = name;
        this.description = description;
        this.address = address;
        this.email = email;
        this.website = website;
        this.phone = phone;
        this.image = image;
        this.smsApiKey = smsApiKey;
        this.businessType = businessType;
        this.isEnabled = isEnabled;
        this.edit = edit;
    }

}