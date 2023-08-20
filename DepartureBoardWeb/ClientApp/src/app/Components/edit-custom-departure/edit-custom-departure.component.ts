import {
  Component,
  DoCheck,
  EventEmitter,
  Inject,
  Input,
  KeyValueDiffers,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { CustomDeparture } from "src/app/models/custom-departure.model";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { StationStop } from "src/app/models/departure.model";

@Component({
  selector: "app-edit-custom-departure",
  templateUrl: "./edit-custom-departure.component.html",
  styleUrls: ["./edit-custom-departure.component.css"],
})
export class EditCustomDepartureComponent implements OnInit, DoCheck {
  constructor(public dialog: MatDialog, differs: KeyValueDiffers) {
    this.differ = differs.find({}).create();
  }

  @Input() data: CustomDeparture;
  @Output()
  dataChange: EventEmitter<CustomDeparture> = new EventEmitter<CustomDeparture>();
  differ: any;

  ngOnInit(): void {}

  ngDoCheck(): void {
    var changes = this.differ.diff(this.data);
    if(changes){
      changes.forEachChangedItem(r => console.log('changed ', r.currentValue));
			changes.forEachAddedItem(r => console.log('added ' + r.currentValue));
			changes.forEachRemovedItem(r => console.log('removed ' + r.currentValue));
      this.changedData();
    }
  }

  addDeparture() {
    if (!this.data) {
      this.data = {
        departures: [],
        stationName: null,
      };
    }

    this.data.departures.push({
      destination: null,
      aimedDeparture: new Date(),
      expectedDeparture: new Date(),
      operatorName: null,
      platform: null,
      status: "-1",
      stationCode: null,
      lastUpdated: null,
      length: null,
      origin: null,
      stationName: this.data.stationName,
      stops: [],
      extraDetails: null,
    });

    this.changedData();
  }

  removeDeparture(index: number) {
    if (!confirm("Are you sure you want to delete this departure? (This cannot be undone)")) {
      return;
    }

    this.data.departures.splice(index, 1);
    this.changedData();
  }

  removeStop(departureIndex: number, index: number) {
    this.data.departures[departureIndex]?.stops?.splice(index, 1);
    this.changedData();
  }

  changedData() {
    this.dataChange.emit(this.data);
  }

  openStopDialog(departureIndex: number, existingStop?: StationStop): void {
    const dialogRef = this.dialog.open(DepartureStopDialog, {
      width: "300px",
      data: existingStop ?? ({} as StationStop),
    });

    dialogRef.afterClosed().subscribe((result: StationStop) => {
      if (!result || !result?.stationName || !result.aimedDeparture) {
        return;
      }

      if (existingStop) {
        const stopIndex = this.data.departures[departureIndex].stops.indexOf(
          existingStop
        );
        if (stopIndex) {
          this.data.departures[departureIndex].stops[stopIndex] = result;
        }
      } else {
        this.data.departures[departureIndex].stops.push(result);
      }

      this.changedData();
    });
  }
}

@Component({
  selector: "departure-stop-dialog",
  template: `
    <div>
      <h1 mat-dialog-title>Edit Stop</h1>
      <div mat-dialog-content>
        <mat-form-field style="width: 100%">
          <mat-label>Stop Name</mat-label>
          <input matInput type="text" [(ngModel)]="data.stationName" />
        </mat-form-field>

        <mat-form-field style="width: 100%">
          <mat-label>Aimed Departure</mat-label>
          <input
            matInput
            type="datetime-local"
            [(ngModel)]="data.aimedDeparture"
          />
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Cancel</button>
        <button
          mat-flat-button
          [mat-dialog-close]="data"
          cdkFocusInitial
          color="primary"
        >
          Save
        </button>
      </div>
    </div>
  `,
})
export class DepartureStopDialog {
  constructor(
    public dialogRef: MatDialogRef<DepartureStopDialog>,
    @Inject(MAT_DIALOG_DATA) public data: StationStop
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
