import { Component } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Event } from '@angular/router';
@Component({
  selector: 'ngx-booking',
  templateUrl: './booking.component.html',
})
export class BookingComponent {

  add_flag: boolean = false;
  edit_flag: boolean = false;
  message: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.route.queryParams.subscribe(params => {
          if (params['status'] == 'add_successful') {
            this.add_flag = true;
            this.edit_flag = false;
          } else {
            this.edit_flag = false;
            this.add_flag = false;
          }
          this.message = this.messages[params['status']];
        });
      }
    })
  }

  messages = {
    edit_successful: "The resource details are updated successfully",
    add_successful: "Resource order booked successfully",
  };

  closeAlert(): void {
    this.edit_flag = false;
    this.add_flag = false;
  }
}
