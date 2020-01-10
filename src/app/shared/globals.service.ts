import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {   
    userObject: User =JSON.parse(localStorage.getItem("currentUser"))
}
