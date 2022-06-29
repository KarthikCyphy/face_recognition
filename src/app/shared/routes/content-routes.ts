import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'enrolment',
    loadChildren: () => import('../../person-endrolment/person-enrolment.module').then(m => m.PersonEnrolmentModule)
  }

];