import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCustomDepartureComponent } from './edit-custom-departure.component';

describe('EditCustomDepartureComponent', () => {
  let component: EditCustomDepartureComponent;
  let fixture: ComponentFixture<EditCustomDepartureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomDepartureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomDepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
