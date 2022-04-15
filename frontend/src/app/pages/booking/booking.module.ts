import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbInputModule, NbSelectModule, NB_TIME_PICKER_CONFIG } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ResourceBookingComponent } from './resource-booking/resource-booking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexComponent } from './index/index.component';
import { HistoryComponent } from './history/history.component';


@NgModule({
  declarations: [
    BookingComponent,
    ResourceBookingComponent,
    IndexComponent,
    HistoryComponent
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
  ],
  providers: [
    {
      provide: NB_TIME_PICKER_CONFIG,
      useValue: {}
    }
  ]
})
export class BookingModule { }
