import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { fileExtensionValidator } from '../file-extension-validator.directive';

@Component({
  selector: 'ngx-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  registerForm: FormGroup;
  submitted: boolean = false;
  imageSrc: string;
  formError: any = null;
  statusType: any;
  
  constructor(public formBuilder: FormBuilder, private employeeService: EmployeeService, private router: Router) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      profile: ['', [fileExtensionValidator('jpg, png, jpeg, JPG, PNG')] ],
      description: ['']
    })
  }

  get getControl() {
    return this.registerForm.controls;
  }

  onFileChange(event) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.registerForm.patchValue({
          profile: this.imageSrc
        });
      };
    }
  }

  registerEmployee() {
    this.submitted = true;

    if (this.registerForm.valid) {
      this.employeeService.createEmployee(this.registerForm.value).subscribe((res:any) => {
        if (res.meta.status === false) {
          this.formError = (res.meta.message == "error.Undefined offset: 1") ? "Oops Something went wrong, Please try again.!" : res.meta.message;
          this.statusType = 'danger';
        } else {
         this.formError = res.meta.message;
         this.statusType = 'success';
         this.router.navigateByUrl('pages/employees/index');
        }
      }, error => {
        this.formError = JSON.stringify(error.error) || error;
      })
    }
  }
  
}
