import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from '../../auth/is-admin.guard';
import { BookingComponent } from './booking.component';
import { HistoryComponent } from './history/history.component';
import { IndexComponent } from './index/index.component';
import { ResourceBookingComponent } from './resource-booking/resource-booking.component';
import { DatePickerComponent } from './date-picker/date-picker.component';

const routes: Routes = [{
  path: '',
  component: BookingComponent,
  children: [
    {
      path: 'resource-book',
      component: ResourceBookingComponent,
    },
    {
      path: 'index',
      component: IndexComponent,
    },
    {
      path: 'history',
      canActivate: [IsAdminGuard],
      component: HistoryComponent,
    },
    {
      path: 'date',
      component: DatePickerComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
