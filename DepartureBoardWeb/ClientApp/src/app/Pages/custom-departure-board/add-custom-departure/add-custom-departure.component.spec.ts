import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomDepartureComponent } from './add-custom-departure.component';

describe('AddCustomDepartureComponent', () => {
  let component: AddCustomDepartureComponent;
  let fixture: ComponentFixture<AddCustomDepartureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomDepartureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
