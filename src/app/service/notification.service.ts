import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notificationCollections : AngularFirestoreCollection<any>;
  constructor(private db: AngularFirestore,
              private datePipe:DatePipe,) { }

  getNotificatiins(batch, lastKey?) {
      if(!lastKey){
        return this.db.collection('notification',ref=>ref.orderBy("dateTime","desc").limit(batch));
      }
    return this.db.collection('notification',ref=>ref.orderBy("dateTime","desc").startAfter(lastKey).limit(batch));
  }

  getAlerts(batch, lastKey?) {
    if(!lastKey){
      return this.db.collection('alert',ref=>ref.orderBy("dateTime","desc").limit(batch));
    }
  return this.db.collection('alert',ref=>ref.orderBy("dateTime","desc").startAfter(lastKey).limit(batch));
  }

  saveNotification(message:string){

    let now = new Date();
                                
    this.db.collection('notification').add({
        fullname:JSON.parse(localStorage.getItem("currentUser")).firstname + JSON.parse(localStorage.getItem("currentUser")).lastname,
        companyId:JSON.parse(localStorage.getItem("currentUser")).assignDeptToBranch.company.id,
        dateTime:this.datePipe.transform(now, "yyyy-MM-dd HH:mm"),
        message:message,
        userRole:JSON.parse(localStorage.getItem("currentUser")).role,
        username:JSON.parse(localStorage.getItem("currentUser")).username
    });

  }
}
