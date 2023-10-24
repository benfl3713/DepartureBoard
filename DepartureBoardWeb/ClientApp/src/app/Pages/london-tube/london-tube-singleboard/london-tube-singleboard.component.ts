import {Component, OnDestroy, OnInit} from '@angular/core';
import {Marquee} from "dynamic-marquee";
import {LondonTubeService} from "../../../Services/london-tube.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-london-tube-singleboard',
  templateUrl: './london-tube-singleboard.component.html',
  styleUrls: ['./london-tube-singleboard.component.css']
})
export class LondonTubeSingleboardComponent implements OnInit, OnDestroy {
  showStopName: boolean = true;
  showClock: boolean = true;
  stopName: string = "";
  scrollSpeed = 200;

  departures?: any[];
  stationCode: string;

  noBoardsDisplay: boolean;
  departureCount: number = 4;
  time = new Date();
  timeInterval: NodeJS.Timer;
  fetchInterval: NodeJS.Timer;
  marquee: Marquee;

  constructor(private tubeService: LondonTubeService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.timeInterval = setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.route.paramMap.subscribe(params => {
      this.stationCode = params.get('station');
      if (!this.stationCode) {
        this.noBoardsDisplay = true;
        return;
      }

      if (params.has('count')) {
        this.departureCount = parseInt(params.get('count'));
      }

      this.setStationInfo();
      this.getDepartures();
      this.fetchInterval = setInterval(() => this.getDepartures(), 35000);
    });

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
  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
    clearInterval(this.fetchInterval);
  }

  getDepartures() {
    this.tubeService.getDepartures(this.stationCode, this.departureCount).subscribe({
      next: (dep) => {
        this.departures = (dep as any[]).map(d => ({
          ...d,
          status: this.getDepartureStatus(d),
        }))
      }
    })
  }

  getDepartureStatus(d: any) {
    const timeTillArrive = parseInt(d.timeToStation ?? 0);
    let text = `${timeTillArrive} min`;

    if (timeTillArrive >= 2) {
      text += "s";
    }
    else {
      text += " ";
    }

    return text;
  }

  setStationInfo() {
    this.tubeService.getStationInfo(this.stationCode).subscribe({
      next: (info) => {
        this.stopName = info.name;
      }
    });
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
