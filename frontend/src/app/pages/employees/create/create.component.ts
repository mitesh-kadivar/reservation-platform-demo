import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  registerForm: FormGroup;
  submitted: boolean = false;
  formError: any = null;
  
  constructor(public formBuilder: FormBuilder) { 
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  get getControl() {
    return this.registerForm.controls;
  }

  registerEmployee() {
    this.submitted = true;

    if (this.registerForm.valid) {
      console.log(this.registerForm.value); 
    }
  }
  
}
