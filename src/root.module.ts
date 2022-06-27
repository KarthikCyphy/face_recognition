import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AuthService } from './app-core/auth/auth.service';
import { CommonUiService } from './app-core/services/common-ui.service';
import { LoaderService } from 'src/app-core/services/loader.service';
import { AdminGuard } from './app-core/guard/admin.guard';
import { SecureInnerPagesGuard } from './app-core/guard/SecureInnerPagesGuard.guard';
import { SharedModule } from './app/shared/shared.module';

@NgModule({
  declarations: [
    RootComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RootRoutingModule,
    SharedModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3500,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    AuthService, 
    LoaderService,
    CommonUiService,
    // ApiCommonService,
    AdminGuard, 
    SecureInnerPagesGuard
  ],
  bootstrap: [RootComponent]
})
export class RootModule { }
