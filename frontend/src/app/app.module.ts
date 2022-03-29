/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
 import { BrowserModule } from '@angular/platform-browser';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { NgModule } from '@angular/core';
 import { HttpClientModule } from '@angular/common/http';
 import { CoreModule } from './@core/core.module';
 import { ThemeModule } from './@theme/theme.module';
 import { AppComponent } from './app.component';
 import { AppRoutingModule } from './app-routing.module';
 import {
   NbChatModule,
   NbDatepickerModule,
   NbDialogModule,
   NbMenuModule,
   NbSidebarModule,
   NbToastrModule,
   NbWindowModule,
 } from '@nebular/theme';
 import {
   NbAuthJWTToken,
   NbAuthModule,
   NbPasswordAuthStrategy,
   NbTokenLocalStorage,
   NbTokenStorage,
 } from '@nebular/auth';
 import { environment } from '../environments/environment';
 
 @NgModule({
   declarations: [AppComponent],
   imports: [
     BrowserModule,
     BrowserAnimationsModule,
     HttpClientModule,
     AppRoutingModule,
     NbSidebarModule.forRoot(),
     NbMenuModule.forRoot(),
     NbDatepickerModule.forRoot(),
     NbDialogModule.forRoot(),
     NbWindowModule.forRoot(),
     NbToastrModule.forRoot(),
     NbChatModule.forRoot({
       messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
     }),
     CoreModule.forRoot(),
     ThemeModule.forRoot(),
     NbAuthModule.forRoot({
       strategies: [
         NbPasswordAuthStrategy.setup({
           name: "email",
           baseEndpoint: environment.baseURL,
           login: {
             endpoint: "auth/login",
             method: "post",
             redirect: {
               success: "/pages/employees/index",
               failure: null
             }
           },
           register: false,
           token: {
             class: NbAuthJWTToken,
           },
         }),
       ],
       forms: {
         login: {
           alwaysFail: true,
           rememberMe: true,
           socialLinks: false,
           redirect: {
             success: '/dashboard',
             failure: '/dashboard',
           }
         },
         validation: {
           email: {
             required: true
           },
           password: {
             required: true,
             minLength: 8
           },
         }
       },
     }),
   ],
   bootstrap: [AppComponent],
   providers: [
     {
       provide: NbTokenStorage,
       useClass: NbTokenLocalStorage
     }
   ]
 })
 export class AppModule {
 }
 