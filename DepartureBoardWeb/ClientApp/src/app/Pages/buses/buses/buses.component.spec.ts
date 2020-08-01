import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusesComponent } from './buses.component';

describe('BusesComponent', () => {
  let component: BusesComponent;
  let fixture: ComponentFixture<BusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
