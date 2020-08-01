import { Component, OnInit } from "@angular/core";
import { BusDepartureService } from "src/app/Services/bus-departure.service";
import { ActivatedRoute } from "@angular/router";
import { ToggleConfig } from "src/app/ToggleConfig";
import { tap, catchError } from "rxjs/operators";
import { NotifierService } from "angular-notifier";
import { of } from "rxjs";

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
    route.params.subscribe(() => {
      route.queryParams.subscribe(() => {
        this.SetupBoard();
      });
    });
  }

  atco: string;
  noBoardsDisplay: boolean = false;
  stopName: string = "";
  showStopName: boolean =
    localStorage.getItem("settings_buses_showStopName") == "true" || false;

  ngOnInit() {}

  SetupBoard() {
    this.atco = this.route.snapshot.paramMap.get("atco");
    setInterval(() => this.GetDepartures(), 30000);
    ToggleConfig.LoadingBar.next(true);
    this.GetDepartures();
  }

  GetDepartures() {
    this.busDepartureService
      .GetDepartures(this.atco)
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
}
