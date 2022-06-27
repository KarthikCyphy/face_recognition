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
  selector: 'app-gate',
  templateUrl: './gate.component.html',
  styleUrls: ['./gate.component.scss'],  
  encapsulation: ViewEncapsulation.None,

})
export class GateComponent implements OnInit {

  gateForm: FormGroup;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private httpService : HttpService,
    private toastService: ToastrService,
    public authService: AuthService,
    public loaderService: LoaderService,

  ) {
    if(authService.userData.roles[0] == 'Operator'){
      this.toastService.error('Unauthorised page access.');
      authService.forceLogout();
    }
   }

  gateListData : any = [];
  filterTerm: string;
  typeOfForm: string;
  gateData:any = {};

  initMethod() {
    this.httpService.post('vvadmin/getallgates', {"requestParams" : {}}).subscribe(
      (response: any) => {
        this.gateListData = response.returnObject;
        this.filterTerm = '';
        this.loaderService.hide();
      },
      (error) => { //error() callback
        this.httpService.serverErrorMethod(error);
    });

    this.typeOfForm = 'Add';
    this.gateData = {
      "gateName": "", "vehicleVerificationType": "",
    };
    this.gateForm = this.fb.group({
      gateName: ['', [Validators.required]],
      vehicleVerificationType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initMethod();
  }  

  onRowClicked(rowClickedData: any) {
    this.gateData = rowClickedData;
    this.typeOfForm = 'Edit';
  }

  onResetForm() {
    this.initMethod();
  }

  onSubmit() {
    if(this.gateForm.valid){
      // if(this.gateData.id == undefined)
      //   // this.gateData['ccId'] = this.authService.userData.procurementUnit.procurementUnitId;
      this.httpService.post('vvadmin/addorupdategate', {"requestParams" : this.gateData}).subscribe(
        async ( response: any) => {
          if(await response.success){
            this.toastService.success(this.gateData.id == undefined ? 'Gate created successfully' : 'Gate updated successfully');
            this.onResetForm();
          }
          this.loaderService.hide();
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
      });
    }
  };

  onDeleteGate(rowClickedId: string) {
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
        this.httpService.post('vvadmin/deletegate', {"requestParams" : rowClickedId}).subscribe(
          async ( response: any) => {
            if(await response.success){
              this.loaderService.hide();
              Swal.fire(
                'Deleted!',
                'Gate has been deleted.',
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

}
