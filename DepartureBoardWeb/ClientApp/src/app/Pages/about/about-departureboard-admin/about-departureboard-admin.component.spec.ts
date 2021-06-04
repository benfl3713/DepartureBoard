import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AboutDepartureboardAdminComponent } from './about-departureboard-admin.component';

describe('AboutDepartureboardAdminComponent', () => {
  let component: AboutDepartureboardAdminComponent;
  let fixture: ComponentFixture<AboutDepartureboardAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDepartureboardAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDepartureboardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
