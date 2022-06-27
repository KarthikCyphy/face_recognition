import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscore'
})

export class RemoveUnderscorePipe implements PipeTransform {

  transform(value: string): any {
    if (value) {
      const stringValue = value.indexOf('_');
      if (stringValue !== -1) {
        return value.substring(0, value.indexOf('_'));
      }
      return value;
    }
    return value;
  }

}
