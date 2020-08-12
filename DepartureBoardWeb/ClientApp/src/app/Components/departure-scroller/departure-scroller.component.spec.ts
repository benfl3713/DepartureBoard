import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartureScrollerComponent } from './departure-scroller.component';

describe('DepartureScrollerComponent', () => {
  let component: DepartureScrollerComponent;
  let fixture: ComponentFixture<DepartureScrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartureScrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartureScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
