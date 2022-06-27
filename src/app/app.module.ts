import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
// import { BaseHttpService } from 'src/app-core/services/base-http.service';
import { CommonUiService } from 'src/app-core/services/common-ui.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3500,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    HttpClientModule,
    AppRoutingModule,
    SharedModule,

  ],
  providers: [
    CommonUiService,
    // ApiCommonService,
    // { provide: HTTP_INTERCEPTORS, useClass: BaseHttpService, multi: true }
  ],
  bootstrap: []
})
export class AppModule { }
