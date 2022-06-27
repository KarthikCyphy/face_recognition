import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { ContentLayoutComponent } from './shared/components/layout/content-layout/content-layout.component';
import { content } from "./shared/routes/content-routes";
import { AdminGuard } from '../app-core/guard/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AdminGuard],
    // canActivateChild: [AdminGuard],
    children: content
  },
  { path: '**', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
