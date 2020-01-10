import { AngularFireStorage } from 'angularfire2/storage';
import { GlobalsService } from './../shared/globals.service';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Subject, Subscription } from 'rxjs';
import { BehaviorSubject, pipe } from 'rxjs';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { switchMap, flatMap, map, first } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { tokenKey } from '@angular/core/src/view';
import { ToastrManager } from 'ng6-toastr-notifications';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

    token: string;
    authState: any = null;  
    user: Observable<firebase.User>;
    
    imageCollections : AngularFirestoreCollection<ImageDetails>;
    downloadURL: Observable<string>;
    userDefaultName :string;


    // --- Initilize two varibles To pass the user object
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    

    constructor(private firebaseAuth: AngularFireAuth, 
        public toastr: ToastrManager, private router: 
        Router, private userService:UserService,
        private dbStore: AngularFirestore, 
        private globalService: GlobalsService,  
        private afStorage: AngularFireStorage,) {
            this.user = firebaseAuth.authState;

            this.firebaseAuth.authState.subscribe((auth) => {
            this.authState = auth;
        })

        // --- Getting the LOGGED IN user from local storage and make it as Observable
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));        
        this.currentUser = this.currentUserSubject.asObservable();

    }

   
   

    signin(email: string, password: string) {       
        return new Promise<any>((resolve, reject) => {
            // --- login with email and password
            this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
            .then(
                res => {   
                       
                    if(res.user.emailVerified || email=="ruwandi@gmail.com" || email=="gayanath@gmail.com"){
                    // --- Once login is successful, get the user object form the backend to find the role
                    this.userService.findByUsername(res.user.uid).subscribe(data=>{   
                       
                       localStorage.setItem("currentUser", JSON.stringify(data));
                       this.currentUserSubject.next(data);
                       
                       // console.log(this.currentUserSubject.value)
                      
                        resolve(this.firebaseAuth.auth.currentUser); 
                    })
                } else {
                    this.toastr.errorToastr("Please verify your mail", "Error", {position: "bottom-right", animate: "slideFromBottom"});
                    reject("Verify your mail")
                }
                    //console.log("Token ",JSON.parse(JSON.stringify(this.firebaseAuth.auth.currentUser)).stsTokenManager.accessToken)       
                
            } ,
                err => {reject(err); }
            ).catch(err => {
                this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
            });
    });
      
    }

    resetPassword(email: string) {
        return this.firebaseAuth.auth.sendPasswordResetEmail(email)
      }

    async logout() {
       // localStorage.setItem('currentUser',null);
    //    this.subscription.unsubscribe()
    //     localStorage.removeItem('currentUser');
    //     localStorage.clear();
      

       // this.currentUserSubject.next(null);
        this.currentUserSubject.complete();

      
        await this.firebaseAuth.auth.signOut().then(()=>{
           
        localStorage.removeItem('currentUser');
       
            this.router.navigate(['/signin']);

        })
       
       // location.reload(true);
    }

    // Returns true if user is logged in
    authenticated(): boolean {
        return localStorage.getItem("currentUser") !== null;
    }

    // Returns current user data
    get currentUserId(): string {
        return localStorage.getItem("currentUser") !== null ? localStorage.getItem("currentUser") : null;
    }

    //in authService file 

     // --- Returning the currentUserSubject as Obsservable. Only value
     public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

   
    public getCurrentUser(){
        return this.currentUserSubject.asObservable();
    }

    getToken(){
        firebase.auth().currentUser.getIdToken().then((token:string)=> this.token=token);
        return this.token;
    }

    getAuth() { 
        return this.firebaseAuth.auth; 
      } 

      getFirebase(){
          return firebase;
      }

      anonymousLogin() {
        return this.firebaseAuth.auth.signInAnonymously().then((user)=>{
            this.authState=user;
        }).catch((err)=>{
            this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});
        })
        
      }
 
    // setProfileImage(){
    //     this.imageCollections = this.dbStore.collection('user', ref=> ref.where('path','==',this.globalService.userObject.username));
    // this.imageCollections.valueChanges().subscribe(data=>{

    //    if(data && data.length!=0){
    //       return this.afStorage.ref(`user/${this.globalService.userObject.username}`).getDownloadURL();        
    //    }else{
    //     return this.afStorage.ref(`user/default.jpg`).getDownloadURL();        
    //    }
   
    // })
    // }
}

interface ImageDetails{
    path:string;
}


