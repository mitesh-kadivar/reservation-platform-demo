import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceBookingComponent } from './resource-booking.component';

describe('ResourceBookingComponent', () => {
  let component: ResourceBookingComponent;
  let fixture: ComponentFixture<ResourceBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
