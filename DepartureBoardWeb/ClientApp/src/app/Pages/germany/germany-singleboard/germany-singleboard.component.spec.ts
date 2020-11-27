import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GermanySingleboardComponent } from './germany-singleboard.component';

describe('GermanySingleboardComponent', () => {
  let component: GermanySingleboardComponent;
  let fixture: ComponentFixture<GermanySingleboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GermanySingleboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GermanySingleboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
