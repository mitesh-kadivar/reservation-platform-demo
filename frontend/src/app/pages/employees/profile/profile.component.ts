import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { clearUserData, getAuthenticatedUserData, saveUserData } from '../../../auth/authManager';
import { EmployeeService } from '../employee.service';
import { fileExtensionValidator } from '../file-extension-validator.directive';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  loggedUserData: any;
  submitted: boolean = false;
  formError: any = null;
  imageSrc: string;
  statusType: any;
  empId: any;

  constructor(public formBuilder: FormBuilder, private router: Router, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      profile: ['', [fileExtensionValidator('jpg, png, jpeg, JPG, PNG')]],
      description: [''],
    })

    this.loggedUserData = getAuthenticatedUserData();
    this.empId = this.loggedUserData.id;
    this.loggedUserData.photo = (this.loggedUserData.profile) ? environment.imagePath + this.loggedUserData.profile : environment.imagePath + "../../default-user.png";
  }

  get getControl() {
    return this.profileForm.controls;
  }

  onFileChange(event) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }

  updateProfile() {
    this.submitted = true;
    if (this.profileForm.valid) {
      let updatableData = {
        id: null,
        name: this.profileForm.value.name,
        profile: this.imageSrc ?? '',
        description: this.profileForm.value.description
      };
      this.employeeService.profileUpdate(this.empId, updatableData).subscribe((res: any) => {
        if (res.meta.status === false) {
          this.formError = res.meta.message;
          this.statusType = 'danger';
        } else {
         this.formError = res.meta.message;
         this.statusType = 'success';
         clearUserData();
         saveUserData(res.data);
         let userInfo = {
           name: res.data.name,
           image: res.data.profile
         }
         this.employeeService.setAvatar(userInfo);
         this.router.navigateByUrl('pages/employees/index');
        }
      }, error => {
        this.formError = JSON.stringify(error.error) || error;
      })

    }
  }

}
