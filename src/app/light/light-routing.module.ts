import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LightComponent } from './light.component';

const routes: Routes = [
  {
    path: '',
    component: LightComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LightRoutingModule { }
