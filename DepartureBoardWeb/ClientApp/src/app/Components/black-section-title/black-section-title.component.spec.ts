import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackSectionTitleComponent } from './black-section-title.component';

describe('BlackSectionTitleComponent', () => {
  let component: BlackSectionTitleComponent;
  let fixture: ComponentFixture<BlackSectionTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlackSectionTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackSectionTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
