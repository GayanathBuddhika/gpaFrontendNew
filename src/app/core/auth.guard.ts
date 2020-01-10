import { User } from './../model/user';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (private auth: AuthService, private router: Router, public toster: ToastrManager,) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const currentUser = this.auth.currentUserValue;      

      

        // console.log("Current user role ", currentUser.role)
      //  if (currentUser) {

        if (currentUser) {

             // check if route is restricted by role        
            //  if (route.data.role && route.data.role.indexOf(currentUser.role) === -1) {
             if (route.data.role && route.data.role.indexOf(currentUser.role) === -1) {
                this.toster.errorToastr("Your do not have permission to access", "Not Authorized", { position: "bottom-right", animate: "slideFromBottom" });
                // role not authorised so redirect to home page
               //  this.router.navigate(['/main/dashboard']);

                return;
            }

            // authorised so return true
            return true;
        }

         // not logged in so redirect to login page with the return url
         this.router.navigate(['/signin']);
         return false;

//       return this.auth.user.pipe(
//       take(1),
//       map(user => !!user),
//       tap(loggedIn => {
//         if (!loggedIn) {
//           console.log('access denied');
//           this.router.navigate(['/login']);
//         } else{
//           return true;
//         }
//     })
//   );
}
}
