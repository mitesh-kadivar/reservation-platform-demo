import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourcesRoutingModule } from './resources-routing.module';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { EditComponent } from './edit/edit.component';
import { ResourcesComponent } from './resources.component';
import { NbAlertModule, NbCardModule, NbCheckboxModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './header.interceptor';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    CreateComponent,
    IndexComponent,
    EditComponent,
    ResourcesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ResourcesRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbInputModule,
    NbSelectModule,
    NbAlertModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true,
    }
  ]
})
export class ResourcesModule { }
