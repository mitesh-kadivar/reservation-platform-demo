import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourcesService } from '../resources.service';
import { fileExtensionValidator } from '../../employees/file-extension-validator.directive';

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
  allCategories: any;
  resource: any;

  constructor(public formBuilder: FormBuilder, private resourceService: ResourcesService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      image: ['', [fileExtensionValidator('jpg, png, jpeg, JPG, PNG')]]
    });

    this.resourceService.getCategories().subscribe((res: any) => {
      this.allCategories = res.data;
    });
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
          image: this.imageSrc
        });
      };
    }
  }

  createResource() {
    this.submitted = true;

    if (this.registerForm.valid) {
      this.resourceService.createResource(this.registerForm.value).subscribe((res:any) => {
        if (res.meta.status === false) {
          this.formError = (res.meta.message == "error.Undefined offset: 1") ? "Oops Something went wrong, Please try again.!" : res.meta.message;
          this.statusType = 'danger';
        } else {
         this.formError = res.meta.message;
         this.statusType = 'success';
         this.router.navigateByUrl('pages/resources/index');
        }
      }, error => {
        this.formError = JSON.stringify(error.error) || error;
      })
    }
  }
}
