
import { AngularFirestore } from 'angularfire2/firestore';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { take } from 'rxjs/operators';
import { TimeSince } from 'src/app/function/nitificationTime';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarComponent implements OnInit, OnDestroy {

  // ---get firebase notification list
  firebaseNotification: any[] = [];

  // ---get alert list
  firebaseAlert: any[] = [];

  // ---get notified user  last login detail
  lastlogin: any;

  // ---get notified user for alert
  lastloginForAlert: any;

  // ---get document id for updat notified user
  getDocId: any;
  getDocIdForAlert: any;
  timeList: any[] = [];
  timeListForAlert: any[] = [];
  notificationCount: number;
  alertCount: number;
  today: Date;
  nowDateTime: any;
  time: any;
  // companyId:string =JSON.parse(localStorage.getItem("currentUser")).assignDeptToBranch.company.id;
  // userRole: string = JSON.parse(localStorage.getItem("currentUser")).role;
  // username: string = JSON.parse(localStorage.getItem("currentUser")).username;

  constructor(private dbStore: AngularFirestore,
    private datePipe: DatePipe,
    public toastr: ToastrManager) { }



  ngOnInit() {
    this.today = new Date();
    this.nowDateTime = this.datePipe.transform(this.today, "yyyy-MM-dd HH:mm")

    // //---------------------------------------------notification-------------------------------------------------//
    // // ---check whether user was notified before or not 
    // this.dbStore.collection('notifieduser', ref => ref.where('username', '==', this.username)).valueChanges().pipe(untilDestroyed(this)).subscribe(data => {

    //   this.lastlogin = data[0];

    //   // ---check current user
    //   // ---get new notification count
    //   if (this.lastlogin !== undefined) {

    //     this.dbStore.collection('notification', ref => ref.where('dateTime', '>', this.lastlogin.datetime)
    //       .where('companyId', '==', this.companyId)).valueChanges().pipe(untilDestroyed(this)).subscribe(data => {

    //         this.notificationCount = data.length;


    //         if (this.notificationCount != 0) {
    //           this.toastr.successToastr("", "you have received new notification", { position: "bottom-right", animate: "slideFromBottom" });
    //         }
    //       }, err => {
    //         this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    //       })

    //   } if (this.lastlogin == undefined) {

    //     this.dbStore.collection('notification', ref => ref.where('companyId', '==', this.companyId)).valueChanges().pipe(untilDestroyed(this)).subscribe(data => {

    //       this.notificationCount = data.length;
    //       if (this.notificationCount != 0) {
    //         this.toastr.successToastr("", "you have received new notification", { position: "bottom-right", animate: "slideFromBottom" });
    //       }

    //     }, err => {
    //       this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    //     })

    //   }
    // }, err => {
    //   this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    // })

    // // ---get all the notification
    // this.dbStore.collection('notification', ref => ref.where('companyId', '==', this.companyId)).valueChanges().pipe(untilDestroyed(this)).subscribe(data => {

    //   this.firebaseNotification = data;
    //   this.firebaseNotification.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    //   this.firebaseNotification.forEach(data => {
    //     this.timeList.push(TimeSince(data.dateTime));
    //   })


    // }, err => {
    //   this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    // })

    // //---------------------------------------------alert--------------------------------------------------------//
    // // ---check notified user for alert
    // this.dbStore.collection('alertnotifieduser', ref => ref.where('username', '==', this.username)).valueChanges().pipe(untilDestroyed(this)).subscribe(data => {

    //   this.lastloginForAlert = data[0];
    //   // ---check current user
    //   // ---get new notification count
    //   if (this.lastloginForAlert !== undefined) {

    //     this.dbStore.collection('alert', ref => ref.where('dateTime', '>', this.lastloginForAlert.datetime)
    //       .where('companyId', '==', this.companyId)).valueChanges().pipe(untilDestroyed(this)).subscribe(data => {

    //         this.alertCount = data.length;

    //         if (this.alertCount != 0) {
    //           this.toastr.successToastr("", "you have received new alert", { position: "bottom-right", animate: "slideFromBottom" });
    //         }
    //       }, err => {
    //         this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    //       })

    //   } if (this.lastloginForAlert == undefined) {

    //     this.dbStore.collection('alert', ref => ref.where('companyId', '==', this.companyId)).valueChanges().pipe(untilDestroyed(this)).subscribe(data => {

    //       this.alertCount = data.length;
    //       if (this.alertCount != 0) {
    //         this.toastr.successToastr("", "you have received new notification", { position: "bottom-right", animate: "slideFromBottom" });
    //       }

    //     }, err => {
    //       this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    //     })

    //   }
    // }, err => {
    //   this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    // })

    // // ---get all the alert
    // this.dbStore.collection('alert', ref => ref.where('companyId', '==', this.companyId)).valueChanges().pipe(untilDestroyed(this)).subscribe(data => {

    //   this.firebaseAlert = data;

    //   this.firebaseAlert.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    //   this.firebaseAlert.forEach(data => {

    //     this.timeListForAlert.push(TimeSince(data.dateTime));
    //   })


    // }, err => {
    //   this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    // })
  }


  //---------------------------------------------notification--------------------------------------------------------//

  // ---when click notification update new count of notification
  setNotifiedUser() {

    this.notificationCount = 0;
    let now = new Date();

    this.dbStore.collection('notifieduser', ref => ref.where('username', '==', this.username)).snapshotChanges().pipe(untilDestroyed(this)).subscribe(data => {

      this.getDocId = data[0];

      if (this.getDocId !== undefined) {

        // --- update time of notified user
        this.dbStore.doc('notifieduser/' + this.getDocId.payload.doc.id).update({
          datetime: this.datePipe.transform(now, "yyyy-MM-dd HH:mm"),
          username: JSON.parse(localStorage.getItem("currentUser")).username
        });

      } else {

        // --- add new user as notified
        this.dbStore.collection('notifieduser').add({
          datetime: this.datePipe.transform(now, "yyyy-MM-dd HH:mm"),
          username: JSON.parse(localStorage.getItem("currentUser")).username
        });

      }

    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    })

  }


  //---------------------------------------------alert--------------------------------------------------------//
  // ---when click alert update new count of alert
  setAlertNotifiedUser() {

    this.alertCount = 0;
    let now = new Date();

    this.dbStore.collection('alertnotifieduser', ref => ref.where('username', '==', this.username)).snapshotChanges().pipe(untilDestroyed(this)).subscribe(data => {

      this.getDocIdForAlert = data[0];

      if (this.getDocIdForAlert !== undefined) {

        // --- update time of notified user for alert
        this.dbStore.doc('alertnotifieduser/' + this.getDocIdForAlert.payload.doc.id).update({
          datetime: this.datePipe.transform(now, "yyyy-MM-dd HH:mm"),
          username: JSON.parse(localStorage.getItem("currentUser")).username
        });

      } else {

        // --- add new user as notified
        this.dbStore.collection('alertnotifieduser').add({
          datetime: this.datePipe.transform(now, "yyyy-MM-dd HH:mm"),
          username: JSON.parse(localStorage.getItem("currentUser")).username
        });

      }

    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    })
  }

  ngOnDestroy() {

  }

}


