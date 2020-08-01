import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusSingleboardComponent } from './bus-singleboard.component';

describe('BusSingleboardComponent', () => {
  let component: BusSingleboardComponent;
  let fixture: ComponentFixture<BusSingleboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusSingleboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusSingleboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
