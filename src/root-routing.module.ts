import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule), // Lazy load account module
    data: { preload: true }
  },
  {
    path: 'app',
    loadChildren: () => import('./app/app.module').then(m => m.AppModule), // Lazy load
    data: { preload: true }
  },
  { path: '', redirectTo: 'account/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    // onSameUrlNavigation: 'reload',
    useHash: true,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule],
  providers: []
})
export class RootRoutingModule { }
