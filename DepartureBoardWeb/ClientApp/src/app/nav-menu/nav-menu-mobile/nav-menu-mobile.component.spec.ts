import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuMobileComponent } from './nav-menu-mobile.component';

describe('NavMenuMobileComponent', () => {
  let component: NavMenuMobileComponent;
  let fixture: ComponentFixture<NavMenuMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavMenuMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
