import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeesComponent } from './employees.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import { CreateComponent } from './create/create.component';
import { IndexComponent } from './index/index.component';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../../auth/token.interceptor';
import { AuthService } from '../../auth/auth.service';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeesRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbInputModule,
    NbButtonModule,
    NbAlertModule
  ],
  declarations: [
    EmployeesComponent,
    CreateComponent,
    IndexComponent,
    EditComponent,
    ChangePasswordComponent,
    ProfileComponent
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
})
export class EmployeesModule { }
