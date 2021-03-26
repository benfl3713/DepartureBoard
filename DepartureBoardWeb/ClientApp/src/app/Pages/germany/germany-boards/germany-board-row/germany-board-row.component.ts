import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Params, Router } from "@angular/router";
import { Departure } from "src/app/models/departure.model";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-germany-board-row",
  templateUrl: "./germany-board-row.component.html",
  styleUrls: ["./germany-board-row.component.css"],
})
export class GermanyBoardRowComponent implements OnInit, OnChanges {
  constructor(private router: Router, private http: HttpClient) {}
  ngOnChanges(): void {
    setTimeout(() => this.IsViaOverflowing(), 0);
  }

  @Input() departure: Departure;
  @ViewChild("via") via: ElementRef;

  ngOnInit(): void {}

  GetStopsText(): string {
    if (!this.departure) {
      return "";
    }

    return this.departure.stops.map((s) => s.stationName).join(" - ");
  }

  IsViaOverflowing() {
    var element = this.via.nativeElement as HTMLDivElement;
    const isOverflowing = element.offsetHeight < element.scrollHeight;

    if (isOverflowing) {
      var marquee = document.createElement("marquee"),
        contents = element.innerText;

      marquee.scrollAmount = 13;
      marquee.innerText = contents;
      element.innerHTML = "";
      element.appendChild(marquee);
    }
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
        if (!s) {
          return;
        }
        this.router.navigate(["germany/", s]);
      });
  }
}
