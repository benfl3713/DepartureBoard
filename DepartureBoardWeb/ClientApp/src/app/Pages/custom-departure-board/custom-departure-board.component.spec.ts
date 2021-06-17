import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomDepartureBoardComponent } from './custom-departure-board.component';

describe('CustomDepartureBoardComponent', () => {
  let component: CustomDepartureBoardComponent;
  let fixture: ComponentFixture<CustomDepartureBoardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDepartureBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDepartureBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
