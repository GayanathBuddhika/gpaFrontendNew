import { Color } from './../../../model/color';

import { forEach } from '@angular/router/src/utils/collection';
import { GaugeTitle } from '../../../model/gaugeTitle';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm, FormControl } from '@angular/forms';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { ServeyService } from './../../../service/servey.service';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { Survey } from 'src/app/model/Survey';
import { SbdRelation } from 'src/app/model/sbdRelation';
import { SurveyType } from 'src/app/model/surveyType';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ConfirmationService } from 'primeng/api';
import { SurveyConverterForGaugeTitle } from 'src/app/model/SurveyConverterForGaugeTitle';
import { flatMap } from 'rxjs/operators';
import { ValidateFields } from 'src/app/function/validate-fields';
import { GaugeTitleService } from 'src/app/service/gauge-title.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SelectItem } from 'primeng/api';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DepToBranch } from 'src/app/model/DeptToBranch';

@Component({
  selector: 'app-create-servey',
  templateUrl: './create-servey.component.html',
  styleUrls: ['./create-servey.component.css']
})

export class CreateServeyComponent implements OnInit, OnDestroy {

  surveyCreateformValid: boolean = false;
  //form2Valid: boolean = false;
  //selectSrartDate: boolean = false;
  //selectEndDate: boolean = false;

  surveyCreateform: FormGroup;

  // --- for get the surveyForList array(form 1)
  surveyForList: string[] = [];

  // --- for get the selected servayfor(form 1)
  // selectedServayFor: string;
  // --- for get selectionType (form 1)
  selectionTypes: any[];
  // --- for get selected selectionType (form 1)
  selectedSelectionTypes: string;
  // --- to get the all survaytype
  surveyTypes: SurveyType[] = [];
  // --- to get the current user company Id
  companyId: string = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.company.id;
  assignDeptTOBranchId: string = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch.id;
  assignDeptTOBranch: DepToBranch = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch;
  // --- to get the selected surveytype
  selectedSurveyType: string;
  // --- for get the BranchesForSurvey
  branchesForSurvey: SelectItem[] = [];
  // --- for get the selected BranchesForSurvey
  //selectedBranchesForSurvey : any[] =[];
  // --- for get the S\DepartmentForSurvey
  departmentForSurvey: SelectItem[] = [];
  // --- for get the selected departmentForSurvey
  //selecteddepartmentForSurvey : any[] =[];
  // --- this is for departmentsForbranch array
  departmentsForbranchMap: any[];
  depForBranchMain: any[] = [];
  // --- this is for get departmentId and branchId object for ecach department
  selectedSelectionTypeObject: any[] = [];

  // hideGagusAddButton: boolean = false;
  errorMassege: boolean = false;

  multiselectBranch: SelectItem[];
  multiselectDepartment: SelectItem[];
  //multiselectBranch: SelectItem[];

  selectedSelectionTypeObjectForSbdRelation: SbdRelation[] = [];




  //selectedCompanyId: string;
  gaugeTitle: GaugeTitle[] = [];
  index: number = 0;
  survey: Survey;
  // --- this is a commen boject for select branch ,department, department of branches
  sbdRelation: SbdRelation[] = [];

  //startDate: Date;
  //endDate: Date;
  selectionType: string;
  currentdDate: Date = new Date();
  minDateOfendDate: Date;
  SelectedStartDate: Date;
  SelectedEndDate: Date;
  gaugeTitles: FormArray;
  title: any;
  surveyConverterForGaugeTitle: SurveyConverterForGaugeTitle;
  //disableNextButton: boolean = false;
  formValid: boolean = false;
  viewErrormassege: boolean = false;
  dateSelectionValidMessege: boolean = false;
  selectionTypeErrorMasses: boolean = false;
  viewSelectionType: boolean = false;
  gaugeTitleForPrevie: any;
  gaugePriview: any;
  // ---gaugeTitleWeightedAvg: GaugeTitleWeightedAvg[];
  gaugeTitleWeightedAvg: any[] = [];
  @ViewChild("whiteLabel") whiteLabel: ElementRef;
  modalRef_gaugePreview: BsModalRef;
  colorWhiteLable: string;
  colorSurveyName: string;
  colorTitle: string;
  background: string;
  surveyName: string;
  colorListArray: string;
  coloreList: Color;
  applyColorForAll: boolean = false;


