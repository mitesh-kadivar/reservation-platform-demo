import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { environment } from '../../../../environments/environment';
import { SmartTableData } from '../../../@core/data/smart-table';
import { BookingService } from '../booking.service';

@Component({
  selector: 'ngx-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  bookings: any;
  formStatus: any = null;
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
    pager: {
      display: true,
      perPage: environment.pagination
    }
  };

  // source: LocalDataSource = new LocalDataSource();
  source: ServerDataSource;
  url = environment.baseURL + 'booking/list';

  constructor(private service: SmartTableData, private bookingService: BookingService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.source = new ServerDataSource(this.http, {
      endPoint: this.url,
      dataKey: 'data.data',
      pagerPageKey: 'page',
      pagerLimitKey: 'perPage',
      totalKey: 'data.total'
    });
  }

  onDelete(event): void {
    if (window.confirm('Are you sure you want to cancel this booked resource?')) {
      this.bookingService.cancelOrder(event.data.id).subscribe((res : any) => {
        this.formStatus = res.meta.message;
        if (res.meta.status === true) {
          this.statusType = 'success';
          this.getAllData();
        } else {
          this.statusType = 'danger';
        }
      })
    }
  }

  closeAlert() {
    this.formStatus = false;
  }
}
