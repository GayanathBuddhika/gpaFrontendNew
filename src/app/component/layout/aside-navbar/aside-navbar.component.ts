import { ConfirmationService } from 'primeng/api';
import { AngularFireStorage } from "angularfire2/storage";
import { GlobalsService } from "./../../../shared/globals.service";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "angularfire2/firestore";
import { AuthService } from "./../../../core/auth.service";
import {
  Component,
  OnInit,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  ViewEncapsulation
} from "@angular/core";
import { first } from "rxjs/operators";
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: "app-aside-navbar",
  templateUrl: "./aside-navbar.component.html",
  styleUrls: ["./aside-navbar.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class AsideNavbarComponent implements OnInit, OnDestroy {
  imageCollections: AngularFirestoreCollection<ImageDetails>;
  downloadURL: Observable<string>;
  userDefaultName: string;
  private subscription: Subscription = new Subscription();

  //showPic = new BehaviorSubject<any>(true);

  
  constructor(
    private authService: AuthService,
    private dbStore: AngularFirestore,
    private globalService: GlobalsService,
    private afStorage: AngularFireStorage,
    private confirmationService:ConfirmationService
  ) {
    // })

  }

  ngOnInit() {
    // if (this.authService.showProfile_pic) {
    //   this.authService._showProfile_picSubject.next(false);

        if(localStorage.getItem('currentUser')){
            let res=JSON.parse(localStorage.getItem('currentUser'));

            this.userDefaultName = res.firstname;

            this.imageCollections = this.dbStore.collection("user", ref =>ref.where("path", "==", res.username));
            this.subscription = this.imageCollections.stateChanges().pipe(untilDestroyed(this)).subscribe(data => {
                if (data && data.length != 0) {
                  this.downloadURL = this.afStorage
                    .ref(`user/${res.username}`)
                    .getDownloadURL();
                } else {
                  this.downloadURL = this.afStorage
                    .ref(`user/default.jpg`)
                    .getDownloadURL();
                }
              });
        }

    //   this.authService.currentUser.pipe(untilDestroyed(this)).subscribe(res => {
    //     if (res) {
            
    //       this.userDefaultName = res.firstname;

    //       this.imageCollections = this.dbStore.collection("user", ref =>ref.where("path", "==", res.username));
    //       this.subscription = this.imageCollections.stateChanges().pipe(untilDestroyed(this)).subscribe(data => {
    //           if (data && data.length != 0) {
    //             this.downloadURL = this.afStorage
    //               .ref(`user/${res.username}`)
    //               .getDownloadURL();
    //           } else {
    //             this.downloadURL = this.afStorage
    //               .ref(`user/default.jpg`)
    //               .getDownloadURL();
    //           }
    //         });
    //     }
    //   });
    }
//   }


  logout() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.authService.logout();
        },
        reject: () => {

        }
    });
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
interface ImageDetails {
  path: string;
}