  constructor(
    private surveyService: ServeyService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    public toastr: ToastrManager,
    private datePipe: DatePipe,
    private keyValuePipe: KeyValuePipe,
    private gaugeTileService: GaugeTitleService,
    private afStorage: AngularFireStorage,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    const date = new Date().setHours(2);
    this.getAccessToCreateSurvey(this.assignDeptTOBranch);
    this.surveyCreateform = this.formBuilder.group({
      surveyFor: ["", Validators.required],
      name: ["", Validators.required], 
      description: ["", Validators.required],
      surveyTypes: ["", Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(new Date().setHours(new Date().getHours() + 2)), Validators.required],
      gaugeTitles: this.formBuilder.array([this.setWeight()])
    });
    // , { validator: this.myValidator }
    // --- Get the whole participants of survey

    this.surveyService.getSurveyfor().pipe(untilDestroyed(this)).subscribe(data => {
      this.surveyForList = data;
    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    });

    // --- Get the whole selection types of survey
    this.surveyService.getSelectionType().pipe(untilDestroyed(this)).subscribe(data => {
      const surveyType: any[] = [];

      // --- To show in lable of p-dropdown, just create a key 'type' and put it in optionLabel
      data.forEach(element => {
        surveyType.push({ 'type': element });
      });
      this.selectionTypes = surveyType;
    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    });


    // --- Get the whole survey types of survey
    this.surveyService.getSurveyTypes().pipe(untilDestroyed(this)).subscribe(data => {
      this.surveyTypes = data;
    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    });


    this.surveyService.getGaugeTitle(this.assignDeptTOBranchId).pipe(untilDestroyed(this)).subscribe(data => {
      this.gaugeTitle = data;
    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    })
  }




  getAccessToCreateSurvey(assignDeptTOBranch: DepToBranch) {
    this.surveyService.surveyCreateAccess(this.assignDeptTOBranch).subscribe(data => {
      console.log("access *************", data);
      if (!data) {
        this.surveyCreateform.disable();
      } else {
        this.surveyCreateform.enable();
      }
    }, err => {
      console.log("aaaaaaaaaaaaaa", err);
    });

  }
  get f() {
    return this.surveyCreateform.controls;
  }

  // ---another formGroup inside main formGroup, that is use to group title and weight
  setWeight() {
    return this.formBuilder.group({
      gaugeTitle: ["", Validators.required],
      weight: ["", Validators.required],
      allColors: this.formBuilder.group({
        colorWhiteLable: ['#ffffff'],
        colorSurveyName: ['#ffffff'],
        colorTitle: ['#ffd34e'],
        background: ['#27abf0']
      })
    });
  }

  // ---When user enter weight for gauge title, validate that sum valiue of input to 100
  myValidator() {
    //var group: FormGroup
    let sum: number = 0;
    for (let a of (<FormArray>this.surveyCreateform.get('gaugeTitles')).value) {
      sum += parseInt(a.weight);
    }

    // return sum > 100 ? { notValid: true } : null
    return sum > 100 ? true : false;
  }

  findPointOfhundernd() {
    let sum: number = 0;
    for (let a of (<FormArray>this.surveyCreateform.get('gaugeTitles')).value) {
      sum += parseInt(a.weight);
    }


    return sum === 100 ? true : false;
  }


