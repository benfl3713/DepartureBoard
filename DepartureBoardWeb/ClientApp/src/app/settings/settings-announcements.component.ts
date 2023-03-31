import { Component, OnInit } from "@angular/core";
import { ControlContainer, FormGroup } from "@angular/forms";

@Component({
  selector: "[formGroup] app-settings-announcements",
  styleUrls: ["./settings.component.css"],
  template: `
    <form [formGroup]="form">
      <h1 class="led">Announcements</h1>
      <p>The following feature's enable different voice announcements when on a departure board</p>
      <mat-slide-toggle
        [checked]="form.controls.announcements_arrivals.value"
        (change)="form.controls.announcements_arrivals.setValue($event.checked)"
        >Arrival Announcements</mat-slide-toggle
      >
      <br />
      <mat-slide-toggle
        [checked]="form.controls.announcements_cctv.value"
        (change)="form.controls.announcements_cctv.setValue($event.checked)"
        >Periodic CCTV Announcement</mat-slide-toggle
      >
      <br />
      <div class="row" *ngIf="form.controls.announcements_cctv.value">
        <div class="col">
          <label>Interval (Minutes)</label>
          <mat-slider
            #cctvScrollSpeed
            min="1"
            max="60"
            step="1"
            [value]="form.controls.announcements_cctv_interval.value"
            color="primary"
            thumbLabel
            (change)="
              form.controls.announcements_cctv_interval.setValue($event.value)
            "
          >
          </mat-slider>
          <mat-hint>{{ cctvScrollSpeed.value }}</mat-hint>
        </div>
        <button
          mat-button
          (click)="SetFormValue('announcements_cctv_interval', 20)"
          style="margin-left: 20px"
          class="btnOrange col-1"
        >
          Reset
        </button>
      </div>
      <mat-slide-toggle
        [checked]="form.controls.announcements_seeItSayItSortIt.value"
        (change)="form.controls.announcements_seeItSayItSortIt.setValue($event.checked)"
        >"See it, Say it, Sort it" Announcement</mat-slide-toggle
      >
      <div class="row" *ngIf="form.controls.announcements_seeItSayItSortIt.value">
        <div class="col">
          <label>Interval (Minutes)</label>
          <mat-slider
            #seeItScrollSpeed
            min="1"
            max="60"
            step="1"
            [value]="form.controls.announcements_seeItSayItSortIt_interval.value"
            color="primary"
            thumbLabel
            (change)="
              form.controls.announcements_seeItSayItSortIt_interval.setValue($event.value)
            "
          >
          </mat-slider>
          <mat-hint>{{ seeItScrollSpeed.value }}</mat-hint>
        </div>
        <button
          mat-button
          (click)="SetFormValue('announcements_seeItSayItSortIt_interval', 20)"
          style="margin-left: 20px"
          class="btnOrange col-1"
        >
          Reset
        </button>
      </div>
      <br /><br />
    </form>
  `,
})
export class SettingsAnnouncementsComponent implements OnInit {
  constructor(private controlContainer: ControlContainer) {}

  public form: FormGroup;

  ngOnInit() {
    this.form = <FormGroup>this.controlContainer.control;
  }

  SetFormValue(key: string, value) {
    this.form.controls[key].setValue(value);
  }
}
