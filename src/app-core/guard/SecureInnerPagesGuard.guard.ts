import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthConstants } from '../../app/config/auth-constants';
import { AuthService } from 'src/app-core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})

export class SecureInnerPagesGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // let user = JSON.parse(unescape(atob(localStorage.getItem(AuthConstants.AUTH))));
        if (this.authService.isLoggedIn) {
            this.router.navigate(['/app/dashboard'])
        }
        return true;
    }
}