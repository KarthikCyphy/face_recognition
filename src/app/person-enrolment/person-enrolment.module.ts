import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CountToModule } from 'angular-count-to';

import { PersonEnrolmentRoutingModule } from './person-enrolment-routing.module';
import { PersonEnrolmentComponent } from './person-enrolment.component';
import { SharedModule } from '../shared/shared.module';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  declarations: [
    PersonEnrolmentComponent
  ],
  imports: [
    CommonModule,
    PersonEnrolmentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CountToModule,
    NgbModule,
    SharedModule,
    WebcamModule
  ]
})
export class PersonEnrolmentModule { }
