import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from '../auth/auth.guard';
import { IsAdminGuard } from '../auth/is-admin.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'employees',
      canActivate: [AuthGuard],
      loadChildren: () => import('./employees/employees.module')
        .then(m => m.EmployeesModule),
    },
    {
      path: 'resources',
      canActivate: [AuthGuard],
      loadChildren: () => import('./resources/resources.module')
        .then(m => m.ResourcesModule),
    },
    {
      path: 'booking',
      canActivate: [AuthGuard],
      loadChildren: () => import('./booking/booking.module')
        .then(m => m.BookingModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'iot-dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
