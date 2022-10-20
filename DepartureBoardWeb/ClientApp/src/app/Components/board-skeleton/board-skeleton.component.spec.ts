import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSkeletonComponent } from './board-skeleton.component';

describe('BoardSkeletonComponent', () => {
  let component: BoardSkeletonComponent;
  let fixture: ComponentFixture<BoardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardSkeletonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
