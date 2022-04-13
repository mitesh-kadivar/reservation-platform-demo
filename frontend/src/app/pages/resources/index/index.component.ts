import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ResourcesService } from '../resources.service';
import { ServerDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { getUserType } from '../../../auth/authManager';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  imagePath: string;
  formStatus: any = null;
  statusType: any;
  userType: string;
  page: Number;

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
      edit: false,
      delete: false,
    },
    columns: {
      title: {
        title: 'Title',
        type: 'string',
        filter: true,
      },
      categories: {
        title: 'Category',
        type: 'string',
        valuePrepareFunction: (categories) => {
          return (categories) ? categories.title : "No Category";
        }
      },
      image: {
        title: 'Image',
        filter: false,
        type: 'html',
        valuePrepareFunction: (image) => {
          this.imagePath = (image) ? environment.resourceImagePath + image : environment.resourceImagePath + "../../default-user.png";
          return `<img class='table-thumbnail-img' src="${this.imagePath}" width="50" height="50"/>`
        }
      },
    },
    pager: {
      display: true,
      perPage: 2
    }
  };

  ngOnInit(): void {
    this.getAllData();
    this.userType = getUserType();
    this.settings.actions.edit = (this.userType == 'ADMIN') ? true : false;
    this.settings.actions.delete = (this.userType == 'ADMIN') ? true : false;
  }

  source: ServerDataSource;
  url = environment.baseURL + 'resources/list';

  constructor(private resourceService: ResourcesService, private router: Router, private http: HttpClient) { }

  getAllData() {
    this.source = new ServerDataSource(this.http, {
      endPoint: this.url,
      dataKey: 'data.data',
      pagerPageKey: 'page',
      pagerLimitKey: 'perPage',
      totalKey: 'data.total'
    });
  }

  onEditResource(event, eventName: string): void {
    let resourceId = btoa(event.data.id);
    this.router.navigate(['/pages/resources/edit/', resourceId]);
  }

  onDelete(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.resourceService.deleteResource(event.data.id).subscribe((res: any) => {
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

  closeAlert(): void {
    this.formStatus = false;
  }

}
