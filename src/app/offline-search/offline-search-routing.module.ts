import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfflineSearchComponent } from './offline-search.component';

const routes: Routes = [
  {
    path:'',
    component: OfflineSearchComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineSearchRoutingModule { }
