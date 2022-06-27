import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], value: string): any[] {
    if (!items || !value) {
      return items;
    }
    return items.filter(item => JSON.stringify(item).toLowerCase().includes(value.toLowerCase()));
  }
}
