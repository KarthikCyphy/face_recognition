import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LightRoutingModule } from './light-routing.module';
import { LightComponent } from './light.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LightComponent
  ],
  imports: [
    CommonModule,
    LightRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule,
  ]
})
export class LightModule { }
