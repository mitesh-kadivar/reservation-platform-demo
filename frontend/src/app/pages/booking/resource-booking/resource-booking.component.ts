import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { changeFormater, getAuthenticatedUserData } from '../../../auth/authManager';
import { ResourcesService } from '../../resources/resources.service';
import { BookingService } from '../booking.service';

@Component({
  selector: 'ngx-resource-booking',
  templateUrl: './resource-booking.component.html',
  styleUrls: ['./resource-booking.component.scss']
})
export class ResourceBookingComponent implements OnInit {

  allResources: any;
  resourceBookForm: FormGroup;
  submitted: boolean = false;
  formError: boolean = null;
  user_id: any;
  userData: any;
  statusType: any;

  constructor(private resourcesService: ResourcesService, public formBuilder: FormBuilder, private router: Router, private bookingService: BookingService) { }

  ngOnInit(): void {
    this.resourcesService.getAllResources().subscribe((res: any) => {
      this.allResources = res.data;
    });

    this.resourceBookForm = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      resource: ['', [Validators.required]]
    });

    this.userData = getAuthenticatedUserData();
    this.user_id  = this.userData.id;
  }

  get getControl() {
    return this.resourceBookForm.controls;
  }

  resourceBook() {
    this.submitted = true;
    if (this.resourceBookForm.valid) {
      let updatableData = {
        user_id : this.user_id,
        start_date: changeFormater(this.resourceBookForm.value.start_date),
        end_date: changeFormater(this.resourceBookForm.value.end_date),
        resource: this.resourceBookForm.value.resource,
      }
      
      this.bookingService.resourceBook(updatableData).subscribe((res:any) => {
        console.log(res);
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
