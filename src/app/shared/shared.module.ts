import { OnClickHighlightDirective } from './../directive/on-click-highlight.directive';


import { PageNotFoundComponent } from './../component/page-not-found/page-not-found.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { FilterMinMaxPipe } from './../pipe/filter-min-max.pipe';
import { InputComponentComponent } from './input-component/input-component.component';

import { CalendarModule } from 'primeng/calendar';
import { RatingModule } from 'primeng/rating';
import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';
import { StringToJsonObjectPipe } from './../pipe/string-to-json-object.pipe';
import { SentenceCasePipe } from './../pipe/sentence-case.pipe';
import { ConfirmationService } from 'primeng/api';
import { ErrorDisplayService } from './error-display.service';
import { CamelCasePipe } from "./../pipe/camelCase.pipe";
import { CommonModule} from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { TimeSincePipe } from '../pipe/time-since.pipe';

@NgModule({
  declarations: [
        CamelCasePipe, 
        InputComponentComponent,
        SentenceCasePipe,
        FieldErrorDisplayComponent,
        StringToJsonObjectPipe,
        FilterMinMaxPipe,
        PageNotFoundComponent,
        TimeSincePipe,
        OnClickHighlightDirective
     
    ],
    imports: [
        CommonModule,
        FormsModule,
        RatingModule,
        CalendarModule,
        ReactiveFormsModule, 
        InternationalPhoneNumberModule,
        BsDatepickerModule.forRoot(),
    ],
 
  providers: [
    
    ErrorDisplayService,
    ConfirmationService,
    DropdownModule,  
  ],

  exports: [
      CommonModule,
      RatingModule,
      CalendarModule, 
      CamelCasePipe, 
      DropdownModule, 
      SentenceCasePipe,
      FieldErrorDisplayComponent,
      ReactiveFormsModule, 
      StringToJsonObjectPipe,
      InputComponentComponent,  
      FilterMinMaxPipe,
      InternationalPhoneNumberModule,
      TimeSincePipe,
      BsDatepickerModule,
      OnClickHighlightDirective
    
    ]
    
 
})
export class SharedModule {}
