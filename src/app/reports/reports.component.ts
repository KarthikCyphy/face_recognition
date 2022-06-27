import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app-core/auth/auth.service';
import { CommonUiService } from 'src/app-core/services/common-ui.service';
import { HttpService } from 'src/app-core/services/http.service';
import { LoaderService } from 'src/app-core/services/loader.service';
import { CommonConstants } from 'src/app-core/constants/common-constants';
import * as moment from 'moment';

import 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
declare var _:any;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportsComponent implements OnInit {

  componentSubscriptions: Subscription = new Subscription();
  public messages: Subject<Message>;
  
  @ViewChild('vehicleSearchListContenet') templateRef: TemplateRef<any>;

  constructor(
    private httpService: HttpService,
    private toastService: ToastrService,
    public authService: AuthService,
    private modalService: NgbModal,
    private commonUIComponent: CommonUiService,
    private loaderService: LoaderService,
    config: NgbPaginationConfig,
    private fb: FormBuilder,

  ) {
    if (authService.userData.roles[0] == 'Operator') {
      this.toastService.error('Unauthorised page access.');
      authService.forceLogout();
    }

    for (let i = 1; i <= 30; i++) { this.frequencyLists.push(i+''); }
  }

  pageSize = CommonConstants.dataTableConstant.pageSize;
  page = CommonConstants.dataTableConstant.page;

  showDatepicker: boolean = false;
  selectedDate: any = {};
  today: string;
  fromDate: string;
  toDate: string;

  frequencyLists:any = [];
  selectedFrequency: string = '20';

  vehicleFrequencyList: any = [];
  vehiclesFreqFilterTerm: string;
  selectedVehicleInfo: any = {};

  vehicleWhiteListForm: FormGroup;
  selectedEventData: any = {};

  currentDateandTime: any = {'date': '', 'time': ''};

  onDateTimeModified(){
    if (this.fromDate != null && this.toDate != null) {
      if(new Date(this.fromDate) >= new Date(this.toDate)){
        this.toastService.error('Invalid date range.');
        return;
      }
      this.getListMovements();
    }
  }

  dateFormater(date: any) {
    const convertedDate = new Date(date);
    let finalDate = (moment(convertedDate).format('DD-MM-YYYY') + ' ' + moment(convertedDate).format('HH:mm'));
    return finalDate;
  }

  ngOnInit(): void {
    this.today =(moment(new Date()).format('YYYY-MM-DD') + 'T') ;
    this.fromDate = this.today + '00:00:00+05:30'; 
    this.toDate = this.today + '23:59:59+05:30';
  
    this.currentDateandTime.date = this.dateFormater(new Date());
    this.getListMovements();

    this.componentSubscriptions.add(this.commonUIComponent.getSideNavToggleValue.subscribe((data: any) => {
      if (!this.commonUIComponent.isEmptyObject(data)) {
        // this.vehiclesListData = data.returnObject;
        this.modalService.open(this.templateRef, { size: 'xl', backdrop: 'static', centered: true });
      }
    }));
  }

  getCurrentDateAndTime() {
    this.currentDateandTime.date = this.dateFormater(new Date()).split(' ')[0];
    this.currentDateandTime.time = this.dateFormater(new Date()).split(' ')[1];
  };

  getListMovements() {
    let inputData = {'fromDateTime': '', 'toDateTime': '', 'frequency': ''};   
    if (this.fromDate != null && this.toDate != null) {
      this.selectedDate = {};
      inputData = {
        "fromDateTime": this.dateFormater(this.fromDate)+":00",
        "toDateTime": this.dateFormater(this.toDate)+":59",
        "frequency": this.selectedFrequency
      };
      this.selectedDate = { 
        'fromDate': inputData.fromDateTime.substring(0, inputData.fromDateTime.length - 3),                       
        "toDate": inputData.toDateTime.substring(0, inputData.toDateTime.length - 3),
        "frequency": this.selectedFrequency
      };
    }

    if (!this.commonUIComponent.isEmptyObject(inputData)) {   
      this.selectedEventData = {};

      this.httpService.post('vvadmin/generatefrequentmovingvehicledetailsbetweendateandtime', { "requestParams": inputData }).subscribe(
        async ( response: any) => {
          if(await response.success){
            this.vehiclesFreqFilterTerm = ''; this.page = 1;
            let tempArr =[];

            let reportTableData = [];
            setTimeout(() => {
              Object.entries(response.returnObject).forEach((value:any,key) => {
                value[1].splice(0,0, _.cloneDeep({'groupBy': value[0],'vehicleDetails': value[1][0].vehicleDetails,'vehicleType': value[1][0].vehicleType}));
                reportTableData = reportTableData.concat(value[1]);
              });
              this.chunkArray(reportTableData,this.pageSize-1).forEach((value,key) => {
                if(value[0]['groupBy'] == undefined){
                  value.splice(0,0, _.cloneDeep({'groupBy': value[0]['vehicleNumber'],'vehicleDetails': value[0].vehicleDetails,'vehicleType': value[0].vehicleType}));
                } 
                tempArr = tempArr.concat(value);
              });

              setTimeout(() => {
                console.log(tempArr)
                this.vehicleFrequencyList = _.cloneDeep(tempArr);
              },200);
            },50);
          }
          this.loaderService.hide();
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
      });
    }

    this.vehicleWhiteListForm = this.fb.group({     
      vehicleNumber: ['', [Validators.required]],
      vehicleType: ['', [Validators.required]],
      ownerName: ['',],
      address: ['',],
      vehicleCategory: ['', [Validators.required]],
      vehicleListingType: ['', [Validators.required]],
    });
  }  

  chunkArray(myArray:any, chunk_size: number) {
    var index = 0;  var arrayLength = myArray.length; var tempArray = [];    
    for (index = 0; index < arrayLength; index += chunk_size) {
      var myChunk = myArray.slice(index == 0 ? index : index+1, index+chunk_size+1);
      if(myChunk.length != 0)
        tempArray.push(myChunk);
    }
    return tempArray;
  };

  openAddtoWhiteListModal(content, rowClickedData: any) {
    if(rowClickedData){
      this.selectedEventData = {
        "vehicleNumber": rowClickedData.groupBy, "vehicleType": rowClickedData.vehicleType,
        "ownerName": "", "address": "","vehicleCategory": "", "vehicleListingType": "",
      };
      this.selectedEventData.vehicleNumber = this.commonUIComponent.vehicleNumberFormatter(this.selectedEventData.vehicleNumber);
      this.modalService.open(content, { size: 'lg', backdrop: 'static', centered: true });     
    }
  }

  onResetForm() {
    this.ngOnInit();
  }

  onSubmit() {
    if (this.vehicleWhiteListForm.valid) {
      this.selectedEventData.vehicleNumber = this.commonUIComponent.rawVehicleNumberFormatte(this.selectedEventData.vehicleNumber);
      this.httpService.post('vvadmin/addorupdatevehicle', { "requestParams": this.selectedEventData }).subscribe(
        async ( response: any) => {
          if(await response.success){ 
            this.toastService.success('Vehicle updated successfully');
            this.modalService.dismissAll();
            this.getListMovements();
          }
          this.loaderService.hide();
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
        });
    }
  };

  openSnapshotModal(content, imagePath: string, vehicleNumber: string, vehicleType: string) {
    this.httpService.post('irakshan/fetchimage', { "requestParams": { 'imageFilePath': imagePath } }).subscribe(
      async ( response: any) => {
        if(await response.success){ 
          this.modalService.open(content, { size: 'lg', backdrop: 'static', centered: true });
          this.selectedVehicleInfo.snapshotPath = response.returnObject;
          this.selectedVehicleInfo.vehicleNumber = vehicleNumber;
          this.selectedVehicleInfo.vehicleType = vehicleType;
        }
        this.loaderService.hide();
      },
      (error) => { //error() callback
        this.httpService.serverErrorMethod(error);
      });
  }

  downloadDataAsPdf() {
    if(!this.commonUIComponent.isEmptyObject(this.selectedDate)){
      this.loaderService.sendLoadingText(CommonConstants.loaderMessages.loaderDisplayTextForDownload);
      let inputData = { "frequency":this.selectedDate.frequency,
                        "fromDateTime":this.selectedDate.fromDate+":00",
                        "toDateTime":this.selectedDate.toDate+":59"
                      };
      this.httpService.post('vvadmin/downloadvehiclemovementreportbetweendates', { "requestParams": inputData }).subscribe(
        async ( response: any) => {
          if(await response.success){          
            this.loaderService.sendLoadingText('');
            this.downloadDataAsPdfFormat(response);
          }
          this.loaderService.hide();
        },
        (error) => { //error() callback
          this.httpService.serverErrorMethod(error);
      });
    }
  }

  downloadDataAsPdfFormat(data: any) {
    var blob = new Blob([data], { type: "application/pdf" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    this.getCurrentDateAndTime();
    a.download = 'Vehicle_frequency_report_'+'_'+ this.currentDateandTime.date +'-'+ this.currentDateandTime.time ;
    a.click();
  }
}
