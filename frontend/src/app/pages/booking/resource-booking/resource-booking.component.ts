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
  formError: any = null;
  user_id: any;
  userData: any;
  statusType: any;
  status: boolean = false;
  error:any={isError:false,errorMessage:''};
  isValidDate:any;
  minDate:any;
  selectedStartDate:any;
  selectedEndDate:any;

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
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 1);
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

      this.isValidDate = this.validateDates(updatableData.start_date, updatableData.end_date);
      if (!this.isValidDate) {
        return this.router.navigateByUrl('/pages/booking/resource-book');
      }
      // Check Resource avilable or not
      this.bookingService.checkResourceBooked(updatableData).subscribe((res: any) => {
        if (res.meta.status === true) {   // true: avilable  false: booked
          this.error.isError = false;
          this.bookingService.resourceBook(updatableData).subscribe((res:any) => {
            if (res.meta.status === false) {
              this.formError = (res.meta.message == "error.Undefined offset: 1") ? "Oops Something went wrong, Please try again.!" : res.meta.message;
              this.statusType = 'danger';
            } else {
             this.formError = res.meta.message;
             this.statusType = 'success';
             this.router.navigateByUrl('/pages/booking/index?status=add_successful');
            }
          }, error => {
            this.formError = JSON.stringify(error.error) || error;
          })
        } else {
          this.formError = "Already resource is booked";
          this.statusType = 'danger';
          this.error.isError = false;
          this.router.navigateByUrl('/pages/booking/resource-book');
        }
      });
    }
  }

  getStartDate($event) {
    this.selectedStartDate = new Date($event);
  }
  getEndDate($event) {
    this.selectedEndDate = new Date($event);
  }

  validateDates(sDate: string, eDate: string){
    this.isValidDate = true;
    if((sDate == null || eDate ==null)){
      this.error={isError:true,errorMessage:'Start date and end date are required.'};
      this.isValidDate = false;
    }

    if((sDate != null && eDate !=null) && (eDate) < (sDate)){
      this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

}
