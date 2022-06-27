import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GateRoutingModule } from './gate-routing.module';
import { GateComponent } from './gate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    GateComponent
  ],
  imports: [
    CommonModule,
    GateRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule,
  ]
})
export class GateModule { }
