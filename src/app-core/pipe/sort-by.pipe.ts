import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortBy' })

export class SortByPipe implements PipeTransform {

  transform(items: any[], field: string, reverse: boolean = false): any[] {

    if (!items) { return []; }
    if (field) {
      items.sort((a, b) => Number(a[field]) > Number(b[field]) ? 1 : -1);
    } else {
      items.sort((a, b) => a > b ? 1 : -1);
    }
    if (reverse) { items.reverse(); }
    return items;

  }
}
