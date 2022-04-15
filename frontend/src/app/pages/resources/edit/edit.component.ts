import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fileExtensionValidator } from '../../employees/file-extension-validator.directive';
import { ResourcesService } from '../resources.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  editRegisterForm: FormGroup;
  submitted: boolean = false;
  formError: boolean = null;
  resourceId: any;
  resource: any = [];
  allCategories: any;
  imageSrc: any;
  statusType: any;

  constructor(public formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private resourcesService: ResourcesService) { }

  ngOnInit(): void {
    this.editRegisterForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      image: ['', [fileExtensionValidator('jpg, png, jpeg, JPG, PNG')]],
    });

    this.resourceId = atob(this.route.snapshot.params['resourceId']);

    this.resourcesService.find(this.resourceId).subscribe((res: any)=>{
      this.resource = res.data;
      this.resource.image = (this.resource.image) ? environment.resourceImagePath + this.resource.image : environment.resourceImagePath + "../../default-user.png";
      this.editRegisterForm.get('category').setValue(this.resource.category_id);
    });

    this.resourcesService.getCategories().subscribe((res: any) => {
      this.allCategories = res.data;
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
        this.imageSrc = reader.result;
      };
    }
  }

  updateResource() {
    this.submitted = true;

    if (this.editRegisterForm.valid) {
      let updatableData = {
        id: this.resourceId,
        title: this.editRegisterForm.value.title,
        category_id: this.editRegisterForm.value.category,
        image: this.imageSrc,
      };
      this.resourcesService.update(updatableData).subscribe((res: any) => {
        this.formError = res.meta.message;
        if (res.meta.status === false) {
          this.statusType = 'danger';
        } else {
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
