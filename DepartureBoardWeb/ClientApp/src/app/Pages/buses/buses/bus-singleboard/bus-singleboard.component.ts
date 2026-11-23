import {Component, Input, OnChanges, OnDestroy, OnInit} from "@angular/core";
import {BusDepartureService} from "src/app/Services/bus-departure.service";
import {ActivatedRoute} from "@angular/router";
import {ToggleConfig} from "src/app/ToggleConfig";
import {tap} from "rxjs/operators";
import {combineLatest, Subscription} from "rxjs";
import {ConfigService} from "../../../../Services/config.service";

@Component({
  selector: "app-bus-singleboard",
  templateUrl: "./bus-singleboard.component.html",
  styleUrls: ["./bus-singleboard.component.css"],
})
export class BusSingleboardComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    private busDepartureService: BusDepartureService,
    private route: ActivatedRoute,
    private configService: ConfigService
  ) {}

  /** When true, the board is driven by its inputs instead of the route and is laid out by its parent. */
  @Input() embedded: boolean = false;
  @Input() atco: string;
  @Input() dataSource: string;
  @Input() count: number = 4;

  interval;
  routeSubscription: Subscription;
  noBoardsDisplay: boolean = false;
  stopName: string = "";
  showStopName: boolean =
    this.configService.getItem("settings_buses_showStopName") !== "false";
  includeBothDirection: boolean = this.configService.getItem("settings_buses_includeBothDirection") == "true" || false;

  ngOnInit() {
    if (this.embedded) {
      this.SetupBoard();
      return;
    }

    this.routeSubscription = combineLatest([this.route.params, this.route.queryParams])
      .subscribe(([params, queryParams]) => {
        this.atco = params.atco;
        this.dataSource = queryParams.datasource;
        this.count = queryParams.count ?? this.count;
        this.SetupBoard();
      });
  }

  ngOnChanges() {
    // Only re-setup for later input changes; the first setup happens in ngOnInit.
    if (this.embedded && this.interval) {
      this.SetupBoard();
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.routeSubscription?.unsubscribe();
  }

  SetupBoard() {
    if (!this.atco) {
      return;
    }

    if ((this.dataSource === "TFL" || !this.dataSource) && this.includeBothDirection) {
      this.dataSource = "TFL_ALL";
    }

    clearInterval(this.interval);
    this.interval = setInterval(() => this.GetDepartures(), 30000);
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
    if (this.dataSource !== "TFLTUBE") {
      return {};
    }

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
    "Elizabeth line": '#6950a1',
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
