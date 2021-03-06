import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'enrolment',
    loadChildren: () => import('../../person-enrolment/person-enrolment.module').then(m => m.PersonEnrolmentModule),
  },
  {
    path: 'offline-search',
    loadChildren: () => import('../../offline-search/offline-search.module').then(m => m.OfflineSearchModule),
  }

];