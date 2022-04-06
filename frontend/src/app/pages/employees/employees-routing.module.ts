import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [{
  path: '',
  component: EmployeesComponent,
  children: [
    {
      path: 'index',
      component: IndexComponent,
    },
    {
      path: 'create',
      component: CreateComponent,
    },
    {
      path: 'change-password',
      component: ChangePasswordComponent
    },
    {
      path: 'edit/:empId',
      component: EditComponent
    },
    {
      path: 'profile',
      component: ProfileComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {
}
