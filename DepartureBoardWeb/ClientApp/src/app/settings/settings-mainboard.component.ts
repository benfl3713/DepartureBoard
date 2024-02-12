import { Component, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";

@Component({
  selector: "[formGroup] app-settings-mainboard",
  styleUrls: ["./settings.component.css"],
  template: `
    <form [formGroup]="form">
      <h1 class="led">Main Board</h1>
      <mat-form-field>
        <mat-label>Default Board Count</mat-label>
        <input
          type="number"
          aria-label="default board count"
          matInput
          formControlName="mainboard_count"
        />
      </mat-form-field>
      <button
        mat-button
        (click)="SetFormValue('mainboard_count', 6)"
        style="margin-left: 20px"
        class="btnOrange"
      >
        Reset
      </button>
      <br />
      <mat-slide-toggle
        [checked]="form.controls.mainboard_showStationName.value"
        (change)="
          form.controls.mainboard_showStationName.setValue($event.checked)
        "
        >Show Station Name</mat-slide-toggle
      >
      <br />
      <mat-slide-toggle
        [checked]="form.controls.mainboard_boardsCenter.value"
        (change)="
          form.controls.mainboard_boardsCenter.setValue($event.checked)
        "
      >Show boards in the center of screen</mat-slide-toggle
      >
      <br />
    </form>
  `,
})
export class SettingsMainboardComponent implements OnInit {
  constructor(private controlContainer: ControlContainer) {}

  public form: FormGroup;

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
  }

  SetFormValue(key: string, value) {
    this.form.controls[key].setValue(value);
  }
}
