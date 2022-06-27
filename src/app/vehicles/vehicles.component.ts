import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import * as moment from 'moment';

import { AuthService } from 'src/app-core/auth/auth.service';
import { CommonUiService } from 'src/app-core/services/common-ui.service';
import { CommonConstants } from 'src/app-core/constants/common-constants';
import { HttpService } from 'src/app-core/services/http.service';
import { LoaderService } from 'src/app-core/services/loader.service';
import { Message } from 'src/app/dashboard/dashboard.component';

declare var require
const Swal = require('sweetalert2')
// import * as _ from 'lodash';
import 'lodash';
declare var _:any;

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VehiclesComponent implements OnInit, OnDestroy {

  componentSubscriptions: Subscription = new Subscription();
  public messages: Subject<Message>;

  vehicleForm: FormGroup;

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private httpService: HttpService,
    private toastService: ToastrService,
    public authService: AuthService,
    private modalService: NgbModal,
    private commonUIComponent: CommonUiService,
    private loaderService: LoaderService,
    config: NgbPaginationConfig,
    private calendar: NgbCalendar,

  ) {
    if (authService.userData.roles[0] == 'Operator') {
      this.toastService.error('Unauthorised page access.');
      authService.forceLogout();
    }

    config.size = 'sm';
    config.boundaryLinks = true;

    // let currentTime = moment(new Date()).format('HH:mm');
    // this.formTime = {hour: parseInt(currentTime.split(":")[0]), minute: parseInt(currentTime.split(":")[1])}
    // this.toTime = {hour: parseInt(currentTime.split(":")[0]), minute: parseInt(currentTime.split(":")[1])}
    // this.formTime = {hour: parseInt('00'), minute: parseInt('00')};
    // this.toTime = {hour: parseInt('23'), minute: parseInt('59')};
    
    this.today = calendar.getToday();
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);
  }

  pageSize = CommonConstants.dataTableConstant.pageSize;
  page = CommonConstants.dataTableConstant.page;

  showDatepicker: boolean = false;
  date: { year: number, month: number, time: number };
  // formTime: {hour: number, minute: number};  
  // toTime: {hour: number, minute: number};  
  hoveredDate: NgbDate;
  today: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  selectedDate: any = {};
  selectedTypeofList: string;


  vehiclesListData: any = [];
  vehiclesFilterTerm: string;
  typeOfForm: string;
  vehiclesData: any = {};

  vehicleMovementList: any = [];
  selectedVehicleInfo: any = {};
  vehiclesMovementFilterTerm: string;

  // For download PDF
  title = 'Vehicle List';
  head = [['S.NO', 'Vehicle Number', 'Owner Name', 'Address', 'Type', 'Category', 'Listing Type']];
  data = [];
  currentDateandTime: any = {'date': '', 'time': ''};

  // For download PDF to movement
  movementTitle = 'Vehicle Movement List';
  movementHead = [['Gate Name', 'Owner Name', 'Vehicle Number', 'Vehicle Type', 'Date & Time', 'Verification Type', 'Entry Statu', 'Listing Type']];
  movementData = [];

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    if(this.fromDate != null && this.toDate != null){
      this.showDatepicker = false;
      this.getListMovements('byDate');
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  dateFormater(event:any) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = day + "-" + month + "-" + year;
    return finalDate;
  }

  onClickTypeChange(type: string) {
    this.vehicleMovementList = [];
    this.selectedDate = {};
    if(type == 'todays')
      this.getListMovements(type);
    else
      this.fromDate = null; this.toDate = null;
  }

  initMethod() {    
    this.vehiclesListData = [];
    this.httpService.post('vvadmin/getallvehicles', { "requestParams": {} }).subscribe(
      async ( response: any) => {
        if(await response.success){ 
          this.vehiclesListData = response.returnObject;
          this.vehiclesFilterTerm = '';
          let tempArr =[];
          _.cloneDeep(response.returnObject).forEach((value,key) => {
            const data = {
              's.no': key+1,
              'vehicleNumber': value.vehicleNumber, 
              'ownerName': value.ownerName,
              'address': value.address, 
              'vehicleType': value.vehicleType, 
              'vehicleCategory': value.vehicleCategory, 
              'vehicleListingType': value.vehicleListingType, 
            }
            tempArr.push(data);
            if(key == response.returnObject.length -1)
              this.data = this.commonUIComponent.convertDataToDownloadPDF(_.cloneDeep(tempArr));
          });
        }
        this.loaderService.hide();
      },
      (error) => { //error() callback
        this.httpService.serverErrorMethod(error);
      });

    this.typeOfForm = 'Add';
    this.vehiclesData = {
      "vehicleNumber": "", "vehicleType": "", "ownerName": "", "address": "",
      "vehicleCategory": "", "vehicleListingType": "",
    };
    this.vehicleForm = this.fb.group({
      vehicleNumber: ['', [Validators.required]],
      vehicleType: ['', [Validators.required]],
      ownerName: ['',],
      address: ['',],
      vehicleCategory: ['', [Validators.required]],
      vehicleListingType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.componentSubscriptions.add(this.commonUIComponent.getSideNavToggleValue.subscribe((data: any) => {
      if (!this.commonUIComponent.isEmptyObject(data)) {
        this.vehiclesListData = data.returnObject;
        this.vehiclesFilterTerm = '';
        let tempArr =[];
        _.cloneDeep(this.vehiclesListData).forEach((value,key) => {
          const data = {
            's.no': key+1,
            'vehicleNumber': value.vehicleNumber, 
            'ownerName': value.ownerName,
            'address': value.address, 
            'vehicleType': value.vehicleType, 
            'vehicleCategory': value.vehicleCategory, 
            'vehicleListingType': value.vehicleListingType, 
          }
          tempArr.push(data);
          if(key == this.vehiclesListData.length -1)
            this.data = this.commonUIComponent.convertDataToDownloadPDF(_.cloneDeep(tempArr));
        });   
      } else {
        this.initMethod();
      }
    }));

    this.currentDateandTime.date = this.dateFormater(this.today);
  }

  onRowClicked(rowClickedData: any) {
    console.log(rowClickedData)
    this.vehiclesData = rowClickedData;
    this.typeOfForm = 'Edit';
  }

  onResetForm() {
    this.initMethod();
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      this.vehiclesData.vehicleNumber = this.commonUIComponent.rawVehicleNumberFormatte(this.vehiclesData.vehicleNumber);
      this.httpService.post('vvadmin/addorupdatevehicle', { "requestParams": this.vehiclesData }).subscribe(
        (response: any) => {
          if (response.success) {
            this.toastService.success(this.vehiclesData.id == undefined ? 'Vehicle created successfully' : 'Vehicle updated successfully');
            this.onResetForm();
            this.loaderService.hide();
          }
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
        });
    }
  };

  onVehicleMovement(content, vehicleNumber: string, vehicleType: string, ownerName: string) {
    this.selectedTypeofList = 'todays';    
    this.selectedVehicleInfo = { 'vehicleNumber' : vehicleNumber, 'vehicleType': vehicleType ,'ownerName': ownerName  };    
    this.modalService.open(content, { size: 'xl', backdrop: 'static', centered: true });
    this.getListMovements(this.selectedTypeofList);
  }  

  getListMovements(type: string) {
    if(type == 'todays'){
      this.fromDate = null; this.toDate = null;
      this.httpService.post('vvadmin/getvehiclemovmentdetailsforvehiclenumber', { "requestParams": this.commonUIComponent.rawVehicleNumberFormatte(this.selectedVehicleInfo.vehicleNumber) }).subscribe(
        (response: any) => {
          this.vehicleMovementList = response.returnObject;
          this.vehiclesMovementFilterTerm = '';   
          let tempArr =[];
          _.cloneDeep(response.returnObject).forEach((value,key) => {
            const data = {
              'gateName': value.gate.gateName,
              'ownerName': value.vehicleDetails != undefined ? value.vehicleDetails.ownerName : '',
              'vehicleNumber': value.vehicleNumber, 
              'vehicleType': value.vehicleType, 
              'time': moment(value.time).format('DD-MM-YYYY HH:mm'),
              'vehicleVerificationType': value.gate.vehicleVerificationType,
              'vehicleEntryStatus': value.vehicleEntryStatus, 
              'vehicleListingType': value.vehicleListingType, 
            }
            tempArr.push(data);
            if(key == response.returnObject.length -1)
              this.movementData = this.commonUIComponent.convertDataToDownloadPDF(_.cloneDeep(tempArr));
          });            
          this.loaderService.hide();
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
      });
    }else{
      if(this.fromDate != null && this.toDate != null){
        this.selectedDate = {};
        const inputData = {
          "vehicleNumber": this.commonUIComponent.rawVehicleNumberFormatte(this.selectedVehicleInfo.vehicleNumber),
          "fromDateTime": this.dateFormater(this.fromDate) + " 00:00:00",
          "toDateTime": this.dateFormater(this.toDate) + " 23:59:59"
        };
        this.selectedDate = { 'fromDate': this.dateFormater(this.fromDate), "toDate": this.dateFormater(this.toDate)  };
        this.httpService.post('vvadmin/getvehiclemovmentdetailsforvehiclenumberbetweendates', { "requestParams": inputData }).subscribe(
          (response: any) => {
            this.vehicleMovementList = response.returnObject; 
            this.vehiclesMovementFilterTerm = '';
            let tempArr =[];
            _.cloneDeep(response.returnObject).forEach((value,key) => {
              const data = {
                'gateName': value.gate.gateName,
                'ownerName': value.vehicleDetails != undefined ? value.vehicleDetails.ownerName : '',
                'vehicleNumber': value.vehicleNumber, 
                'vehicleType': value.vehicleType, 
                'time': moment(value.time).format('DD-MM-YYYY HH:mm'),
                'vehicleVerificationType': value.gate.vehicleVerificationType,
                'vehicleEntryStatus': value.vehicleEntryStatus, 
                'vehicleListingType': value.vehicleListingType, 
              }
              tempArr.push(data);
              if(key == response.returnObject.length -1)
                this.movementData = this.commonUIComponent.convertDataToDownloadPDF(_.cloneDeep(tempArr));
            });       
            this.loaderService.hide();
          },
          (error) => { //error() callback
            this.httpService.serverErrorMethod(error);
        });
      }
    }
  }

  openSnapshotModal(content, imagePath: string) {
    this.httpService.post('irakshan/fetchimage', {"requestParams" : { 'imageFilePath': imagePath }}).subscribe(
      (response: any) => {
        this.modalService.open(content, { size: 'lg', backdrop: 'static', centered: true });
        this.selectedVehicleInfo.imagePath = response.returnObject;
        this.loaderService.hide();
      },
      (error) => { //error() callback
        this.httpService.serverErrorMethod(error);
    });
  }
  
  downloadDataAsPdf() {
    this.loaderService.show();
    this.loaderService.sendLoadingText(CommonConstants.loaderMessages.loaderDisplayTextForDownload);
    setTimeout(()=>{
      return new Promise(async resolve =>{
        var doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(this.title, 11, 8);
        doc.setFontSize(11);
        doc.setTextColor(100);

        (doc as any).autoTable({
          head: this.head,
          body: this.data,
          theme: 'plain',
          didDrawCell: data => {
            // console.log(data.column.index)
          }
        })

        // below line for Open PDF document in new tab
        // doc.output('dataurlnewwindow')

        // below line for Download PDF document  
        doc.save(this.title +'.pdf');
        setTimeout(()=>{
          this.loaderService.hide();
          resolve('resolved');
        },10);
      });
    },100);
  }

  downloadMovementDataAsPdf() {
    this.loaderService.show();
    this.loaderService.sendLoadingText(CommonConstants.loaderMessages.loaderDisplayTextForDownload);
    setTimeout(()=>{
      return new Promise(async resolve =>{
        var doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(this.title, 11, 8);
        doc.setFontSize(11);
        doc.setTextColor(100);

        (doc as any).autoTable({
          head: this.movementHead,
          body: this.movementData,
          theme: 'plain',
          didDrawCell: data => {
            // console.log(data.column.index)
          }
        })

        // below line for Open PDF document in new tab
        // doc.output('dataurlnewwindow')

        // below line for Download PDF document  
        doc.save(this.movementTitle +'.pdf');
        setTimeout(()=>{
          this.loaderService.hide();
          resolve('resolved');
        },10);
      });
    },100);
  }

  onDeleteVehicle(rowClickedId: string) {
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
        this.httpService.post('vvadmin/deletevehicle', { "requestParams": rowClickedId }).subscribe(
          (response: any) => {
            if (response.success) {
              this.loaderService.hide();
              Swal.fire(
                'Deleted!',
                'Vehicle has been deleted.',
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

  ngOnDestroy(): void {
    this.componentSubscriptions.unsubscribe();
  }

}
