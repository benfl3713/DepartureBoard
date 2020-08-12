import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Departure } from "src/app/models/departure.model";

@Component({
  selector: "app-departure-scroller",
  templateUrl: "./departure-scroller.component.html",
  styleUrls: ["./departure-scroller.component.css"],
})
export class DepartureScrollerComponent implements OnInit, OnChanges {
  @Input() departures: Departure[] = [];
  index = 0;
  currentCount;
  currentTime;
  currentPlatform;
  currentDestination;
  currentStatus;
  constructor() {
    setInterval(() => this.changeDeparture(), 15000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(
      this.arraysAreEqual(
        changes.departures.currentValue,
        changes.departures.previousValue
      )
    );
    if (
      this.departures.length > 0 &&
      !this.arraysAreEqual(
        changes.departures.currentValue,
        changes.departures.previousValue
      )
    ) {
      this.index = 0;
      this.currentCount = 2;
      this.setDeparture(this.departures[0]);
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

    this.currentCount = this.index + 2;
    return this.setDeparture(this.departures[this.index]);
  }

  setDeparture(departure: Departure) {
    this.currentTime = departure.aimedDeparture;
    this.currentPlatform = departure.platform;
    this.currentDestination = departure.destination;
    this.currentStatus = departure.status;
  }

  getNumberWithOrdinal(n) {
    if (!n) {
      return "";
    }
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  arraysAreEqual(ary1, ary2) {
    return ary1.join("") === ary2.join("");
  }
}
