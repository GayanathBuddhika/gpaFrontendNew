import { ValidateFields } from 'src/app/function/validate-fields';
import { GlobalsService } from './../../../shared/globals.service';
import { CamelCasePipe } from './../../../pipe/camelCase.pipe';

import { ErrorDisplayService } from './../../../shared/error-display.service';
import { Department } from './../../../model/department';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/model/company';
import { DepartmentAssingToBranchService } from './../../../service/department-assing-to-branch.service';
import { AuthService } from './../../../core/auth.service';
import { Branch } from 'src/app/model/branch';
import { UserService } from './../../../service/user.service';
import { MustMatch } from 'src/app/function/mustMatch';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input, AfterViewInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/model/user';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class UserAddComponent implements OnInit, OnDestroy, AfterViewInit {

    // --- Subscription 
    private subscription: Subscription = new Subscription();

    // --- signup form group name
    signupForm: FormGroup;
    private user: User;
    
    // --- filter all companies when init
    private filteredCompanies: Company[]=[];    
    filterBranchs:  Branch[];
    filterdepartments: Department[];

    // --- roles of Users
    roles: any[];

    // --- We are putting the image to this variable to preview
    public imagePath;
    imgURL: any;

    private onChangeCompany = false;
    onChangeBranch = false;
 
    private userImage: any;

    currentUserRole =this.globalsService.userObject.role;

    imageCollections : AngularFirestoreCollection<ImageDetails>;
    images: Observable<ImageDetails[]>;

    // --- URL of image where the image stored in firebase, So when editing, it will preview
    downloadURL: Observable<string>;

    // --- State for dropzone CSS toggling
    isHovering: boolean;

    // --- setEditUser values is coming from Parent component user-list.component.ts
    @Input() setEditUser: User;

    // --- edit values is coming from Parent component user-list.component.ts and user.component.ts
    @Input() edit: boolean;     
    

    constructor(private formBuilder: FormBuilder, 
        private userService: UserService,
        private cdr: ChangeDetectorRef,
        public toastr: ToastrManager,
        private depToBranchService: DepartmentAssingToBranchService,
        private authService: AuthService,
        private afStorage: AngularFireStorage, 
        private dbStore: AngularFirestore, private errorDisplayService: ErrorDisplayService,
        public camelCasePipe: CamelCasePipe,
        private globalsService:GlobalsService
        ) { }

        toggleHover(event: boolean) {
            this.isHovering = event;
        }

    ngOnInit() { 
        // --- Get all companies which have avaliable Branches and Department set.
        this.getDepToBranchs();


        this.signupForm = this.formBuilder.group(
        {
            company: ["", Validators.required],
            branch: ["", Validators.required],
            department: ["", Validators.required],
            firstname: ["", [Validators.required, Validators.maxLength(30)]],
            lastname: ["", [Validators.required,Validators.maxLength(30)]],
            email: ["",  [Validators.required, Validators.email]],
            image: [""],
            isEnabled: ["1", Validators.required],
            //role:[!this.edit ? {'role':''} : {'role':this.setEditUser.role}, Validators.required],
            role:[!this.edit ? "" : this.setEditUser.role, Validators.required],

            // --- No need of password or confirm password for editing
            password: ["", !this.edit ? [Validators.required, Validators.minLength(6)] : []],
            confirmPassword: ["", !this.edit ? Validators.required : []]
          },
          {
            validator: MustMatch("password", "confirmPassword")
          }
        );

        // --- Getting all user roles
        this.subscription.add(
            this.userService.getRoles().pipe(untilDestroyed(this)).subscribe(roles =>{  
                const roles_arr: any[] = []

                // --- This fetches UPPERCASE ROLES with underscore from back-end,
                // --- So the original value is indicated with 'role' and the fake value which is Camel case without underscore
                // --- indicated with cvalue. In the front-end we show the cvalue only
                roles.forEach(res => {roles_arr.push({'role': res, 'cvalue':this.camelCasePipe.transform(res)})} );


            this.roles = roles_arr;
        }))

        if(this.currentUserRole && this.currentUserRole !== "SYSTEM_ADMIN"){
            const userCompany=this.globalsService.userObject.assignDeptToBranch.company;          
            this.onSelectedCompnay(userCompany)
          }
      
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    
    // --- Since we have to load the component once company loaded while editing.
    // --- Company, Branch and Department have to be set when edit model opens
    // --- This should happens after All component and Views loaded
    ngAfterViewInit() {
    
        if (this.edit) { 
    
            this.signupForm.get('firstname').patchValue(this.setEditUser.firstname);
            this.signupForm.get('lastname').patchValue(this.setEditUser.lastname);
            this.signupForm.get('email').patchValue(this.setEditUser.email);
            this.signupForm.get('image').patchValue(this.setEditUser.image);
            this.signupForm.get('isEnabled').patchValue(this.setEditUser.isEnabled);

            // --- we need to give an OBJECT. But a STRING is fetched form the back-end. So we need to convert it to object.
            this.signupForm.get('role').patchValue({'role':this.setEditUser.role,'cvalue':this.camelCasePipe.transform(this.setEditUser.role)});
           
            this.cdr.detectChanges();
            this.imageCollections = this.dbStore.collection('user', ref=> ref.where('path','==',this.setEditUser.username));
             this.imageCollections.snapshotChanges().pipe(untilDestroyed(this)).subscribe(data=>{

                if(data && data.length!=0){
                    this.downloadURL = this.afStorage.ref(`user/${this.setEditUser.username}`).getDownloadURL();        
                }
             })

  
           
                      
        }
    }

    // --- convenience getter for easy access to form fields
    get f() {
        return this.signupForm.controls;
    }
    

    onSubmit() {

        // --- call common function 
        ValidateFields(this.signupForm);        

        let company:Company;
        if(this.currentUserRole && this.currentUserRole === "SYSTEM_ADMIN") {
            company = this.signupForm.get('company').value;           
        } else {
            this.signupForm.get('company').patchValue(this.globalsService.userObject.assignDeptToBranch.company)
            company = this.globalsService.userObject.assignDeptToBranch.company;
        }
        // --- stop here if form is invalid
        if (this.signupForm.invalid) {
        
            return;
        }

        

        // --- set the save company object to company 
       
        // --- set the save branch object to branch
        const branch = this.signupForm.get('branch').value;
        // --- set the save branch object to branch
        const department = this.signupForm.get('department').value;          

        // --- Setting all values to user from Form
        this.user = this.signupForm.value;

        // --- Since We get whole fiels from signupForm, company branch department confirmPassword will be set
        // --- to user, SO delete these properties
        delete this.user['company']
        delete this.user['branch']
        delete this.user['department']
        delete this.user['confirmPassword']

        // --- The role is saved as STRING. So we are getting the original role (UPPERCASE + underscore)
        // --- and set it up to user.role 
        this.user.role=(this.signupForm.get("role").value).role;

        // --- SAVING
        // --- if edit, ID and AI should be set to ignore null values passing from front end since we use objects
        if (this.edit) {
            this.user.id = this.setEditUser.id;
            this.user.ai = this.setEditUser.ai;
            this.user.username = this.setEditUser.username;
            this.user.edit = true;
            this.saveUser(this.user, company, branch, department);
        } else {

            this.user.edit = false;
            this.saveUser(this.user, company, branch, department); 
        }        
    }

    // --- Get all company object
    getDepToBranchs() {
        this.subscription.add(
            this.depToBranchService.getAllCompany().pipe(untilDestroyed(this)).subscribe(
                (data) => {
                    const company: Company[] = []
                    data.forEach(res => {company.push(res.company)});
                    this.filteredCompanies = company;

                    this.signupForm.get('branch').patchValue('');
                    this.signupForm.get('department').patchValue('');

                    if (this.edit) {                    
                        this.signupForm.get('company').patchValue(this.setEditUser.assignDeptToBranch.company);
                        this.onSelectedCompnay(this.setEditUser.assignDeptToBranch.company);                    
                    }
                } ,
           
        err => { this.toastr.errorToastr(err, "Error", {position: "bottom-right", animate: "slideFromBottom"}); }));
    }

    // --- Start when select the company, and fetch branch which belongs to the particular company
    onSelectedCompnay(company: Company) { 
        this.subscription.add(
            this.depToBranchService.getBranch(company.id).pipe(untilDestroyed(this)).subscribe(
                data =>{
                    const branch: Branch[] = [];
                    data.forEach(res => {branch.push(res.branch)});
                    this.filterBranchs = branch;
                
                    if (this.edit) {                 
                        this.signupForm.get('branch').patchValue(this.setEditUser.assignDeptToBranch.branch);
                        this.onSelectBranch(this.setEditUser.assignDeptToBranch.branch);   
                    }
                    if (this.onChangeCompany) {
                        this.signupForm.get('branch').patchValue('');
                        this.signupForm.get('department').patchValue('');
                    }
                }, err => { this.toastr.errorToastr(err, "Error", {position: "bottom-right", animate: "slideFromBottom"}); }
            )
        )
    }

    // --- this method start when select the branch and fetch department which belongs to particular branch and company
    onSelectBranch(branch: Branch) {    
        this.subscription.add(
            this.depToBranchService.getDepartment(branch.id).pipe(untilDestroyed(this)).subscribe(
                data =>{
                    const department: Department[] = [];
                    data.forEach(res => {department.push(res.department)});
                    this.filterdepartments = department;

                    if (this.edit) {
                        this.signupForm.get('department').patchValue(this.setEditUser.assignDeptToBranch.department);                        
                    }

                    if (this.onChangeBranch) {
                        this.signupForm.get('department').patchValue('');
                    }
                }, err =>{ this.toastr.errorToastr(err, "Error", {position: "bottom-right", animate: "slideFromBottom"}); }
            )
        )
    }

    // comparing SELECT value vs ngFor
    compareByID(itemOne, itemTwo) {
        return itemOne && itemTwo && itemOne.id === itemTwo.id;
    }

    // --- () for saving
    saveUser(user: User, company: Company, branch: Branch, department: Department) {
        this.startUpload(user.username);
       
      


        this.subscription.add(
            this.userService.save(user,company,branch,department).pipe(untilDestroyed(this)).subscribe(res => {

            if (!this.edit) {
                this.userService._addUserToList.next(res);
                this.toastr.successToastr("Successfully saved", "Success",  {position: "bottom-right", animate: "slideFromBottom"});
                this.userService._set_ngxmodel_Add(true);
            } else {
                this.userService._editUserToList.next(res);
                this.toastr.successToastr("Successfully edited", "Success" , {position: "bottom-right", animate: "slideFromBottom"});
                this.userService._set_ngxmodel_Edit(true);
            }
            
        // this.signupForm.reset();
            }, (err) =>{
                if (!this.edit){
                    this.userService.delete(user.username)
                    this.userService._set_ngxmodel_Add(false);
                } else {
                    this.userService._set_ngxmodel_Edit(true);
                }
                
                this.toastr.errorToastr(err.error.details, "Error", {position: "bottom-right", animate: "slideFromBottom"});

            })
        )

    }

    // --- show the preview of uploaded image
    onImagePreview(event: FileList){
        this.downloadURL = null;
        const files = event.item(0);
        if (event.length === 0)
            {return;}    
    
        var mimeType = files.type;

        if (mimeType.match(/image\/*/) == null) {
            this.toastr.errorToastr("Only images are supported.", "Cannot upload image",{position: "bottom-right",animate: "slideFromBottom"});           
            return;
        }
    
        var reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files); 
        reader.onload = (_event) => { 
            this.imgURL = reader.result; 
        }

        this.userImage = event.item(0)
    }

    startUpload(filename) {
        // The File object
        const file = this.userImage;
        if (!file)
            {return;}
    
        // Client-side validation example
        if (file.type.split('/')[0] !== 'image') { 
            this.toastr.errorToastr("Only images are supported.", "Cannot upload image",{position:"bottom-right",animate:"slideFromBottom"})
          return;
        }
    
        // The storage path
        const path = `user/${filename}`;
    
        // Totally optional metadata
        const customMetadata = { app: 'Pulsebeat v2 User' };

        // --- saving in the database
        if(this.edit){
            this.subscription.add(
            this.dbStore.collection('user', ref=> ref.where('path','==',this.setEditUser.username)).snapshotChanges().pipe(untilDestroyed(this)).subscribe(data=>{
                if(data.length==0){
                    this.dbStore.collection('user').add({'path':filename})           
                }
             })
            )
        
        }else{
            this.dbStore.collection('user').add({'path':filename})
        }
    
        // The main task
        this.afStorage.upload(path, file, { customMetadata });   
    }
    
    isFieldValid(field: string) {
        return !this.signupForm.get(field).valid && this.signupForm.get(field).touched;
    }
    
    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

    onReset(){
        this.signupForm.reset();
        this.signupForm.get("isEnabled").patchValue(1);
    }
    
}

interface ImageDetails{
    path:string;
}
