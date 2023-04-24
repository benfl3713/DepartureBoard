import {Component, OnInit} from "@angular/core";
import {BusDepartureService} from "src/app/Services/bus-departure.service";
import {ActivatedRoute} from "@angular/router";
import {ToggleConfig} from "src/app/ToggleConfig";
import {tap, catchError} from "rxjs/operators";
import {NotifierService} from "angular-notifier";
import {of} from "rxjs";

@Component({
  selector: "app-bus-singleboard",
  templateUrl: "./bus-singleboard.component.html",
  styleUrls: ["./bus-singleboard.component.css"],
})
export class BusSingleboardComponent implements OnInit {
  constructor(
    private busDepartureService: BusDepartureService,
    private route: ActivatedRoute,
    private notifierService: NotifierService
  ) {
    route.params.subscribe((par) => {
      route.queryParams.subscribe((qur) => {
        this.SetupBoard(par, qur);
      });
    });
  }

  atco: string;
  dataSource: string;
  count: number = 4;
  noBoardsDisplay: boolean = false;
  stopName: string = "";
  showStopName: boolean =
    localStorage.getItem("settings_buses_showStopName") == "true" || false;

  ngOnInit() {
  }

  SetupBoard(params, queryParams) {
    this.atco = params.atco;
    this.dataSource = queryParams.datasource;
    this.count = queryParams.count ?? this.count;
    setInterval(() => this.GetDepartures(), 30000);
    ToggleConfig.LoadingBar.next(true);
    this.GetDepartures();
  }

  GetDepartures() {
    this.busDepartureService
      .GetDepartures(this.atco, this.count, this.dataSource)
      .pipe(tap(() => ToggleConfig.LoadingBar.next(false)))
      .pipe(
        tap((data) => {
          this.noBoardsDisplay = data.length === 0;
          if (data.length > 0) {
            this.stopName = (<any>data[0]).stopName;
          }
        })
      )
      .subscribe((response) => (this.departures = response));
  }

  departures: any = [];

  CalculateStatus(departure) {
    if (departure.isCancelled === true) {
      return "cancelled";
    }

    let currentDate = new Date();
    let msDifference =
      currentDate.getTime() - new Date(departure.expectedDeparture).getTime();
    let minutes = Math.floor(msDifference / 1000 / 60) * -1;

    return minutes <= 0 ? "due" : `${minutes}min`;
  }

  GetLineColour(departure: any) {
    if (this.dataSource !== "TFLTUBE") return;

    if (this.tubeColours[departure.line]) {
      return {'color': this.tubeColours[departure.line]}
    }

    return {};
  }

  tubeColours = {
    Bakerloo: '#B36305',
    Central: '#E32017',
    Circle: '#FFD300',
    District: '#00782A',
    Elizabeth: '#6950a1',
    "Hammersmith & City": '#F3A9BB',
    Jubilee: '#A0A5A9',
    Metropolitan: '#9B0056',
    Piccadilly: '#003688',
    Victoria: '#0098D4',
    "Waterloo & City": '#95CDBA',
    DLR: '#00A4A7',
    "London Overground": '#EE7C0E',
    "London Trams": '#84B817',
    "Emirates Cable Car": '#E21836'
  }
}
