import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByFields'
})

export class FilterByFieldsPipe implements PipeTransform {

  transform(items: any[], fields: string[], value: string): any[] {
    if (!items || !value) {
      return items;
    }
    return items.filter(item => {
      let itemFound: boolean;
      value = value.trim();
      fields.map(list => {
        if (item[list].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          itemFound = true;
          return;
        }
      });
      return itemFound;
    });
  }

}
