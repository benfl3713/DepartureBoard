import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GermanyBoardsComponent } from './germany-boards.component';

describe('GermanyBoardsComponent', () => {
  let component: GermanyBoardsComponent;
  let fixture: ComponentFixture<GermanyBoardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GermanyBoardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GermanyBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
