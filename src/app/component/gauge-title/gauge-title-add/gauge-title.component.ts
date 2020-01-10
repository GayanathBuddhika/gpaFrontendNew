import { UserService } from './../../../service/user.service';
import { ValidateFields } from 'src/app/function/validate-fields';
import { AngularFireStorage } from "angularfire2/storage";
import { GaugeTitle } from "../../../model/gaugeTitle";
import { Component, OnInit, ViewChildren, QueryList, ElementRef, Renderer2, ChangeDetectorRef, OnDestroy} from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from "@angular/forms";
import { GaugeTitleService } from "src/app/service/gauge-title.service";
import { ConfirmationService } from "primeng/api";
import { ToastrManager } from "ng6-toastr-notifications";
import { AngularFirestore } from "angularfire2/firestore";
import * as uuid from "uuid";
import { Router } from '@angular/router';
import { FirebaseNotification } from 'src/app/model/firebaseNotification';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
    selector: "app-gauge-title",
    templateUrl: "./gauge-title.component.html",
    styleUrls: ["./gauge-title.component.css"]
})
export class GaugeTitleComponent implements OnInit,OnDestroy {
    

    // --- Form group
    gaugeTitleForm: FormGroup;
    gaugeTitles: FormArray;
    assignDeptToBranch: string;

    // --- There is a lable in to remove images, So if we click it, the index of the lable goes into an array as boolean.
    // --- Then we can understand that image is uploaded in that index
    // --- So lable will be shown when the index of the lable === true
    removeImageLable:any=[];

    @ViewChildren("inputFile") fileInput: QueryList<ElementRef>;
    @ViewChildren("img") img: QueryList<ElementRef>;

    // ---create variable named role for get loged user role
    private role: string = JSON.parse(localStorage.getItem("currentUser")).role;

    gaugeTitleEdit:boolean=false;
    gaugeTileEditObject:GaugeTitle;
    removedImages = false;
    fireStore: any;
    downloadImage: any;
 
    constructor(
        private formBuilder: FormBuilder,
        private gaugeTitleService: GaugeTitleService,
        private confirmationService: ConfirmationService,
        public toastr: ToastrManager,
        private afStorage: AngularFireStorage,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private dbStore: AngularFirestore,
        private datePipe:DatePipe,
        private userService:UserService,
        private notificationService:NotificationService
      
    ) { }

    ngOnInit() {

        this.gaugeTitleForm = this.formBuilder.group({
            gaugeTitles: this.formBuilder.array([this.createItem()])
        });

        this.gaugeTitleService._edit_gauge_title.pipe(untilDestroyed(this)).subscribe(data=>{         
            this.gaugeTitleEdit=data;            
        })

        this.assignDeptToBranch = JSON.parse(localStorage.getItem("currentUser")).assignDeptToBranch.id;        
    }

