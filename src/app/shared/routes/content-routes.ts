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
  {
    path: 'gate',
    loadChildren: () => import('../../gate/gate.module').then(m => m.GateModule),
  },
  {
    path: 'light',
    loadChildren: () => import('../../light/light.module').then(m => m.LightModule),
  },
  {
    path: 'camera',
    loadChildren: () => import('../../camera/camera.module').then(m => m.CameraModule),
  },
  {
    path: 'vehicles',
    loadChildren: () => import('../../vehicles/vehicles.module').then(m => m.VehiclesModule),
  },  
  {
    path: 'reports',
    loadChildren: () => import('../../reports/reports.module').then(m => m.ReportsModule),
  },  

];