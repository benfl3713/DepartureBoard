import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-london-tube-singleboard',
  templateUrl: './london-tube-singleboard.component.html',
  styleUrls: ['./london-tube-singleboard.component.css']
})
export class LondonTubeSingleboardComponent implements OnInit, OnDestroy {
  showStopName: boolean = true;
  showClock: boolean = true;
  stopName: string = "Test Station";
  departures = [
    {
      destination: "Ealing Broadway",
      status: ''
    },
    {
      destination: "Northfields",
      status: '2 mins'
    },
    {
      destination: "Leicester Square",
      status: '5 mins'
    }
  ];

  noBoardsDisplay: boolean;
  time = new Date();
  timeInterval: NodeJS.Timer;

  ngOnInit(): void {
    this.timeInterval = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
  }
}
