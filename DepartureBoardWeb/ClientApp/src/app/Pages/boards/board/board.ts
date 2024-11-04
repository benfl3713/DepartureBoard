import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, Params, UrlSegment, PRIMARY_OUTLET } from "@angular/router";
import { ServiceStatus } from "../../singleboard/singleboard";
import { DatePipe } from "@angular/common";
import { Departure, StationStop } from "src/app/models/departure.model";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-board",
  templateUrl: "./board.html",
  styleUrls: ["./board.css"],
})
export class Board {
  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
  ) {
    const s: UrlSegment[] = this.router.parseUrl(this.router.url).root.children[
      PRIMARY_OUTLET
    ]?.segments;
    if (s && s[0].path && s[0].path.toLowerCase() == "arrivals") {
      this.useArrivals = true;
    }
    setInterval(() => {
      this.Pager();
      this.InformationPager();
    }, 8000);
  }

  public DepartureTime: Date;
  public Platform: string;
  public Destination: string;
  public Stops: Array<Stop> = new Array<Stop>();
  public DisplayedStops: Array<Stop> = new Array<Stop>();
  public Status: string;
  public Operator: string;
  public Length: number;
  public information: string;
  useArrivals: boolean = false;

  AmountPerPage = 9
  CurrentPage: number = 0;
  TotalPages: number = 0;

  Pager() {
    if (this.TotalPages == 0) {
      return;
    }
    if (this.CurrentPage != this.TotalPages) {
      this.CurrentPage++;
    } else {
      this.CurrentPage = 1;
    }
    const start = (this.CurrentPage - 1) * this.AmountPerPage;
    this.DisplayedStops = this.Stops.slice(start, start + this.AmountPerPage);
  }

  InformationPager() {
    if (!this.Length || this.Length == 0) {
      return;
    }

    const lengthHtml = `<i class="fas fa-subway"></i> Length: ${this.Length}`;
    if (this.information == this.Operator) {
      this.information = lengthHtml;
    } else if (this.information == lengthHtml) {
      this.information = this.Operator;
    }
  }

  public ProcessStops(data: StationStop[]) {
    for (let i = 0; i < data.length; i += 1) {
      this.Stops.push(new Stop(data[i].stationName, data[i].aimedDeparture));
    }
    this.TotalPages = Math.ceil(this.Stops.length / this.AmountPerPage);
    this.Pager();
  }

  FilterPlatform(platform: string) {
    if (platform) {
      const queryParams: Params = { platform };
      this.router.navigate([], {
        queryParams: queryParams,
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
    }
  }

  ChangeStation(stationName: string) {
    this.http
      .get(
        environment.apiBaseUrl +
          "/api/StationLookup/GetStationCodeFromName?name=" +
          stationName
      )
      .subscribe((s) => {
        if (s) {
          if (this.useArrivals) {
            this.router.navigate(["arrivals", s]);
          } else {
            this.router.navigate([s]);
          }
        }
      });
  }

  // Sets board parameters from json data
  Initilize(data: Departure): void {
    this.DepartureTime = data.aimedDeparture;
    this.Platform = data.platform;
    this.Destination = data.destination;
    this.Operator = data.operatorName;
    this.Length = data.length;
    this.information = this.Operator;

    if (data.isCancelled === true) {
      data.status = ServiceStatus.CANCELLED;
    }

    if (!data.status || data.status < 0) {
      data.status = this.calculateStatus(data);
    }

    if (data.status === ServiceStatus.LATE && data["expectedDeparture"]) {
      const fexpected = data.expectedDeparture;
      this.Status = "Exp " + this.datePipe.transform(fexpected, "HH:mm");
    } else {
      this.Status = this.toTitleCase(ServiceStatus[data.status]);
      if (this.Status === "Ontime") {
        this.Status = "On Time";
      }
    }

    this.ProcessStops(data.stops);
  }

  calculateStatus(data: Departure): ServiceStatus {
    // @ts-ignore
    if (data.expectedDeparture && data.expectedDeparture != '0001-01-01T00:00:00') {
      return data.expectedDeparture.valueOf() > data.aimedDeparture.valueOf()
        ? ServiceStatus.LATE
        : ServiceStatus.ONTIME;
    }

    return ServiceStatus.ONTIME;
  }

  toTitleCase(input: string): string {
    return input.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
export class Stop {
  public StationName: string;
  public Time: Date;
  constructor(name: string, time: Date) {
    this.StationName = name;
    this.Time = time;
  }
}
