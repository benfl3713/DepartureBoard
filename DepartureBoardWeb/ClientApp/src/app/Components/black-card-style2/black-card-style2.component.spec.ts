import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackCardStyle2Component } from './black-card-style2.component';

describe('BlackCardStyle2Component', () => {
  let component: BlackCardStyle2Component;
  let fixture: ComponentFixture<BlackCardStyle2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlackCardStyle2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackCardStyle2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
