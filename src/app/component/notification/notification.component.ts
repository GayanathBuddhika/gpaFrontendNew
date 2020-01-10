import { NotificationService } from 'src/app/service/notification.service';
import {  take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as _ from 'lodash';
import { AngularFireStorage } from 'angularfire2/storage';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit,OnDestroy {

    // ---get firebase notification list
    firebaseNotification = new BehaviorSubject([]);

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
        //this.getNotifications();

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

        this.notificationService.getNotificatiins(this.batch + 1, this.last).snapshotChanges().pipe(take(1)).pipe(untilDestroyed(this)).subscribe(
            notifications => {

                // Get the last (11 th) Notifications' doc id
                this.lastKey = _.last(notifications).payload.doc.ref.id

                // Get "batch" no notification from the list
                const newNotification = _.slice(notifications, 0, this.batch);

                // Ge the last notification doc from the newNotifiction list
                this.last = _.last(newNotification).payload.doc

                const currentNoti = this.firebaseNotification.getValue();

                // Stop when last id of doc === last new notification. 
                // (Because there won't be any remaining notifications)
                if (this.lastKey == _.last(newNotification).payload.doc.ref.id) {
                    this.finished = true;
                }

                this.firebaseNotification.next(_.concat(currentNoti, newNotification));
                
            }
        )
    }

    getImage(userId){
        
       return this.afStorage.ref(`user/${userId}`).getDownloadURL();
    }

    //    private getNotifications(key?) {
    // 	if (this.finished) return

    // 	this.notificationService
    // 	    .getNotificatiins(this.batch+1, this.lastKey).valueChanges().pipe(untilDestroyed(this))
    // 	    .subscribe(notifications => {

    // 		 /// set the lastKey in preparation for next query
    // 		 this.lastKey = _.last(notifications)['$key']
    // 		 const newNotifications = _.slice(notifications, 0, this.batch)

    // 		 /// Get current movies in BehaviorSubject
    // 		 const currentNotification = this.notification.getValue()

    // 		 /// If data is identical, stop making queries
    // 		 if (this.lastKey == _.last(newNotifications)['$key']) {
    // 			console.log("jfklasldfjklsadj", _.last(newNotifications)['$key'])
    // 		   this.finished = true
    // 		 }

    // 		 /// Concatenate new movies to current movies
    // 		 this.notification.next( _.concat(currentNotification, newNotifications) )
    // 	    })



    //    }

    //   getNotification(){
    // 	  // ---get all the notification
    // 	  this.dbStore.collection('notification',ref => ref.where('companyId','==',this.companyId)).valueChanges().pipe(untilDestroyed(this)).subscribe(data=>{

    // 		this.firebaseNotification = data;
    // 		this.firebaseNotification.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());  
    // 		this.firebaseNotification.forEach(data =>{
    // 		  TimeSince(data.dateTime);
    // 		  this.timeList.push(TimeSince(data.dateTime));

    // 		})
    // 	   })
    //   }

    ngOnDestroy() {

    }




}


interface ImageDetails {
    path: string;
  }