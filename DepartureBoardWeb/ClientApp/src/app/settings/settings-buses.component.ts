import { Component, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";

@Component({
  selector: "[formGroup] app-settings-buses",
  styleUrls: ["./settings.component.css"],
  template: `
    <form [formGroup]="form">
      <h1 class="led">Buses</h1>
      <mat-slide-toggle
        [checked]="form.controls.buses_showStopName.value"
        (change)="form.controls.buses_showStopName.setValue($event.checked)"
        >Show Stop Name</mat-slide-toggle
      >
      <br />
      <mat-slide-toggle
        [checked]="form.controls.buses_includeBothDirection.value"
        (change)="form.controls.buses_includeBothDirection.setValue($event.checked)"
      >TFL Include Both Direction Stops</mat-slide-toggle
      >
      <br /><br />
    </form>
  `,
})
export class SettingsBusesComponent implements OnInit {
  constructor(private controlContainer: ControlContainer) {}

  public form: FormGroup;

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
  }

  SetFormValue(key: string, value) {
    this.form.controls[key].setValue(value);
  }
}
