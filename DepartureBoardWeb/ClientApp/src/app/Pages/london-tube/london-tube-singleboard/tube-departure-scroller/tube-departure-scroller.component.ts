import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-tube-departure-scroller",
  templateUrl: "./tube-departure-scroller.component.html",
  styleUrls: ["../london-tube-singleboard.component.css"],
})
export class TubeDepartureScrollerComponent implements OnInit, OnChanges {
  @Input() departures = [];
  @Input() enableScroll: boolean = true;
  @Input() useArrivals: boolean = false;
  @Input() startingNumber: number = 2;
  index = 0;
  timer;
  currentCount;
  currentDeparture;
  constructor(private router: Router, private http: HttpClient) {
    if (this.enableScroll == true) {
      this.timer = setInterval(() => this.changeDeparture(), 15000);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.departures.length > 0 &&
      !this.arraysAreEqual(
        changes.departures.currentValue,
        changes.departures.previousValue
      )
    ) {

      this.index = 0;
      this.setDeparture(this.departures[0], this.startingNumber);
    }

    if (this.enableScroll === true && !this.timer) {
      this.timer = setInterval(() => this.changeDeparture(), 15000);
    } else if (this.enableScroll === false && this.timer) {
      clearInterval(this.timer);
    }
  }

  ngOnInit() {}

  changeDeparture() {
    if (!this.departures || this.departures.length === 0) {
      return;
    }

    if (this.index >= this.departures.length - 1) {
      this.index = 0;
    } else {
      this.index++;
    }

    return this.setDeparture(this.departures[this.index], this.index + this.startingNumber);
  }

  setDeparture(departure, count: number) {
    this.currentDeparture = departure;
    this.currentCount = count;
  }

  arraysAreEqual(ary1, ary2) {
    if (!ary1 || !ary2) {
      return false;
    }

    // Remove lastUpdated value as this will change every time
    ary1.map((d) => delete d.lastUpdated);
    ary2.map((d) => delete d.lastUpdated);

    return JSON.stringify(ary1) === JSON.stringify(ary2);
  }

  // ChangeStation(stationName: string) {
  //   this.http
  //     .get(
  //       environment.apiBaseUrl +
  //         "/api/StationLookup/GetStationCodeFromName?name=" +
  //         stationName
  //     )
  //     .subscribe((s) => {
  //       if (this.useArrivals) {
  //         this.router.navigate(["singleboard/arrivals/", s]);
  //       } else {
  //         this.router.navigate(["singleboard/", s]);
  //       }
  //     });
  // }
}
