import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeBase64'
})

export class DecodeBase64Pipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      return atob(value);
    }

  }

}
