import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AboutCustomDepartureComponent } from './about-custom-departure.component';

describe('AboutCustomDepartureComponent', () => {
  let component: AboutCustomDepartureComponent;
  let fixture: ComponentFixture<AboutCustomDepartureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutCustomDepartureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutCustomDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