    createItem() {
        
        return this.formBuilder.group({
            title: ["", Validators.required],
            lowest: ["", Validators.required],
            lower: ["", Validators.required],
            middle: ["", Validators.required],
            higher: ["", Validators.required],
            highest: ["", Validators.required],
            image: [{value: '', disabled: false}, Validators.pattern(/^$|([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/)],
            imageType:[""]
        });
    }

    ngAfterViewInit() {
        // --- for patchValue when gaugeTitle gaugeTitleEdit = true 
            if(this.gaugeTitleEdit){

                this.gaugeTitleService._get_edit_gauge_title_object.pipe(untilDestroyed(this)).subscribe(data=>{
                    this.gaugeTileEditObject=data;
                })

                this.gaugeTitleForm.controls.gaugeTitles["controls"][0].get('title').patchValue(this.gaugeTileEditObject.title);
                this.gaugeTitleForm.controls.gaugeTitles["controls"][0].get('lowest').patchValue(this.gaugeTileEditObject.lowest);
                this.gaugeTitleForm.controls.gaugeTitles["controls"][0].get('lower').patchValue(this.gaugeTileEditObject.lower);
                this.gaugeTitleForm.controls.gaugeTitles["controls"][0].get('middle').patchValue(this.gaugeTileEditObject.middle);
                this.gaugeTitleForm.controls.gaugeTitles["controls"][0].get('higher').patchValue(this.gaugeTileEditObject.higher);
                this.gaugeTitleForm.controls.gaugeTitles["controls"][0].get('highest').patchValue(this.gaugeTileEditObject.highest);
           

                if(this.gaugeTileEditObject.imageType==='url'){
                    // --- Assign the url to "image" control
                    this.gaugeTitleForm.controls.gaugeTitles["controls"][0].get('image').patchValue(this.gaugeTileEditObject.image);
                
                    // --- Preview the image if exists
                    this.img.toArray()[0].nativeElement.src=this.gaugeTileEditObject.image;   
                    // --- Show the Remove Image button
                    this.removeImageLable[0]=true;

                    // --- NOTE : If url exists, image button is automatically disabled in HTML

                } else if(this.gaugeTileEditObject.imageType==='image'){
                    // --- Get the firestore url as async
                    this.downloadImage=this.afStorage.ref(`gauge-images/${this.gaugeTileEditObject.image}`).getDownloadURL();
                    // --- Disable the image url input box
                    this.gaugeTitleForm.controls.gaugeTitles["controls"][0].get('image').disable()
                     // --- Show the Remove Image button
                    this.removeImageLable[0]=true;
                }else{
                    this.img.toArray()[0].nativeElement.src='';
                }
                
              }
       
              this.cdr.detectChanges();       
      }


    onFileChange(file: FileList, index: number) {

        if (file.length === 0)
        {return;}    

        var mimeType = file.item(0).type;

        if (mimeType.match(/image\/*/) == null) {
            this.toastr.errorToastr("Only images are supported.", "Cannot upload image",{position: "bottom-right",animate: "slideFromBottom"}); 

            // --- Remove non image files and preview
            this.fileInput.toArray()[index].nativeElement.value="";    
            this.img.toArray()[index].nativeElement.src="";      
            return;
        }

        const reader = new FileReader();       
        reader.readAsDataURL(file.item(0)); 
        reader.onload = (_event) => { 
           // --- Preview image
            this.img.toArray()[index].nativeElement.src=reader.result

            // --- Image is uploaded in this index and made it true.
            this.removeImageLable[index]=true;

            // --- When image is uploaded, disable the url input box
            this.gaugeTitleForm.controls.gaugeTitles["controls"][index].get('image').disable()
        }
     }

    addItem(): void {
        ValidateFields(this.gaugeTitleForm);
        if (this.gaugeTitleForm.invalid) {
            this.toastr.errorToastr("Please fill all required fields", "Alert", { position: "bottom-right", animate: "slideFromBottom"  });
            return;
        } else {
            this.gaugeTitles = this.gaugeTitleForm.get("gaugeTitles") as FormArray;
            this.gaugeTitles.push(this.createItem());
        }
    }

    onRemoveRow(index) {
        const length = this.gaugeTitleForm.value.gaugeTitles.length;

        // --- Not allowing to remove first row
        if (length === 1 && index === 0) {
            this.toastr.errorToastr("You cannot delete initial row", "Error", { position: "bottom-right", animate: "slideFromBottom" });
        } else {
            this.confirmationService.confirm({
                message: "Are you sure that you want to proceed?",
                header: "Confirmation",
                icon: "pi pi-exclamation-triangle",
                accept: () => {
                    // --- Remove the FormGroup From FormArray
                    //this.gaugeTitleForm.controls.gaugeTitles["controls"].splice(index, 1);
                    (<FormArray>this.gaugeTitleForm.get("gaugeTitles")).removeAt(index);
                    // this.gaugeTitleForm.value.gaugeTitles.splice(index, 1);

                    this.toastr.successToastr("Data is removed", "Success", { position: "bottom-right", animate: "slideFromBottom" });
                },
                reject: () => { }
            });
        }
    }

   

    onRemoveImage(index){

        // --- Make URL empty when removing imge/url
        this.gaugeTitleForm.controls.gaugeTitles["controls"][index].get('image').patchValue('')

        // --- Remove file id exists
        this.fileInput.toArray()[index].nativeElement.value="";

        // --- Remove preview if exists
        this.img.toArray()[index].nativeElement.src = '';

        // --- Make the lable not visible if visible
        this.removeImageLable[index]=false;

        // --- Enable the url if disbaled
        this.gaugeTitleForm.controls.gaugeTitles["controls"][index].get('image').enable()

        // --- Identify whether all images are removed or not when editing
        // --- Because After uploading sometimes, clients may not need images again
        // --- It won't be a problem in adding, but problem in editing when clients dont need images
        if(this.gaugeTitleEdit){
            this.removedImages = true;
        }
    }
   
    onSubmit() {
       
        ValidateFields(this.gaugeTitleForm);        
        if (this.gaugeTitleForm.invalid) {
            this.toastr.errorToastr("Please correct invalid fields", "Error", { position: "bottom-right", animate: "slideFromBottom" });
        } else {
            this.confirmationService.confirm({
                message: "Are you sure that you want to save data?",
                header: "Confirmation",
                icon: "pi pi-exclamation-triangle",
                accept: () => {
                    this.gaugeTitleForm.value.gaugeTitles.forEach((element, index) => {
                        let fileName: String = "";

                        // --- When editing, we have to get the old image url/uuid
                        // --- But if client removed imges we dont need to re-assign
                        if(this.gaugeTitleEdit && this.gaugeTileEditObject.image && !this.removedImages){
                            element.image=this.gaugeTileEditObject.image;
                            element.imageType=this.gaugeTileEditObject.imageType;

                          
                        }else{
                            // --- If URL added, image type == url
                            element.imageType= element.image ? "url" : "";
                        }


                        // --- Getting the file which is in Query List
                        if ( this.fileInput && this.fileInput.toArray()[index].nativeElement.files[0] ) {
                            fileName = uuid.v4();
                            const path = `gauge-images/${fileName}`;
                            const customMetadata = { app: "Pulsebeat v2 User" };

                            // --- Re-assign filename to object
                            element.image = fileName;

                             // --- If image added, image type == image
                            element.imageType="image"
                            this.afStorage.upload( path, this.fileInput.toArray()[index].nativeElement.files[0], { customMetadata } );
                        }
                    });
                    const gaugeTitle: GaugeTitle[] = this.gaugeTitleForm.value;

                    // --- set id and ai into edited gagueTitle object
                    if(this.gaugeTitleEdit){
        
                        this.gaugeTitleForm.value.gaugeTitles[0].id= this.gaugeTileEditObject.id;
                        this.gaugeTitleForm.value.gaugeTitles[0].ai=this.gaugeTileEditObject.ai;

                        if( !this.fileInput){

                        }
                      } 

                    this.gaugeTitleService.saveGaugeTitle(this.gaugeTitleForm.value, this.assignDeptToBranch).pipe(untilDestroyed(this)).subscribe(
                            data => {

                                // --- Re-create the form
                                this.gaugeTitleForm = this.formBuilder.group({
                                    gaugeTitles: this.formBuilder.array([this.createItem()])
                                });

                                //---for firebase notification
                                this.notificationService.saveNotification("edit gauge title");

                                
                                this.toastr.successToastr( "Data is saved", "Success", { position: "bottom-right", animate: "slideFromBottom" });

                                // --- if gagueTitle edit then redirect to the gaugeTitleList component
                                if(this.gaugeTitleEdit){
                                    this.router.navigate(['/main/gaugetitle/list']);
                                }
                            },
                            err => {
                                this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
                            }
                        );
                },
                reject: () => { }
            });
        }
    }
    
    isFieldValid(field: string, index:number) {
       //   console.log(this.gaugeTitleForm.controls.gaugeTitles["controls"][index].)
       return !this.gaugeTitleForm.controls.gaugeTitles["controls"][index].get(field).valid && this.gaugeTitleForm.controls.gaugeTitles["controls"][index].get(field).touched;
    }    

    ngOnDestroy(): void {
      this.gaugeTitleService._edit_gauge_title.next(false);
    //  this.gaugeTitleService._edit_gauge_title.complete()
    }

    onCancel(){
        this.gaugeTitleService._edit_gauge_title.next(false);      
        this.router.navigate(['/main/gaugetitle/list']);        
    }
}
