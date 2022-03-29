import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  editRegisterForm: FormGroup;
  submitted: boolean = false;
  formError: any = null;
  
  constructor(public formBuilder: FormBuilder) { 
  }

  ngOnInit(): void {
    this.editRegisterForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  get getControl() {
    return this.editRegisterForm.controls;
  }

  updateEmployee() {
    this.submitted = true;

    if (this.editRegisterForm.valid) {
      console.log(this.editRegisterForm.value); 
    }
  }

}
