import { Component, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";

@Component({
  selector: "[formGroup] app-settings-singleboard",
  styleUrls: ["./settings.component.css"],
  template: `
    <form [formGroup]="form">
      <h1 class="led">Singleboard</h1>
      <mat-slide-toggle
        [checked]="form.controls.singleboard_showStationName.value"
        (change)="
          form.controls.singleboard_showStationName.setValue($event.checked)
        "
        >Show Station Name</mat-slide-toggle
      ><br />
      <mat-slide-toggle
        [checked]="form.controls.singleboard_alternateSecondRow.value"
        (change)="
          form.controls.singleboard_alternateSecondRow.setValue($event.checked)
        "
        >Alternate Second Row</mat-slide-toggle
      ><br />
      <mat-slide-toggle
        [checked]="form.controls.singleboard_showPlatforms.value"
        (change)="
          form.controls.singleboard_showPlatforms.setValue($event.checked)
        "
        >Show Platforms</mat-slide-toggle
      ><br />
      <div class="row">
        <div class="col">
          <label>Scroll Speed</label>
          <input type="range"
            #singleboardScrollSpeed
            min="0"
            max="500"
            step="50"
            [value]="form.controls.singleboard_scrollspeed.value"
            color="primary"
            (change)="
              form.controls.singleboard_scrollspeed.setValue($event.target['value'])
            "
          />
          <mat-hint>{{ singleboardScrollSpeed.value }}</mat-hint>
        </div>
        <button
          mat-button
          (click)="SetFormValue('singleboard_scrollspeed', 300)"
          style="margin-left: 20px"
          class="btnOrange col-1"
        >
          Reset
        </button>
      </div>
      <br />
      <div class="row">
        <div class="col">
          <label>Font Size</label>
          <input type="range"
            #singleboardFontSize
            min="20"
            max="80"
            step="5"
            [value]="form.controls.singleboard_fontsize.value"
            color="primary"
            (change)="
              form.controls.singleboard_fontsize.setValue($event.target['value'])
            "
          />
          <mat-hint>{{ singleboardFontSize.value }}</mat-hint>
        </div>
        <button
          mat-button
          (click)="SetFormValue('singleboard_fontsize', null)"
          style="margin-left: 20px"
          class="btnOrange col-1"
        >
          Reset
        </button>
      </div>
      <br />
    </form>
  `,
})
export class SettingsSingleboardComponent implements OnInit {
  constructor(private controlContainer: ControlContainer) {}

  public form: FormGroup;

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
  }

  SetFormValue(key: string, value) {
    this.form.controls[key].setValue(value);
  }
}
