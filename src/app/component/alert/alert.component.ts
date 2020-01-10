import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { NotificationService } from 'src/app/service/notification.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

   // ---get firebase notification list
   firebasealert = new BehaviorSubject([]);

   timeList: any[] = [];
   companyId: string = JSON.parse(localStorage.getItem("currentUser")).assignDeptToBranch.company.id;
   username:string= JSON.parse(localStorage.getItem("currentUser")).username;
   // notification = new BehaviorSubject([]);

   batch = 20         // size of each query
   lastKey = ''      // key to offset next query from
   last = ''
   finished = false  // boolean when end of database is reached
   dImg:any;

  constructor(private dbStore: AngularFirestore,
    private notificationService: NotificationService,
    private afStorage: AngularFireStorage) { }

  ngOnInit() {
    this.getNotifications();
  }

  onScroll() {
    this.getNotifications();
}

// 1) Retrieve initial Notificatiins from the database during ngOnInit()
    // 2) Grab 1 extra record and save its key
    // 3) When scroll event fires, grab another batch of Notifications offset by the lastKey.
    // 4) When lastKey equals last Notifications in a new batch, we have reached the end of the database.
    getNotifications() {
      if (this.finished) { return; }

      this.notificationService.getAlerts(this.batch + 1, this.last).snapshotChanges().pipe(take(1)).subscribe(
          notifications => {
            
              // Get the last (11 th) Notifications' doc id
              this.lastKey = _.last(notifications).payload.doc.ref.id

              // Get "batch" no notification from the list
              const newNotification = _.slice(notifications, 0, this.batch);

              // Ge the last notification doc from the newNotifiction list
              this.last = _.last(newNotification).payload.doc

              const currentNoti = this.firebasealert.getValue();

              // Stop when last id of doc === last new notification. 
              // (Because there won't be any remaining notifications)
              if (this.lastKey == _.last(newNotification).payload.doc.ref.id) {
                  this.finished = true;
              }

              this.firebasealert.next(_.concat(currentNoti, newNotification));
              
          }
      )
  }

  getImage(userId){
      
     return this.afStorage.ref(`user/${userId}`).getDownloadURL();
  }
}

