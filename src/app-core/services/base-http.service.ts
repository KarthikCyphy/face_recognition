import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './../auth/auth.service';
import { CommonConstants } from '../constants/common-constants';

@Injectable()

export class BaseHttpService implements HttpInterceptor {

  // userData: User | null;
  readonly commonConstants: CommonConstants = CommonConstants;

  constructor(
    private router: Router,
    // private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  
}
