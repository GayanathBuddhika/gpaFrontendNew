import { AngularFireAuth } from 'angularfire2/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, mergeMap, finalize } from 'rxjs/operators';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable() 
export class HttpConfigInterceptor implements HttpInterceptor {
    activeRequests = 0;
   // token: string = "";

    constructor(private spinner: NgxSpinnerService,private firebaseAuth: AngularFireAuth,public toastr: ToastrManager){
        //window.dispatchEvent(new Event("resize"));
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.activeRequests++;

        //if (this.activeRequests === 0) {
            this.spinner.show();
       // }
     
      


        return this.firebaseAuth.idToken.pipe(
          mergeMap((token: any) => {
            
            if (token) {       
                      console.log(token);
                request = request.clone({ headers: request.headers.set('X-Authorization-Firebase', token) });
                
            }
           
            return next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        console.log("Event --- > ", event)
                        this.decreaseRequests();

                        //window.dispatchEvent(new Event("resize"));
                            
                    }
                    return event;
                }),catchError((error: HttpErrorResponse) => {
                    console.log("Error --- > ", error)
                    this.decreaseRequests();
                    
                   // window.dispatchEvent(new Event("resize"));
                    return throwError(error);
                })
                
                // ,finalize(()=>{
                //     this.activeRequests--;
                //     console.log("activeRequests",this.activeRequests)
                //     if (this.activeRequests === 0) {
                //         this.spinner.hide();
                // }})
                
                );

        }));
      }

      private decreaseRequests() {
        this.activeRequests--;
        if (this.activeRequests === 0) {
            this.spinner.hide();
        }
      }
}