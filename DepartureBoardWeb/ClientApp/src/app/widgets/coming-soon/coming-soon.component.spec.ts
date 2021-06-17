import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ComingSoonWidgetComponent } from "./coming-soon.component";

describe("ComingSoonComponent", () => {
  let component: ComingSoonWidgetComponent;
  let fixture: ComponentFixture<ComingSoonWidgetComponent>;

  beforeEach(waitForAsync(() => {
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
