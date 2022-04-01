import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { environment } from '../../../../environments/environment';

import { SmartTableData } from '../../../@core/data/smart-table';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'ngx-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  imagePath: string;
  formError: any = null;
  statusType: any;

  settings = {
    hideSubHeader: true,
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
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'text'
      },
      profile: {
        title: 'Profile',
        filter: false,
        type: 'html',
        valuePrepareFunction: (profile) => {
          this.imagePath =  (profile) ? environment.imagePath + profile : environment.imagePath + "../../default-user.png";
          return `<img class='table-thumbnail-img' src="${this.imagePath}" width="50" height="50"/>`
        }
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData, private empService: EmployeeService) {}

  ngOnInit(): void {
    this.getAllData();
  }

  onDelete(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.empService.deleteEmployee(event.data.id).subscribe((res : any) => {
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

  onFoo(event, eventName: string): void {
    console.log(eventName, event);
  }

  getAllData() {
    this.empService.getAllEmployees().subscribe((res: any) => {
      this.source.load(res.data);
    });
  }
}
