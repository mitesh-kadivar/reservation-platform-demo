import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourcesRoutingModule } from './resources-routing.module';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { ResourcesComponent } from './resources.component';
import { NbAlertModule, NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [
    CreateComponent,
    IndexComponent,
    EditComponent,
    ResourcesComponent
  ],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    NbAlertModule,
    NbCardModule,
    Ng2SmartTableModule
  ]
})
export class ResourcesModule { }
