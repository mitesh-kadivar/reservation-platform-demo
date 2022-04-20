import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { EmployeeService } from '../employee.service';
import { ConfirmedValidator } from '../change-password/confirmed.validator';
import { fileExtensionValidator } from '../file-extension-validator.directive';
import { clearUserData, getAuthenticatedUserData, saveUserData } from '../../../auth/authManager';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  changePasswordForm: FormGroup;
  changePasswordSubmitted: boolean = false;
  changePasswordFormError: any = null;
  changePasswordStatusType: any;

  profileForm: FormGroup;
  loggedUserData: any;
  profileSubmitted: boolean = false;
  profileFormError: any = null;
  imageSrc: string;
  profileStatusType: any;
  empId: any;

  constructor(
    public formBuilder: FormBuilder,
    public employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group(
      {
        old_password: ['', [Validators.required]],
        new_password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]]
      },
      {
        validator: ConfirmedValidator('new_password', 'confirm_password')
      }
    );

    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z]{1,} *[a-zA-Z]*')]],
      profile: ['', [fileExtensionValidator('jpg, png, jpeg, JPG, PNG')]],
      description: [''],
    })

    this.loggedUserData = getAuthenticatedUserData();
    this.empId = this.loggedUserData.id;
    this.loggedUserData.photo = (this.loggedUserData.profile) ? environment.imagePath + this.loggedUserData.profile : environment.imagePath + "../../default-user.png";
  }

  get getChangePasswordControl() {
    return this.changePasswordForm.controls;
  }

  get getProfileControl() {
    return this.profileForm.controls;
  }

  changePassword() {
    this.changePasswordSubmitted = true;

    if (this.changePasswordForm.valid) {
      this.employeeService.changePassword(this.changePasswordForm.value).subscribe((res: any) => {
        if (res.meta.status === false) {
          this.changePasswordFormError = res.meta.message;
          this.changePasswordStatusType = 'danger';
        } else {
          this.changePasswordFormError = res.meta.message;
          this.changePasswordStatusType = 'success';
          this.authService.logout();
          setTimeout(() => {
            this.router.navigate(['/auth']);
          }, 2000);
        }
      }, error => {
        this.changePasswordFormError = error.error.message || error;
      });
    }
  }

  closeChangePasswordAlert() {
    this.changePasswordFormError = false;
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }

  updateProfile() {
    this.profileSubmitted = true;

    if (this.profileForm.valid) {
      let updatableData = {
        id: null,
        name: this.profileForm.value.name,
        profile: this.imageSrc ?? '',
        description: this.profileForm.value.description
      };

      this.employeeService.profileUpdate(this.empId, updatableData).subscribe((res: any) => {
        if (res.meta.status === false) {
          this.profileFormError = res.meta.message;
          this.profileStatusType = 'danger';
        } else {
          this.profileFormError = res.meta.message;
          this.profileStatusType = 'success';

          clearUserData();
          saveUserData(res.data);

          let userInfo = {
            name: res.data.name,
            image: res.data.profile
          }

          this.employeeService.setAvatar(userInfo);
          // this.router.navigate(
          //   ['pages/employees/index'],
          //   {
          //     state: [
          //       'success',
          //       res.meta.message
          //     ]
          //   }
          // );

        }
      }, error => {
        this.profileFormError = JSON.stringify(error.error) || error;
      })
    }
  }

  closeProfileAlert() {
    this.profileFormError = false;
  }

}
