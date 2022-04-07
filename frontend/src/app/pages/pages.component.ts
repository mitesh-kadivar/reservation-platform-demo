import { Component } from '@angular/core';
import { getUserType } from '../auth/authManager';

import { MENU_ITEMS } from './pages-menu';
import { USER_MENUS } from './user-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu:any;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (getUserType() == 'ADMIN') {
      this.menu = MENU_ITEMS;
    } else {
      this.menu = USER_MENUS;
    }
  }
}
