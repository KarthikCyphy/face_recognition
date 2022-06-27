import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encodeBase64'
})

export class EncodeBase64Pipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      return btoa(value);
    }
  }

}
