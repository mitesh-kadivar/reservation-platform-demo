import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking.component';
import { ResourceBookingComponent } from './resource-booking/resource-booking.component';

const routes: Routes = [{
  path: '',
  component: BookingComponent,
  children: [
    {
      path: 'resource-book',
      component: ResourceBookingComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
