import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// import * as _ from 'lodash';
import 'lodash';
declare var _:any;

@Injectable({
  providedIn: 'root'
})
export class CommonUiService {

  constructor() { }

  private setGlobalSearchValue = new BehaviorSubject<any>({});
  getSideNavToggleValue = this.setGlobalSearchValue.asObservable();

  sendGlobalSearch(data: any) {
    this.setGlobalSearchValue.next(data);
  }

  isEmptyObject(obj: object) {
    return (obj && (Object.keys(obj).length === 0));
  }

  rawVehicleNumberFormatte(vehicleNumber: string){
    let VehicleNumber = '';
    let tempData = vehicleNumber;
    tempData.split(" ").forEach((value,key) => {
      value = this.isNumeric(value) ? value : value.toLowerCase();
      VehicleNumber = VehicleNumber + value;
    });
    tempData = VehicleNumber;

    if(tempData.includes('-')){
      VehicleNumber = '';
      tempData.split("-").forEach((value,key) => {
        value = this.isNumeric(value) ? value : value.toLowerCase();
        VehicleNumber = VehicleNumber + value;
      });
      tempData = VehicleNumber;
    }  

    return VehicleNumber;
  }

  vehicleNumberFormatter(vehicleNum: string){
    if(vehicleNum != undefined){
      vehicleNum = this.rawVehicleNumberFormatte(vehicleNum);
      let VehicleNumber = '';
      let lastvalue = true; 
      Array.from(vehicleNum).forEach((value,key) => {
        value = this.isNumeric(value) ? value : value.toUpperCase();

        let val = lastvalue === this.isNumeric(value) ? value : VehicleNumber != '' ? '-'+value : value;
        lastvalue = this.isNumeric(value);
        VehicleNumber = VehicleNumber + val;
      });

      return VehicleNumber;
    }
  }

  isNumeric(val: string){
    return !isNaN(Number(val));
  }

  removeUnderscores(stringValue: string) {
    if(stringValue == null)
    return '-';
    
    let value = stringValue.replace(/[/_/]/g, ' ');
    return value.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
  };

  enumModifier(stringValue: string){
    let value = '';
    switch(stringValue){
      case 'SYSTEM_ALLOWED':
        value = 'Allowed';
        break;
      case 'SYSTEM_NOT_ALLOWED':
        value = 'Not Allowed';
        break;
      case 'WAITING_FOR_MANUAL_VERFICATION':
        value = 'Waiting';
        break;
      case 'MANUALLY_VERIFIED_AND_ALLOWED':
        value = 'Verified & Allowed';
        break;
      case 'MANUALLY_VERIFIED_AND_NOT_ALLOWED':
        value = 'Blocked';
        break;
    }
    return value.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );

  }

  convertDataToDownloadPDF(dataList: any) {
    let data = [];
    dataList.forEach((value,key) => {
      let tempArr = [];
      Object.keys(value).forEach((keys) => {        
        if(value[keys] == null)
          value[keys] = '-';
        switch(keys){
          case 'vehicleNumber':
            value[keys] = this.vehicleNumberFormatter(value[keys]);         
            break;
          case 'ownerName':
            value[keys] = this.removeUnderscores(value[keys]);         
            break;
          case 'vehicleType':
            value[keys] = this.removeUnderscores(value[keys]);         
            break;
          case 'vehicleCategory':
            value[keys] = this.removeUnderscores(value[keys]);         
            break;
          case 'vehicleListingType':
            value[keys] = this.removeUnderscores(value[keys]);         
            break;
          case 'vehicleEntryStatus':
            value[keys] = this.enumModifier(value[keys]);         
            break;
          case 'vehicleVerificationType':
            value[keys] = this.removeUnderscores(value[keys]);         
            break;
          case 'make':
            value[keys] = this.removeUnderscores(value[keys]);         
            break;
          case 'model':
            value[keys] = this.removeUnderscores(value[keys]);         
            break;
          case 'color':
            value[keys] = this.removeUnderscores(value[keys]);         
            break;
        }      
        tempArr.push(value[keys]);
      });
      data.push(tempArr)
    });
    return data
  }
}
