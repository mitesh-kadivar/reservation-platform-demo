import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { ConfirmedValidator } from './confirmed.validator';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  submitted: boolean = false;
  formError: any = null;
  statusType: any;
  
  constructor(public formBuilder: FormBuilder, public employeeService: EmployeeService) { 
  }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    },
    {
      validator: ConfirmedValidator('new_password', 'confirm_password')
    })
  }

  get getControl() {
    return this.changePasswordForm.controls;
  }

  changePassword() {
    this.submitted = true;

    if (this.changePasswordForm.valid) {
      this.employeeService.changePassword(this.changePasswordForm.value).subscribe((res: any) => {
         if (res.meta.status === false) {
           this.formError = res.meta.message;
           this.statusType = 'danger';
         } else {
          this.formError = res.meta.message;
          this.statusType = 'success';
         }
      }, error => {
        this.formError = error.error.message || error;
      });
    }
  }
}
