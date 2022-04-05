import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SmartTableData } from '../../../@core/data/smart-table';
import { ResourcesService } from '../resources.service';
import { LocalDataSource } from 'ng2-smart-table';

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
      profile: {
        title: 'Image',
        filter: false,
        type: 'html',
        valuePrepareFunction: (profile) => {
          this.imagePath =  (profile) ? environment.imagePath + profile : environment.imagePath + "../../default-user.png";
          return `<img class='table-thumbnail-img' src="${this.imagePath}" width="50" height="50"/>`
        }
      },
    },
  };

  ngOnInit(): void {
    this.getAllData();
  }

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData, private resourceService: ResourcesService) { }

  getAllData() {
    this.resourceService.getAllResources().subscribe((res: any) => {
      this.source.load(res.data);
    });
  }

}
