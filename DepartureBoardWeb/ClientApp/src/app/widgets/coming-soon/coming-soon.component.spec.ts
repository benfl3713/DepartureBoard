import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ComingSoonWidgetComponent } from "./coming-soon.component";

describe("ComingSoonComponent", () => {
  let component: ComingSoonWidgetComponent;
  let fixture: ComponentFixture<ComingSoonWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComingSoonWidgetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComingSoonWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
