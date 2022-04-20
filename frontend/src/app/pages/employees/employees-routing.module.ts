import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { IsAdminGuard } from '../../auth/is-admin.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [{
  path: '',
  component: EmployeesComponent,
  children: [
    {
      path: 'index',
      canActivate: [IsAdminGuard],
      component: IndexComponent,
    },
    {
      path: 'create',
      canActivate: [IsAdminGuard],
      component: CreateComponent,
    },
    {
      path: 'change-password',
      component: ChangePasswordComponent
    },
    {
      path: 'edit/:empId',
      canActivate: [IsAdminGuard],
      component: EditComponent
    },
    {
      path: 'profile',
      component: ProfileComponent
    },
    {
      path: 'user-profile',
      component: UserProfileComponent
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {
}
