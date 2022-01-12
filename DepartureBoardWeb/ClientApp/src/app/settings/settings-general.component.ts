import { Component, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "[formGroup] app-settings-general",
  styleUrls: ["./settings.component.css"],
  template: `
    <form [formGroup]="form">
      <h1 class="led">General</h1>
      <div class="row">
        <div class="col">
          <label>Main Colour:</label>
          <input formControlName="general_mainColour" type="color" />
        </div>
        <button
          mat-button
          (click)="SetFormValue('general_mainColour', '#ff9729')"
          style="margin-left: 20px"
          class="btnOrange col-1"
        >
          Reset
        </button>
      </div>

      <div class="row">
        <div class="col">
          <label>Background Colour:</label>
          <input formControlName="general_backgroundColour" type="color" />
        </div>
        <button
          mat-button
          (click)="SetFormValue('general_backgroundColour', 'black')"
          style="margin-left: 20px"
          class="btnOrange col-1"
        >
          Reset
        </button>
      </div>
      <div class="row">
        <div class="col">
          <label>UK DataSource:</label>
          <mat-form-field>
            <mat-label>DataSource</mat-label>
            <mat-select formControlName="general_dataSource">
              <mat-option value="REALTIMETRAINS">Real Time Trains</mat-option>
              <mat-option value="NATIONALRAIL">National Rail</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <button
          mat-button
          (click)="SetFormValue('general_dataSource', null)"
          style="margin-left: 20px"
          class="btnOrange col-1"
        >
          Reset
        </button>
      </div>

      <span
        *ngIf="form.controls.general_dataSource.value == 'NATIONALRAIL'"
      >
        <mat-checkbox formControlName="general_includeNonPassengerServices">Include Non Passenger Services</mat-checkbox>
        <br />
      </span>

      <mat-checkbox formControlName="general_betaFeatures"
        >Beta Features</mat-checkbox
      >
      <br />
      <button mat-flat-button color="primary" (click)="changeCookies()">
        Change Cookie Settings
      </button>
      <br /><br />
    </form>
  `,
})
export class SettingsGeneralComponent implements OnInit {
  constructor(
    private controlContainer: ControlContainer,
    private cookieService: CookieService
  ) {}

  public form: FormGroup;

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
  }

  SetFormValue(key: string, value) {
    this.form.controls[key].setValue(value);
  }

  changeCookies() {
    this.cookieService.delete("CookieScriptConsent");
    window.location.reload();
  }
}
