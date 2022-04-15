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
      };
    }
  }

  createResource() {
    this.submitted = true;

    if (this.registerForm.valid) {
      let resourceData =  {
        title: this.registerForm.get('title').value,
        category_id: this.registerForm.get('category_id').value,
        image: this.imageSrc,
      };
      this.resourceService.createResource(resourceData).subscribe((res:any) => {
        if (res.meta.status === false) {
          this.formError = (res.meta.message == "error.Undefined offset: 1") ? "Oops Something went wrong, Please try again.!" : res.meta.message;
          this.statusType = 'danger';
        } else {
          this.formError = res.meta.message;
          this.statusType = 'success';
          this.router.navigate(
            ['pages/resources/index'],
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
