import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexComponent } from './index/index.component';
@Component({
  selector: 'ngx-employees',
  template: `
    <router-outlet (activate)="onActivate($event)"></router-outlet>
  `
})
export class EmployeesComponent {

  constructor(private router: Router) { }

  onActivate(componentRef) {
    let eventType = this.router.getCurrentNavigation().extras.state?.[0];
    let eventMessage = this.router.getCurrentNavigation().extras.state?.[1];

    if (eventType && eventMessage && componentRef instanceof IndexComponent) {
      componentRef.formStatus = eventMessage;
      componentRef.statusType = eventType;
    }
  }

}
