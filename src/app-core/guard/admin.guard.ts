import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthConstants } from 'src/app/config/auth-constants';
import { AuthService } from 'src/app-core/auth/auth.service';
import { LoaderService } from 'src/app-core/services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    private loaderServices: LoaderService   

  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Guard for user is login or not
    let user = null;
    if(localStorage.getItem(AuthConstants.AUTH) != null)
      user = JSON.parse(unescape(atob(localStorage.getItem(AuthConstants.AUTH))));
    this.authService.userData = user;
    console.log(this.authService.userData)
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/account/login']);
      setTimeout(() =>{
        this.loaderServices.hide();
      },50);
      return true
    }
    return true
  }
}
