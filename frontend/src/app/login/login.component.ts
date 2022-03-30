import { Component, OnInit } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent extends NbLoginComponent {
}
