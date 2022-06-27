import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'home',
    loadChildren: () => import('../../home/home.module').then(m => m.HomeModule),
  },

];