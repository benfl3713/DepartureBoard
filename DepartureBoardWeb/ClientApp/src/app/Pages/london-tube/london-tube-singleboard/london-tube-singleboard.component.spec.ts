import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LondonTubeSingleboardComponent } from './london-tube-singleboard.component';

describe('LondonTubeSingleboardComponent', () => {
  let component: LondonTubeSingleboardComponent;
  let fixture: ComponentFixture<LondonTubeSingleboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LondonTubeSingleboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LondonTubeSingleboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
