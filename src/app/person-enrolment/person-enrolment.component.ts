import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal,NgbActiveModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstants } from 'src/app-core/constants/common-constants';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpService } from 'src/app-core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app-core/auth/auth.service';
import { LoaderService } from 'src/app-core/services/loader.service';
import { CommonUiService } from 'src/app-core/services/common-ui.service';
import {WebcamImage} from 'ngx-webcam';
import { observeOn } from 'rxjs-compat/operator/observeOn';


@Component({
  selector: 'app-person-enrolment',
  templateUrl: './person-enrolment.component.html',
  styleUrls: ['./person-enrolment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbPaginationConfig]
})
export class PersonEnrolmentComponent implements OnInit {

  enrolmentForm: FormGroup;
  // customPatterns = new CustomPatterns();
  @ViewChild('enrolmentFormContenet') templateRef: TemplateRef<any>;

  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  webCameraContenet: any;

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

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

  enrolmentListData : any = [];
  enrolmentFilterTerm: string;
  showDataNotFound: boolean = true;
  filterTerm: string;
  enrolmentData:any = {};

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
    this.enrolmentData = {
      "name": "", "address": "", "phoneNumber": "", "gender": "MALE", "photo": ""
    };
    this.enrolmentForm = this.fb.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}?$')]],
      address: ['', [Validators.required]],
      place: ['', [Validators.required]],
      dob:[]
    });
  }

  openViewEnrolmentFormModal(content, data:any) {
    this.onResetForm();
    this.modalService.open(content, { size: 'xl', backdrop: 'static', centered: true });
    if(!this.commonUiService.isEmptyObject(data)){
      this.enrolmentData = data;
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
    if(this.enrolmentForm.valid){
      // if(this.supplierData.id == undefined)
      //   this.supplierData['ccId'] = this.authService.userData.procurementUnit.procurementUnitId;

      // this.supplierData.photo = this.imageUrl.toString().includes('no-user.png') ? '' : this.imageUrl.toString();
      // console.log(this.supplierData);

      this.httpService.post('ccprocurement/addorupdatesupplier', {"requestParams" : this.enrolmentData}).subscribe(
        (response: any) => {
          if(response.success){
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

  openWebcameraModal(content, data:any) {
    this.webcamImage = null;
    this.webCameraContenet = this.modalService.open(content, { size: 'lg', backdrop: 'static', centered: true });
    this.webCameraContenet.result.then((result) => {
    }, (reason) => {
    });
  }

  toUseTakenImage(image: any){
    this.imageUrl = image;
    this.webCameraContenet.close();
  }


}
