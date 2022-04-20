import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { getAuthenticatedUserData } from '../../../auth/authManager';
import { environment } from '../../../../environments/environment';
import { EmployeeService } from '../../../pages/employees/employee.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [
    // { title: 'Profile' },
    // { title: "Change Password" },
    { title: "User Profile" },
    { title: "Log out" }
  ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private authService: AuthService,
              private router: Router,
              private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

      const userData = getAuthenticatedUserData();
      this.employeeService.getAvatar().subscribe(res => {
        if (res) {
          this.user.name    = res.name;
          this.user.picture = (res.image) ? environment.imagePath + res.image : environment.imagePath + "../../default-user.png";
        }
      });
      let profile = (userData.profile) ? environment.imagePath + userData.profile : environment.imagePath + "../../default-user.png";
      this.user = {
        name: userData.name,
        picture: profile
      }

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === 'Log out') {
        this.authService.logout();
        this.router.navigate(['/auth']);
      // } else if (event.item.title === 'Change Password') {
      //   this.router.navigate(['/pages/employees/change-password']);
      } else if (event.item.title === "User Profile") {
        this.router.navigate(['/pages/employees/user-profile']);
      }// else if (event.item.title === 'Profile') {
      //   this.router.navigate(['/pages/employees/profile']);
      // }
     });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
