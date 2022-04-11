import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { BookingService } from '../booking.service';

@Component({
  selector: 'ngx-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  bookings: any;
  formError: any = null;
  statusType: any;

  settings = {
    // hideSubHeader: true,
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      add: false,
      edit: false
    },
    columns: {
      employee_name: {
        title: 'Employee Name',
        type: 'string',
      },
      resource_name: {
        title: 'Resource',
        type: 'string',
      },
      start_date: {
        title: 'Start Date',
        type: 'date'
      },
      end_date: {
        title: 'End Date',
        type: 'date'
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData, private bookingService: BookingService) { }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.bookings = this.bookingService.getOrderHistory().subscribe((res: any) => {
      this.source.load(res.data);
    });
  }

  onDelete(event): void {
    if (window.confirm('Are you sure you want to cancel this booked resource?')) {
      this.bookingService.cancelOrder(event.data.id).subscribe((res : any) => {
        if (res.meta.status === true) {
          this.formError = res.meta.message;
          this.statusType = 'success';
          this.getAllData();
        } else {
          this.formError = res.meta.message;
          this.statusType = 'danger';
        }
      })
    }
  }

}
