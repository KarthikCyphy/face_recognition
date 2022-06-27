import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app-core/auth/auth.service';
import { HttpService } from 'src/app-core/services/http.service';
import { LoaderService } from 'src/app-core/services/loader.service';
declare var require
const Swal = require('sweetalert2')

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],    
  encapsulation: ViewEncapsulation.None,
})
export class LightComponent implements OnInit {

  lightForm: FormGroup;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private httpService : HttpService,
    private toastService: ToastrService,
    public authService: AuthService,
    private loaderService: LoaderService,

  ) { 
    if(authService.userData.roles[0] == 'Operator'){
      this.toastService.error('Unauthorised page access.');
      authService.forceLogout();
    }
  }

  lightListData : any = [];
  filterTerm: string;
  typeOfForm: string;
  lightData:any = {};
  showInvalidIP: boolean = true;

  initMethod() {
    this.httpService.post('vvadmin/getalllightcontrollers', {"requestParams" : {}}).subscribe(
      (response: any) => {
        this.lightListData = response.returnObject;
        this.filterTerm = '';
        this.loaderService.hide();
      },
      (error) => { //error() callback
        this.httpService.serverErrorMethod(error);
    });

    this.typeOfForm = 'Add';
    this.lightData = {
      "ipAddress": "", "port": "",
    };
    this.lightForm = this.fb.group({
      ipAddress: ['', [Validators.required,]],
      port: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,4})?$')]],
    });
  }

  ngOnInit(): void {
    this.initMethod();
  } 

  onRowClicked(rowClickedData: any) {
    this.lightData = rowClickedData;
    this.typeOfForm = 'Edit';
  }

  onResetForm() {
    this.initMethod();
  }

  onSubmit() {
    if(this.lightForm.valid){
      // if(this.lightData.id == undefined)
      //   // this.lightData['ccId'] = this.authService.userData.procurementUnit.procurementUnitId;

      this.httpService.post('vvadmin/addorupdatelightcontroller', {"requestParams" : this.lightData}).subscribe(
        async ( response: any) => {
          if(await response.success){
            this.toastService.success(this.lightData.id == undefined ? 'Light Controller created successfully' : 'Light Controller updated successfully');
            this.onResetForm();
          }
          this.loaderService.hide();
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
      });
    }
  };

  onDeleteLight(rowClickedId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete ?',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {      
      if (result.value) {
        this.httpService.post('vvadmin/deletelightcontroller', {"requestParams" : rowClickedId}).subscribe(
          async ( response: any) => {
            if(await response.success){
              this.loaderService.hide();
              Swal.fire(
                'Deleted!',
                'Light Controller has been deleted.',
                'success'
              )
              this.onResetForm();
            }
          },
          (error) => { //error() callback
            this.httpService.serverErrorMethod(error);
        });
      }
    })
  }

  ipCheckKeypress(e: any) {
    var x = 46;

    if (e.which != 8 && e.which != 0 && e.which != x && (e.which < 48 || e.which > 57)) {
      return false;
    }
    // const reg = /^-?\d*(\.\d{0,2})?$/;
    // let input = event.target.value + String.fromCharCode(event.charCode);
 
    // if (!reg.test(input)) {
    //     event.preventDefault();
    // }
  }

  ipCheckKeyup(event: any){
    var pattern = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
    var x = 46;
    var this1 = event.target.value;
    let input = event.target.value + String.fromCharCode(event.charCode);

        if (!pattern.test(input)) {
            // $('#validate_ip').text('Not Valid IP');
            this.showInvalidIP = true;
            while (input.indexOf("..") !== -1) {
                this1.val(input.replace('..', '.'));
            }
            x = 46;
        } else {
            x = 0;
            var lastChar = input.substr(input.length - 1);
            if (lastChar == '.') {
                this1.val(input.slice(0, -1));
            }
            var ip = input.split('.');
            if (ip.length == 4) {
                // $('#validate_ip').text('Valid IP');
                this.showInvalidIP = false;
            }
        }
  }  

  numericalFilter(event: any) {
    const reg = /^-?\d*(\\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
  }

}
