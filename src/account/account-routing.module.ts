import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureInnerPagesGuard } from 'src/app-core/guard/SecureInnerPagesGuard.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [SecureInnerPagesGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
