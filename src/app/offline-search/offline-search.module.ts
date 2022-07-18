import { OfflineSearchComponent } from './offline-search.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CountToModule } from 'angular-count-to';

import { OfflineSearchRoutingModule } from './offline-search-routing.module';
import { SharedModule } from '../shared/shared.module';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  declarations: [OfflineSearchComponent],
  imports: [
    CommonModule,
    OfflineSearchRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CountToModule,
    NgbModule,
    SharedModule,
    WebcamModule
  ]
})
export class OfflineSearchModule { }
