import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app-core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app-core/auth/auth.service';
import { LoaderService } from 'src/app-core/services/loader.service';
import { CommonUiService } from 'src/app-core/services/common-ui.service';
import { CommonConstants } from 'src/app-core/constants/common-constants';

@Component({
  selector: 'app-offline-search',
  templateUrl: './offline-search.component.html',
  styleUrls: ['./offline-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbPaginationConfig]
})
export class OfflineSearchComponent implements OnInit {
  
  offlineForm: FormGroup;
  @ViewChild('offlineFormContent') TemplateRef: TemplateRef<any>;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private httpService : HttpService,
    private toastService: ToastrService,
    public authService: AuthService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private commonUiService: CommonUiService,
  ) { }

  offlineListData : any = [];
  offlineFilterTerm: string;
  showDataNotFound: boolean = true;
  filterTerm: string;
  offlineData:any = {};

  pageSize = CommonConstants.dataTableConstant.pageSize;
  page = CommonConstants.dataTableConstant.page;

  imageUrl: string | ArrayBuffer = "assets/images/user/no-user.png";
  fileName: string = "No file selected";
  file: File;

  ngOnInit(): void {
  }

  upload(file: File) {
    setTimeout(() => {
      if (file) {
        this.fileName = file.name;
        this.file = file;
  
        const reader = new FileReader();
        reader.readAsDataURL(file);
  
        reader.onload = event => {
          this.imageUrl = reader.result;
        };
      }
    },500);    
  }

  onResetForm() {
    this.imageUrl = "assets/images/user/no-user.png";
    this.offlineData = {
      "name": "", "address": "", "phoneNumber": "", "gender": "MALE", "photo": ""
    };
    this.offlineForm = this.fb.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}?$')]],
      address: ['', [Validators.required]],
      place: ['', [Validators.required]],
      dob:[]
    });
  }

  openViewOfflineFormModal(content, data:any) {
    this.onResetForm();
    this.modalService.open(content, { size: 'xl', backdrop: 'static', centered: true });
    if(!this.commonUiService.isEmptyObject(data)){
      this.offlineData = data;
      this.imageUrl = data.photo == '' ? "assets/images/user/no-user.png" : data.photo;
    }
  }

  onRowClicked(rowClickedID: any) {
    // this.httpService.post('ccprocurement/getsupplierbyid', { "requestParams" : rowClickedID }).subscribe(
    //   (response: any) => {
    //     if(response.success && response.returnObject){
    //       this.openViewEnrolmentFormModal(this.templateRef, response.returnObject);
    //     }
    //     this.loaderService.hide();
    //   },
    //   (error) => { //error() callback
    //     this.httpService.serverErrorMethod(error);
    // });
  }

  onSubmit() {
    if(this.offlineForm.valid){
      // if(this.supplierData.id == undefined)
      //   this.supplierData['ccId'] = this.authService.userData.procurementUnit.procurementUnitId;

      // this.supplierData.photo = this.imageUrl.toString().includes('no-user.png') ? '' : this.imageUrl.toString();
      // console.log(this.supplierData);

      this.httpService.post('mactchFace', {"requestParams" : this.offlineData}).subscribe(
        (response: any) => {
          if(response.success){
            console.log(response)
            // this.initMethod();
            this.modalService.dismissAll();
            this.toastService.success('Supplier created successfully');
          }else
            this.httpService.serverErrorMethod(response);
          this.loaderService.hide();
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
      });
    }
  };

}
