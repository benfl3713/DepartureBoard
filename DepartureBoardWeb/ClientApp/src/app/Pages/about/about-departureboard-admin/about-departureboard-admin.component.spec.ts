import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDepartureboardAdminComponent } from './about-departureboard-admin.component';

describe('AboutDepartureboardAdminComponent', () => {
  let component: AboutDepartureboardAdminComponent;
  let fixture: ComponentFixture<AboutDepartureboardAdminComponent>;

  beforeEach(async(() => {
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
