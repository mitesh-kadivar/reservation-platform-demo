import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { environment } from '../../../../environments/environment';

import { SmartTableData } from '../../../@core/data/smart-table';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'ngx-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  imagePath: string;
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
      add: false
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
        sort: false
      },
      email: {
        title: 'E-mail',
        type: 'string',
        sort: false
      },
      description: {
        title: 'Description',
        type: 'text',
        sort: false
      },
      // profile: {
      //   title: 'Profile',
      //   filter: false,
      //   type: 'html',
      //   valuePrepareFunction: (profile) => {
      //     this.imagePath =  (profile) ? environment.imagePath + profile : environment.imagePath + "../../default-user.png";
      //     return `<img class='table-thumbnail-img' src="${this.imagePath}" width="50" height="50"/>`
      //   }
      // },
    },
    pager: {
      display: true,
      perPage: environment.pagination
    }
  };

  source: ServerDataSource;
  url = environment.baseURL + 'employees/get';

  constructor(private service: SmartTableData, private empService: EmployeeService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllData();
  }

  onDelete(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.empService.deleteEmployee(event.data.id).subscribe((res : any) => {
        if (res.meta.status === true) {
          this.formStatus = res.meta.message;
          this.statusType = 'success';
          this.getAllData();
        } else {
          this.formStatus = res.meta.message;
          this.statusType = 'danger';
        }
      })
    }
  }

  onEditEmployee(event, eventName: string): void {
    let empId = btoa(event.data.id);
    this.router.navigate(['/pages/employees/edit/', empId]);
  }

  getAllData() {
    this.source = new ServerDataSource(this.http, {
      endPoint: this.url,
      dataKey: 'data.data',
      pagerPageKey: 'page',
      pagerLimitKey: 'perPage',
      totalKey: 'data.total',
    });
  }

  closeAlert(): void {
    this.formStatus = false;
  }
}
