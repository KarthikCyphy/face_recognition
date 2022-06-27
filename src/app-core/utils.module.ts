import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentTimeZonePipe } from './pipe/current-time-zone.pipe';
import { DecodeBase64Pipe } from './pipe/decode-base64.pipe';
import { EncodeBase64Pipe } from './pipe/encode-base64.pipe';
import { FilterByFieldsPipe } from './pipe/filter-by-fields.pipe';
import { FilterPipe } from './pipe/filter.pipe';
import { SortByPipe } from './pipe/sort-by.pipe';
import { RemoveUnderscorePipe } from './pipe/remove-underscore.pipe';


@NgModule({
  declarations: [
    EncodeBase64Pipe,
    DecodeBase64Pipe,
    FilterPipe,
    SortByPipe,
    FilterByFieldsPipe,
    CurrentTimeZonePipe,
    RemoveUnderscorePipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EncodeBase64Pipe,
    DecodeBase64Pipe,
    FilterPipe,
    SortByPipe,
    FilterByFieldsPipe,
    CurrentTimeZonePipe,
    RemoveUnderscorePipe,
  ]
})
export class UtilsModule { }
