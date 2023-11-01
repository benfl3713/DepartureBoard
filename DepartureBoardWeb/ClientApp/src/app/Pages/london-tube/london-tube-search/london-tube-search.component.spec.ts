import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LondonTubeSearchComponent } from './london-tube-search.component';

describe('LondonTubeSearchComponent', () => {
  let component: LondonTubeSearchComponent;
  let fixture: ComponentFixture<LondonTubeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LondonTubeSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LondonTubeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
