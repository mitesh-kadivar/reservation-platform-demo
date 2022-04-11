import { NbMenuItem } from '@nebular/theme';
import { getUserType } from '../auth/authManager';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Manage Employees',
    icon: 'home-outline',
    link: '/pages/employees/index',
    "hidden" : (getUserType() == 'USER') ? true:false
  },
  {
    title: 'Manage Resources',
    icon: 'browser-outline',
    link: '/pages/resources/index',
  },
  {
    title: 'Manage Booking',
    icon: 'shopping-cart-outline',
    link: '/pages/booking/index',
  },
  {
    title: 'Manage History',
    icon: 'search-outline',
    link: '/pages/booking/history',
  }
];
