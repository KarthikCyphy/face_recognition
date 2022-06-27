import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../app-core/services/http.service';
import { AuthConstants } from '../../app/config/auth-constants';
import { LoaderService } from '../services/loader.service';

declare var require
const Swal = require('sweetalert2')

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userData: any;
  public showLoader: boolean = false;

  constructor(
    public router: Router,
    public ngZone: NgZone,
    private httpService: HttpService,
    private toastService: ToastrService,
    private loaderService: LoaderService,

  ) { }

  get isLoggedIn(): boolean {
    if(localStorage.getItem(AuthConstants.AUTH) != null){
      const user = JSON.parse(unescape(atob(localStorage.getItem(AuthConstants.AUTH))));
      return (user != null) ? true : false;
    }else
      return false    
  }

  login(postData: any) {  
    this.loaderService.show();
    // postData['appName'] = "iUMS";
    let result = {
      "returnStatus": "USER_LOGIN_SUCCESSFULL",
      "returnObject": {
          "userId": "",
          "userIdPk": 41,
          // "companyName": "Dairy farm",
          // "email": "ccincharge1@womenova.com",
          "dob": "08-03-2021",
          "gender": "MALE",
          "state": "Tamil nadu",
          "city": "Chennai",
          "pinNumber": "6257893",
          "mobileNo": "8745123669",
          "lastLogin": 1631600989000,
          "roles": [
              "Admin"
          ],
          "units": [
              {
                  
              }
          ],
          "resources": {
              "MENUS": [
                  {
                      "name": "About",
                      "id": "about",
                      "order": 8,
                      "children": []
                  }
              ],
              "IPADDRESS": []
          },
          "accessToken": "S+WdOmV47P+wdxBWnYf47INjunYc1ha40cYmw5qZsQYV62IBR+zQWEYOnjbR0YCzBlft6lnpefIlGeoNqbFbgqTqkVNBoa3mvSvIG6LXCyKvUWPI3CnQrxktJ7+/APTZ94qWO+lzpzSbN1ccxWQgh8k/icChrj9n8aoUzf/+Dj8=",
          "address": "hydf",
          "userName": ""
      }
    };

    if(postData.loginId == 'admin' && postData.password == 'admin@123'){
      result.returnObject['userName'] = 'Admin';  result.returnObject['roles'] = [ "Admin" ];
      this.afterLogin(result,'home');
    }else if(postData.loginId == 'operator' && postData.password == 'operator@123'){
      result.returnObject['userName'] = 'Operator';
      result.returnObject['roles'] = [ "Operator" ];
      this.afterLogin(result,'dashboard');

    }else
      this.toastService.error('Invalid Credentials');
    this.loaderService.hide();




    // return this.httpService.post('doodadmin/user/login', postData).subscribe((result: any) => {
    //   this.loaderService.hide();
    //   if (result.returnStatus == "USER_LOGIN_SUCCESSFULL") {
    //     const encryptedValue = btoa(escape(JSON.stringify(result.returnObject)));
    //     localStorage.setItem(AuthConstants.AUTH, encryptedValue);
    //     if (result.returnObject.procurementUnit == undefined) {
    //       this.toastService.warning(' No Unit Assigned Please Contact Administrator.');
    //       this.logout();
    //       return;
    //     } else {
    //       this.userData = result.returnObject;
    //       this.ngZone.run(() => {
    //         this.router.navigate(['/app/dashboard']);
    //       });
    //     }
    //   } else {
    //     this.toastService.error(result.message);
    //   }
    // }, (error: any) => {
    //   this.httpService.serverErrorMethod(error);
    // });
  }

  logout() {
    Swal.fire({
      title: 'Are you sure you want to Logout ?',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        localStorage.clear();
        this.router.navigate(['/account/login']);
        // return this.httpService.post('doodadmin/user/logout', {}).subscribe((result: any) => {
        //   this.loaderService.hide();
        //   if (result.message == "Logout Successful" || result.message == "Invalid Access Token") {
        //     localStorage.clear();
        //     this.router.navigate(['/account/login']);
        //   }
        // },
        // (error: any) => {
        //   this.toastService.error(error.error.error);
        //   localStorage.clear();
        //   this.router.navigate(['/account/login']);
        // });
      }
    })
  }

  forceLogout(){
    localStorage.clear();
    this.router.navigate(['/account/login']);
  }

  afterLogin(result: any,url: string){
    const encryptedValue = btoa(escape(JSON.stringify(result.returnObject)));
    localStorage.setItem(AuthConstants.AUTH, encryptedValue);
    this.userData = result;
    this.ngZone.run(() => {
      this.router.navigate(['/app/'+url]);
    });
  }
}
