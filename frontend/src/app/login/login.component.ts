import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthService, NbLoginComponent, NB_AUTH_OPTIONS } from '@nebular/auth';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { getUserType, saveAuthentication } from '../auth/authManager';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent extends NbLoginComponent implements OnInit {

  formError: any = null;
  statusType: any;
  formData : object = {};
  cookie: boolean = false;
  user_email: string = "";
  user_password: string = "";

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) options:{},
    cd: ChangeDetectorRef,
    public router: Router,) {
    super(service, options, cd, router);
  }

  ngOnInit(): void {
    this.user_email    = localStorage.getItem('remembe_email');
    this.user_password = localStorage.getItem('remembe_password');

    if (this.user_email && this.user_password) {
      this.cookie = true;
    } else {
      this.cookie = false;
    }
  }

  loginForm (form:any)
  {
    this.formData = {
      email:form.email,
      password:form.password
    };

    this.authService.login(this.formData).subscribe((res) => {
      if (res.meta.status === false) {
        this.formError = res.meta.message;
        this.statusType = 'danger';
      } else {
       this.formError = res.meta.message;
       saveAuthentication(res.data);

      if (form.rememberMe) {
        this.cookie = true;
        localStorage.setItem('remembe_email', form.email);
        localStorage.setItem('remembe_password', form.password);
      } else {
        localStorage.removeItem('remembe_email');
        localStorage.removeItem('remembe_password');
        this.cookie = false;
      }
      if (getUserType() != 'USER') {
       this.router.navigate(['/pages/employees/index']);
      } else {
        this.router.navigate(['/pages/resources/index'])
      }
       this.statusType = 'success';
      }
    });
  }
}
