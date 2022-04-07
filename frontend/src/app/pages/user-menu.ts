import { NbMenuItem } from '@nebular/theme';

export const USER_MENUS: NbMenuItem[] = [
  {
    title: 'Manage Resources',
    icon: 'home-outline',
    link: '/pages/resources/index',
  },
  {
    title: 'Manage Booking',
    icon: 'shopping-cart-outline',
    link: '/pages/booking/resource-book',
  },
  {
    title: 'Profile management',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Layout',
    icon: 'layout-outline',
    children: [
      {
        title: 'Stepper',
        link: '/pages/layout/stepper',
      },
      {
        title: 'List',
        link: '/pages/layout/list',
      },
      {
        title: 'Infinite List',
        link: '/pages/layout/infinite-list',
      },
      {
        title: 'Accordion',
        link: '/pages/layout/accordion',
      },
      {
        title: 'Tabs',
        pathMatch: 'prefix',
        link: '/pages/layout/tabs',
      },
    ],
  }
];
