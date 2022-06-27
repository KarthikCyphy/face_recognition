import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthConstants } from 'src/app/config/auth-constants';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient, 
    private toastService: ToastrService, 
    private loaderService: LoaderService,

  ) { }

  post(serviceName: string, data: any){ 
    if(!serviceName.includes('vvlightcontroller/'))
      this.loaderService.show();
    let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Access-Control-Allow-Origin', '*');
    
    let localData: any;
    if(!serviceName.includes('/user/') || serviceName.includes('logout')){
      localData = JSON.parse(unescape(atob(localStorage.getItem(AuthConstants.AUTH))));
      // headers = headers.append('access_token',localData.accessToken);
    }
    const options = { headers: headers, withCredintials: false };
    if(serviceName.includes('download'))
      options['responseType'] = 'arraybuffer';
    const url = serviceName.includes('irakshan/') ? environment.nodeApiRestUrl + serviceName : environment.apiRestUrl + serviceName;
    
    // if(url.includes('irakshan/')){
    //   if(data.requestParams.id == undefined)  data.requestParams['cb'] = localData.userIdPk;
    //   else data.requestParams['mb'] = localData.userIdPk;
    // }

    return this.http.post(url, JSON.stringify(data), options);
  }

  get(serviceName: string){ 
    this.loaderService.show();
    let localData: any;
    localData = JSON.parse(unescape(atob(localStorage.getItem(AuthConstants.AUTH))));
    
    let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Access-Control-Allow-Origin', '*');
        headers = headers.append('access_token',localData.accessToken);

    const options = { headers: headers, withCredintials: false };
    const url = environment.apiRestUrl + serviceName;
    
    return this.http.get(url, options);
  }

  serverErrorMethod(error: any) {
    if(error.status == 0)
      this.toastService.error('Server not found');
    else
      this.toastService.error(error.error.error);
    this.loaderService.hide();
  }
}
