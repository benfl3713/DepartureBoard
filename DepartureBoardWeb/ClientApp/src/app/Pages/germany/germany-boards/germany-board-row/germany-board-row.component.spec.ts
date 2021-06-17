import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GermanyBoardRowComponent } from './germany-board-row.component';

describe('GermanyBoardRowComponent', () => {
  let component: GermanyBoardRowComponent;
  let fixture: ComponentFixture<GermanyBoardRowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GermanyBoardRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GermanyBoardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
