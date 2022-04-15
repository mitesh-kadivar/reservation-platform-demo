import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { EmployeeService } from '../employee.service';
import { fileExtensionValidator } from '../file-extension-validator.directive';

@Component({
  selector: 'ngx-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  editRegisterForm: FormGroup;
  submitted: boolean = false;
  formError: any = null;
  empId: any;
  employee: any = [];
  imageSrc: string;
  statusType: any;
  
  constructor(public formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService) { 
  }

  ngOnInit(): void {
    this.editRegisterForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      profile: ['', [fileExtensionValidator('jpg, png, jpeg, JPG, PNG')]],
      description: [''],
    })

    this.empId = atob(this.route.snapshot.params['empId']);
    this.employeeService.find(this.empId).subscribe((res: any)=>{
      this.employee = res.data;
      this.employee.photo = (this.employee.profile) ? environment.imagePath + this.employee.profile : environment.imagePath + "../../default-user.png";
    });
  }

  get getControl() {
    return this.editRegisterForm.controls;
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

  updateEmployee() {
    this.submitted = true;

    if (this.editRegisterForm.valid) {
      let updatableData = {
        id: null,
        name: this.editRegisterForm.value.name,
        email: this.editRegisterForm.value.email,
        profile: this.imageSrc ?? '',
        description: this.editRegisterForm.value.description
      };
      this.employeeService.update(this.empId, updatableData).subscribe((res: any) => {
        this.formError = res.meta.message;
        if (res.meta.status === false) {
          this.statusType = 'danger';
        } else {
          this.statusType = 'success';
          this.router.navigate(
            ['pages/employees/index'],
            {
              state: [
                'success',
                res.meta.message
              ]
            }
          );
        }
      }, error => {
        this.formError = JSON.stringify(error.error) || error;
      })

    }
  }

}
