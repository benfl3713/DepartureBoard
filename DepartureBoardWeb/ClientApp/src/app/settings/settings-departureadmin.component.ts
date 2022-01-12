import { Component, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";

@Component({
  selector: "[formGroup] app-settings-departureadmin",
  styleUrls: ["./settings.component.css"],
  template: `
    <form [formGroup]="form">
      <h1 class="led">Departure Admin</h1>

      <h6>
        To get your Unique id add a new board in
        <a href="https://admin.leddepartureboard.com" target="_blank"
          >departure board admin</a
        >
      </h6>
      <mat-form-field style="width: 300px">
        <mat-label>Unique Id</mat-label>
        <input
          type="text"
          aria-label="departure admin id"
          matInput
          formControlName="departureadmin_uid"
        />
        <mat-hint>From Departure Board Admin</mat-hint>
      </mat-form-field>
      <br />
      <mat-slide-toggle
        [checked]="form.controls.departureadmin_enabled.value"
        (change)="
          form.controls.departureadmin_enabled.setValue($event.checked)
        "
        >Enable Board</mat-slide-toggle
      >
      <br />
      <a
        class="orangeBtn"
        [routerLink]="['/about/departureboard-admin']"
        target="_blank"
        mat-button
        >Learn More</a
      >
      <br /><br />
    </form>
  `,
})
export class SettingsDepartureadminComponent implements OnInit {
  constructor(private controlContainer: ControlContainer) {}

  public form: FormGroup;

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
  }

  SetFormValue(key: string, value) {
    this.form.controls[key].setValue(value);
  }
}
