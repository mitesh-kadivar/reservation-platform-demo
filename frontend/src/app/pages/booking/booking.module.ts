import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ResourceBookingComponent } from './resource-booking/resource-booking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BookingComponent,
    ResourceBookingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookingRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbInputModule,
    NbButtonModule,
    NbAlertModule,
    NbDatepickerModule,
    NbSelectModule
  ]
})
export class BookingModule { }
