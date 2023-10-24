import {Component, OnDestroy, OnInit} from '@angular/core';
import {Marquee} from "dynamic-marquee";
import {LondonTubeService} from "../../../Services/london-tube.service";

@Component({
  selector: 'app-london-tube-singleboard',
  templateUrl: './london-tube-singleboard.component.html',
  styleUrls: ['./london-tube-singleboard.component.css']
})
export class LondonTubeSingleboardComponent implements OnInit, OnDestroy {
  showStopName: boolean = true;
  showClock: boolean = true;
  stopName: string = "Baker Street";
  scrollSpeed = 200;
  departures;

  noBoardsDisplay: boolean;
  time = new Date();
  timeInterval: NodeJS.Timer;
  fetchInterval: NodeJS.Timer;
  marquee: Marquee;

  constructor(private tubeService: LondonTubeService) {
  }

  ngOnInit(): void {
    this.timeInterval = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // this.marquee = new Marquee(
    //   document.getElementById("singleboard-information"),
    //   {
    //     rate: -this.scrollSpeed,
    //   }
    // );
    //
    // const span = document.createElement('span');
    // span.textContent = "Calling at Bob";
    //
    // this.marquee.onAllItemsRemoved(() => {
    //   this.marquee.appendItem("Calling at Bob " + new Date().toLocaleTimeString());
    // });
    //
    // this.marquee.appendItem("Calling at Bob");
    //
    this.getDepartures();
    this.fetchInterval = setInterval(() => this.getDepartures(), 35000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
    clearInterval(this.fetchInterval);
  }

  getDepartures() {
    this.tubeService.getDepartures("940GZZLUBST").subscribe({
      next: (dep) => {
        console.log(dep);
        this.departures = (dep as any[])
      }
    })
  }

  get firstDeparture() {
    if (!this.departures || this.departures.length === 0) {
      return null;
    }

    return this.departures[0];
  }

  get otherDepartures() {
    if (!this.departures || this.departures.length < 2) {
      return [];
    }

    return this.departures.slice(1);
  }
}
