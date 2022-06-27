import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'currentTimeZone'
})

export class CurrentTimeZonePipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      const dateValue = moment(value).format('MM/DD/YYYY HH:mm:ss');
      const convertedDate = new Date(Date.parse(dateValue + ' UTC'));
      return (moment(convertedDate).format('MM/DD/YYYY') + ' ' + moment(convertedDate).format('HH:mm:ss'));
    }
  }

}
