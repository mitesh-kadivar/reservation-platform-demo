import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-date-picker',
  template: `
  <nb-card size="large">
    <nb-card-body>
      <input nbInput placeholder="Pick Date" [nbDatepicker]="dateTimePicker">
      <nb-date-timepicker withSeconds #dateTimePicker></nb-date-timepicker>
    </nb-card-body>
  </nb-card>
  `,
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
  filterFn = (date) => date.getDay() === 0;
  constructor() { }

  ngOnInit(): void {
  }

}
