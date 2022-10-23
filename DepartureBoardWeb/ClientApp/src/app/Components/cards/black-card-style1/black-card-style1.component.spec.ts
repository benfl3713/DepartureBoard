import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackCardStyle1Component } from './black-card-style1.component';

describe('BlackCardStyle1Component', () => {
  let component: BlackCardStyle1Component;
  let fixture: ComponentFixture<BlackCardStyle1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlackCardStyle1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackCardStyle1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