  // ---Remove gaugeTile and weight when click (-) button
  removeRow(index) {
    //this.hideGagusAddButton = false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.errorMassege) {
          this.errorMassege = false;
        }
        (<FormArray>this.surveyCreateform.get("gaugeTitles")).removeAt(index);
        //this.surveyCreateform.controls.gaugeTitles['controls'].splice(index, 1);
        this.toastr.successToastr("Success", "Data is removed", { position: "bottom-right", animate: "slideFromBottom" });

      },
      reject: () => {

      }
    });
  }

  // ---when click a gaugeTitle get that selected gaugeTitle
  // filterGaugeTitle(gaugeTitle: GaugeTitle) {

  //   this.title = gaugeTitle;
  // }

  // ---add new element to gaugeTitles formArray
  addWeightToTitle(index) {

    // var colorList=[];
    // colorList.push({
    //   colorWhiteLable:this.colorWhiteLable,
    //   colorSurveyName:this.colorSurveyName,
    //   colorTitle:this.colorTitle,
    //   background:this.background              

    // })


    // this.colorListArray = JSON.stringify(colorList).replace(/\[/g, "").replace(/\"/g, "").replace(/\]/g, "");

    // ---check whether that user fild all required field befor add new field
    // if ((<FormArray>this.surveyCreateform.get('gaugeTitles')).controls[this.index].invalid) {
    if ((<FormArray>this.surveyCreateform.get('gaugeTitles')).invalid) {
      this.toastr.errorToastr("Please fill all required fields", "Error", { position: "bottom-right", animate: "slideFromBottom" });
      return;


    }
    // ---check whether that sum value is less than or equal to 100
    if (this.myValidator()) {
      this.index = index;
      this.errorMassege = true;
      this.toastr.errorToastr("Max sum allowed is 100!", "Error", { position: "bottom-right", animate: "slideFromBottom" });
      return;
    }

    if (this.findPointOfhundernd()) {

      if (this.errorMassege) {
        this.errorMassege = false;
      }
      // --- get surveyCreateform gaugetitle as array 
      this.gaugeTitles = this.surveyCreateform.get('gaugeTitles') as FormArray;
    }
    else {
      if (this.errorMassege) {
        this.errorMassege = false;
      }
      // --- get surveyCreateform gaugetitle as array 
      this.gaugeTitles = this.surveyCreateform.get('gaugeTitles') as FormArray;
      this.gaugeTitles.push(this.setWeight());


    }



  }

  gaugevalidation() {
    if ((<FormArray>this.surveyCreateform.get('gaugeTitles')).invalid) {
      this.toastr.errorToastr("Please fill all required fields", "Error", { position: "bottom-right", animate: "slideFromBottom" });
      return true;
    } else {
      return false;
    }
  }

  onChangeGaugeTitle(gaugeTitle: GaugeTitle) {
    this.gaugeTitleForPrevie = gaugeTitle;
  }

  // --- find the validation errors when survey type changes
  onselectedSurveyType(survayType: any) {
    this.selectedSurveyType = survayType.name;
    this.surveyCreateform.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      this.surveyCreateformValid = this.surveyCreateform.valid;

    });
  }

  onSelectedStartDate(value) {
    this.minDateOfendDate = new Date(value);
    //this.minDateOfendDate = new Date(this.minDateOfendDate.setHours(new Date(this.minDateOfendDate).getHours() + 2));

  }

  onSelectedEndDate() {
    const stDate: Date = new Date(this.surveyCreateform.get('startDate').value);
    // --- find start date is greterthan end date
    if (new Date(stDate.setHours(stDate.getHours() + 2)).getTime() > new Date(this.surveyCreateform.get('endDate').value).getTime()) {

      this.dateSelectionValidMessege = true;

    } else {

      this.dateSelectionValidMessege = false;

    }


  }


  onSelectSelectionType(value: any) {
    this.selectionTypeErrorMasses = false;
    this.selectedSelectionTypes = value.type;
    console.log("this.selectedSurveyType", this.selectedSurveyType)
    if (this.selectedSurveyType !== "gauges" && this.selectedSurveyType != undefined) {
      this.surveyCreateform.removeControl('gaugeTitles');

    }

    if (this.selectedSelectionTypes === "company") {
      this.branchesForSurvey = [];
      this.departmentForSurvey = [];
      this.depForBranchMain = [];
      this.selectedSelectionTypeObject.push(this.companyId);
      this.formValidation();
    }

    if (this.selectedSelectionTypes === "branch") {
      this.branchesForSurvey = [];
      this.departmentForSurvey = [];
      this.depForBranchMain = [];
      this.surveyService.getBranchesForSurvey(this.companyId, this.selectedSurveyType).subscribe(data => {

        const branchs: any[] = data;
        branchs.forEach(branch => {

          this.branchesForSurvey.push({ label: branch.name, value: branch });
        });


      }, err => {
        this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
      })

    }

    if (this.selectedSelectionTypes === "department") {
      this.branchesForSurvey = [];
      this.departmentForSurvey = [];
      this.depForBranchMain = [];

      this.surveyService.getDepartmentsForSurvey(this.companyId, this.selectedSurveyType).pipe(untilDestroyed(this)).subscribe(data => {

        const departments: any[] = data;
        departments.forEach(department => {

          this.departmentForSurvey.push({ label: department.name, value: department });
        });

        //  this.departmentForSurvey = data;
        console.log("department", data);
      }, err => {
        this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
      })

    }

    if (this.selectedSelectionTypes === "select_department_in_branches") {
      this.branchesForSurvey = [];
      this.departmentForSurvey = [];
      this.depForBranchMain = [];
      this.surveyService.getDepartmentsInBranchForSurvey(this.companyId).subscribe(data => {
        console.log("dep in branches", data);
        this.departmentsForbranchMap = this.keyValuePipe.transform(data);

        this.departmentsForbranchMap.forEach(data => {

          const depForBranch = new DepForBranchMulltySelect();
          depForBranch.branchName = data.value[0].baranchName;
          data.value.forEach(res => {
            depForBranch.departmentMulty.push({ label: res.departmentName, value: res })
          })

          this.depForBranchMain.push(depForBranch);

        })
        // console.log("assdfds fsdf ",data)
        // // --- this is for get the select_department_in_branches object without dublicate branchId
        // const branch: any[] = [];
        // // --- remove du
        // for (let index = 0; index < data.length; index++) {
        //   if (branch.findIndex(branch => branch.branchId === data[index].branchId) === -1) {
        //     branch.push(data[index]);
        //   }
        // }


        // // --- this is for create  departmentsForbranch array
        // for (let bIndex = 0; bIndex < branch.length; bIndex++) {
        //   const dfb: any[] = [];
        //   for (let dIndex = 0; dIndex < data.length; dIndex++) {
        //     if (data[dIndex].branchId === branch[bIndex].branchId) {
        //       dfb.push(data[dIndex]);
        //     }
        //   }

        //   this.departmentsForbranch[bIndex] = {
        //     branch: branch[bIndex],
        //     departments: dfb
        //   }

        // }

      }, err => {
        this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
      })

    }

  }




  onChangeBranch(branchArray: any) {

    //this.selectedSelectionTypeObject = branchArray
    this.selectedSelectionTypeObject = [];
    branchArray.forEach(branch => {
      this.selectedSelectionTypeObject.push(branch.id);
    });
    console.log("@@@@@@@@@", this.selectedSelectionTypeObject);
    this.formValidation();
    // if (event.target.checked) {
    //   this.selectedSelectionTypeObject.push(branch.id);
    // }
    // else {

    //   const index = this.selectedSelectionTypeObject.findIndex(element => element === branch.id);
    //   if (index > -1) {
    //     this.selectedSelectionTypeObject.splice(index, 1);
    //   }

    // }
    // this.formValidation();


  }


  onChangeDepartment(departmentArray: any) {
    this.selectedSelectionTypeObject = [];
    departmentArray.forEach(department => {
      this.selectedSelectionTypeObject.push(department.id);
    });
    console.log("@@@@@@@@@", this.selectedSelectionTypeObject);
    this.formValidation();
    // if (value.target.checked) {
    //   this.selectedSelectionTypeObject.push(department.id);
    // }
    // else {
    //   const index = this.selectedSelectionTypeObject.findIndex(element => element === department.id);
    //   if (index > -1) {
    //     this.selectedSelectionTypeObject.splice(index, 1);
    //   }

    // }


  }



  onChangeDOfB(value: any[], togleitem: any) {

    console.log("branch id ++++++++++++++++", value);
    console.log("branch id ++++++++++++++++", togleitem);


    if (value.length > 0) {
      this.selectedSelectionTypeObjectForSbdRelation = this.selectedSelectionTypeObjectForSbdRelation.filter(element => element.id[0] !== togleitem.branchId)
      value.forEach(data => {


        const DodB: SbdRelation = {
          selectionType: "",
          id: [],
          depId: []
        };

        DodB.selectionType = this.selectedSelectionTypes;
        DodB.id.push(data.branchId);
        DodB.depId.push(data.departmentId);

        this.selectedSelectionTypeObjectForSbdRelation.push(DodB);

        // }


      })
    } else {
      this.selectedSelectionTypeObjectForSbdRelation = this.selectedSelectionTypeObjectForSbdRelation.filter(element => element.id[0] !== togleitem.branchId)
    }
    console.log("department  id", this.selectedSelectionTypeObjectForSbdRelation);
    //   if (value.target.checked) {
    //     const DodB: SbdRelation = {
    //       selectionType: "",
    //       id: [],
    //       depId: []
    //     }

    //     DodB.selectionType = this.selectedSelectionTypes;
    //     DodB.id.push(branchId);
    //     DodB.depId.push(departmentId);


    //     this.selectedSelectionTypeObjectForSbdRelation.push(DodB);
    //   }
    //   else {

    //     const index = this.selectedSelectionTypeObjectForSbdRelation.findIndex(element => element.id[0] === branchId && element.depId[0] === departmentId);
    //     if (index > -1) {
    //       this.selectedSelectionTypeObjectForSbdRelation.splice(index, 1);
    //     }

    //   }

    this.formValidationForonChangeDOfB();
  }

  //   this.formValidationForonChangeDOfB();
  // }

  formValidation() {
    console.log("/////////////", this.selectedSelectionTypeObject);
    this.formValid = this.surveyCreateform.invalid || this.selectedSelectionTypeObject.length === 0 ? false : true;
    if (this.formValid) {
      this.viewErrormassege = false;
    } else {
      this.viewErrormassege = true;
    }
  }

  formValidationForonChangeDOfB() {

    this.formValid = this.surveyCreateform.invalid || this.selectedSelectionTypeObjectForSbdRelation.length === 0 ? false : true;
    if (this.formValid) {
      this.viewErrormassege = true;
    }
  }

  changeSurveyFor() {
    if (this.surveyCreateform.get('surveyFor').value === "employee") {

    } else {

      this.formValid = true;
    }
  }
  onNext() {
    // if(this.surveyCreateform.invalid){
    //  // this.disableNextButton = true;
    //  return;
    // }
    ValidateFields(this.surveyCreateform)
    this.formValidation();
    this.formValidationForonChangeDOfB();

    if (this.dateSelectionValidMessege) {
      // this.viewErrormassege = true;

      return;

    }

    this.selectionTypeErrorMasses = this.selectionType == null ? true : false;

    if (this.selectedSurveyType !== "gauges") {
      // this.surveyCreateform.removeControl('gaugeTitles');


    } else {

    }

    this.survey = new Survey();
    this.survey.surveyFor = this.surveyCreateform.get('surveyFor').value;
    this.survey.assignDeptToBranch = (JSON.parse(localStorage.getItem('currentUser'))).assignDeptToBranch;
    this.survey.name = this.surveyCreateform.get('name').value;
    this.survey.description = this.surveyCreateform.get('description').value;
    this.survey.surveyType = this.surveyCreateform.get('surveyTypes').value;
    this.survey.startDateTime = this.datePipe.transform(this.surveyCreateform.get('startDate').value, "yyyy-MM-dd hh:mm:ss")
    this.survey.endDateTime = this.datePipe.transform(this.surveyCreateform.get('endDate').value, "yyyy-MM-dd hh:mm:ss")


    this.survey.createdDate = this.datePipe.transform(new Date(), "yyyy-MM-dd hh:mm:ss")
    // ---  if 

    this.survey.selectionType = this.selectedSelectionTypes;

    this.survey.createUser = (JSON.parse(localStorage.getItem('currentUser'))).role;

    // --- create sbdRelationObject when select SelectionTypes as epartment,branch and comapny
    if (this.selectedSelectionTypes === "department" || this.selectedSelectionTypes === "branch" || this.selectedSelectionTypes === "company") {

      const tempSbdRelation = {
        selectionType: this.selectedSelectionTypes,
        id: this.selectedSelectionTypeObject
      }

      this.sbdRelation.push(tempSbdRelation);

    }

    if (this.selectedSelectionTypes === "select_department_in_branches") {
      this.sbdRelation = this.selectedSelectionTypeObjectForSbdRelation;
    }

    // ---Save survey, If survey type = gauges
    if (this.selectedSurveyType === "gauges") {

      if (!this.findPointOfhundernd() || this.gaugevalidation()) {


        this.errorMassege = !this.findPointOfhundernd() ? true : false;
        return;

      }



      this.survey.wightLable = this.whiteLabel.nativeElement.value;
      this.gaugeTitleWeightedAvg = JSON.parse(JSON.stringify(this.surveyCreateform.get('gaugeTitles').value))
      this.surveyConverterForGaugeTitle = new SurveyConverterForGaugeTitle();
      this.surveyConverterForGaugeTitle.survey = this.survey;
      this.surveyConverterForGaugeTitle.sbdRelation = this.sbdRelation;
      this.surveyConverterForGaugeTitle.gaugeTitleWeightedAvg = this.gaugeTitleWeightedAvg;

      this.surveyService.saveSurveyForGauge(this.surveyConverterForGaugeTitle).pipe(untilDestroyed(this)).subscribe(data => {
        this.toastr.successToastr("Success", "Data is saved", { position: "bottom-right", animate: "slideFromBottom" });
      }, err => {

        this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
      })
    } else {
      const survey = { 'survey': this.survey, 'sbdRelation': this.sbdRelation }
      this.surveyService._setSurveyObject.next(survey);
      //this.surveyService._setSelectedSelectionTypeObject.next(this.SbdRelation);
    }


  }

  // validateAllFormFields(formGroup: FormGroup) {
  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);
  //     if (control instanceof FormControl) {
  //       control.markAsTouched({ onlySelf: true });
  //     } else if (control instanceof FormGroup) {
  //       this.validateAllFormFields(control);
  //     }
  //   });
  // }

  isFieldValid(field: string) {
    return !this.surveyCreateform.get(field).valid && this.surveyCreateform.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

  // ---preview gauge UI
  previewGauge(previewGauge, gaugeTitleForPrevie) {


    this.openModalpreviewGauge(previewGauge);


    this.gaugeTileService.findGaugeTitleById(gaugeTitleForPrevie.id).pipe(untilDestroyed(this)).subscribe(data => {

      this.gaugePriview = data;


    }, err => {
      this.toastr.errorToastr(err.error.details, "Error", { position: "bottom-right", animate: "slideFromBottom" });
    })

  }

  openModalpreviewGauge(template: TemplateRef<any>) {
    this.modalRef_gaugePreview = this.modalService.show(template, { class: "modal-sm side-container" });
  }

  onReset() {
    this.surveyCreateform.reset();

  }

  resetColor(index) {

    let _FAgaugeTitles = this.surveyCreateform.get('gaugeTitles') as FormArray;
    let _FGallColors = _FAgaugeTitles.at(index).get('allColors') as FormGroup;
    _FGallColors.get('background').patchValue('#27abf0');
    _FGallColors.get('colorWhiteLable').patchValue('#ffffff');
    _FGallColors.get('colorSurveyName').patchValue('#ffffff');
    _FGallColors.get('colorTitle').patchValue('#ffd34e');
  }

  applyAll(index) {
    this.applyColorForAll = true;
    this.coloreList = new Color();

    this.coloreList.background = this.surveyCreateform.get('gaugeTitles').value[index].allColors.background;
    this.coloreList.colorSurveyName = this.surveyCreateform.get('gaugeTitles').value[index].allColors.colorSurveyName;
    this.coloreList.colorWhiteLable = this.surveyCreateform.get('gaugeTitles').value[index].allColors.colorWhiteLable;
    this.coloreList.colorTitle = this.surveyCreateform.get('gaugeTitles').value[index].allColors.colorTitle;


    if (this.gaugeTitles != undefined) {
      for (let i = 0; i < this.gaugeTitles.length; i++) {

        // ---get patch value from apply all
        let _FAgaugeTitles = this.surveyCreateform.get('gaugeTitles') as FormArray;
        let _FGallColors = _FAgaugeTitles.at(i).get('allColors') as FormGroup;
        _FGallColors.get('background').patchValue(this.coloreList.background);
        _FGallColors.get('colorWhiteLable').patchValue(this.coloreList.colorWhiteLable);
        _FGallColors.get('colorSurveyName').patchValue(this.coloreList.colorSurveyName);
        _FGallColors.get('colorTitle').patchValue(this.coloreList.colorTitle);
      }

    }
  }

  ngOnDestroy() {

  }



}

export class DepForBranchMulltySelect {
  branchName: string;
  departmentMulty: SelectItem[] = [];
}