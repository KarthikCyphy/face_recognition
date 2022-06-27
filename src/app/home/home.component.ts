import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app-core/auth/auth.service';
import { CommonUiService } from 'src/app-core/services/common-ui.service';
import { HttpService } from 'src/app-core/services/http.service';
import { LoaderService } from 'src/app-core/services/loader.service';
import { CommonConstants } from 'src/app-core/constants/common-constants';
import * as moment from 'moment';

// import * as _ from 'lodash';
import 'lodash';
declare var _:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class HomeComponent implements OnInit {
  
  constructor(
    private router: Router,
    private httpService: HttpService,
    private toastService: ToastrService,
    public authService: AuthService,
    private modalService: NgbModal,
    private commonUIComponent: CommonUiService,
    private loaderService: LoaderService,
    config: NgbPaginationConfig,

  ) {
    if (authService.userData.roles[0] == 'Operator') {
      this.toastService.error('Unauthorised page access.');
      authService.forceLogout();
    }
  }

  pageSize = CommonConstants.dataTableConstant.pageSize;
  page = CommonConstants.dataTableConstant.page;

  selectedTypeofList: string;
  showDatepicker: boolean = false;
  selectedDate: any = {};
  today: string;
  fromDate: string;
  toDate: string;

  vehicleMovementList: any = [];
  filterTerm: string;
  selectedVehicleInfo: any = {};

  // For download PDF
  title = 'Vehicle List';
  head = [['Gate Name', 'Owner Name', 'Vehicle Number', 'Vehicle Type', 'Date & Time', 'Verification Type', 'Entry Statu', 'Listing Type']];
  data = [];
  currentDateandTime: any = {'date': '', 'time': ''};

  onDateTimeModified(){
    if (this.fromDate != null && this.toDate != null) {
      if(new Date(this.fromDate) >= new Date(this.toDate)){
        this.toastService.error('Invalid date range.');
        return;
      }

      this.showDatepicker = false;
      this.getListMovements('byDate');
    }
  }

  dateFormater(date: any) {
    const convertedDate = new Date(date);
    let finalDate = (moment(convertedDate).format('DD-MM-YYYY') + ' ' + moment(convertedDate).format('HH:mm'));
    return finalDate;
  }

  onClickTypeChange(type: string) {
    this.vehicleMovementList = [];
    this.selectedDate = {};
    if (type == 'todays')
      this.getListMovements(type);
    else
      this.fromDate = null; this.toDate = null;
  }

  ngOnInit(): void {
    this.selectedTypeofList = 'todays';
    this.today = this.dateFormater(new Date());    
    this.getListMovements(this.selectedTypeofList);
  }

  getCurrentDateAndTime() {
    this.currentDateandTime.date = this.dateFormater(new Date()).split(' ')[0];
    this.currentDateandTime.time = this.dateFormater(new Date()).split(' ')[1];
  };

  getListMovements(type: string) {
    let inputData = {'fromDateTime': '', 'toDateTime': ''};
    if (type == 'todays') {
      this.selectedDate = {};
      this.fromDate = null; this.toDate = null;
      inputData = {
        "fromDateTime": this.today.split(" ")[0] + " 00:00:00",
        "toDateTime": this.today.split(" ")[0] + " 23:59:59"
      };
      this.selectedDate = { 
        'fromDate': inputData.fromDateTime.substring(0, inputData.fromDateTime.length - 3),                       
        "toDate": inputData.toDateTime .substring(0, inputData.toDateTime.length - 3) };
    } else {
      if (this.fromDate != null && this.toDate != null) {
        this.selectedDate = {};
        inputData = {
          "fromDateTime": this.dateFormater(this.fromDate)+":59",
          "toDateTime": this.dateFormater(this.toDate)+":59"
        };
        this.selectedDate = { 
          'fromDate': inputData.fromDateTime.substring(0, inputData.fromDateTime.length - 3),                       
          "toDate": inputData.toDateTime.substring(0, inputData.toDateTime.length - 3) };
      }
    }

    if (!this.commonUIComponent.isEmptyObject(inputData)) {      
      this.httpService.post('vvadmin/getvehiclemovmentdetailsbetweendates', { "requestParams": inputData }).subscribe(
        async (response: any) => {
          if(await response.success){
            this.vehicleMovementList = response.returnObject;
            this.filterTerm = '';
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
                this.data = this.commonUIComponent.convertDataToDownloadPDF(_.cloneDeep(tempArr));
            });
          }
          this.loaderService.hide();
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
      });
    }
  }

  openSnapshotModal(content, imagePath: string) {
    this.httpService.post('irakshan/fetchimage', { "requestParams": { 'imageFilePath': imagePath } }).subscribe(
      async (response: any) => {
        if(await response.success){
          this.modalService.open(content, { size: 'lg', backdrop: 'static', centered: true });
          this.selectedVehicleInfo.imagePath = response.returnObject;
        }
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
        this.getCurrentDateAndTime();
        await doc.save(this.title+'-'+ this.currentDateandTime.date +'-'+ this.currentDateandTime.time +'.pdf');
        setTimeout(()=>{
          this.loaderService.hide();
          resolve('resolved');
        },10);
      });
    },100);
  }
}
