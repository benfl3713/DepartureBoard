import { environment } from "./../../environments/environment";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { StationLookupService } from "../Services/station-lookup.service";
import { Station } from "../models/station.model";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { ToggleConfig } from "../ToggleConfig";

@Component({
  selector: "app-components-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {
  stations: any;
  searchBox = new FormControl();
  isSingleboard = new FormControl(false);
  isArrivals = new FormControl(false);
  filteredOptions: Station[];
  typedEvent: Subject<void> = new Subject();

  constructor(
    private http: HttpClient,
    private router: Router,
    private stationLookup: StationLookupService
  ) {
    document.title = "Departure Board";
  }

  ngOnInit(): void {
    this.http
      .get(environment.apiBaseUrl + "/api/StationLookup")
      .subscribe((s) => {
        this.stations = s;
      });

    this.typedEvent.pipe(debounceTime(200)).subscribe(() => this.filter());
  }

  keyPressed() {
    this.typedEvent.next();
  }

  filter() {
    const query = this.searchBox.value;
    if (query) {
      ToggleConfig.LoadingBar.next(true);
      this.stationLookup.Search(query).subscribe(
        (s) => {
          this.filteredOptions = s;
        },
        null,
        () => ToggleConfig.LoadingBar.next(false)
      );
    } else {
      this.filteredOptions = Array<Station>();
    }
  }

  async Search() {
    let stationCode = this.searchBox.value.code;
    if (!stationCode) {
      stationCode = await this.attemptCalculate();
    }

    if (!stationCode) {
      alert("Invalid Station");
      return;
    }

    let prefixUrl = "";

    if (this.searchBox.value.country == "DE") {
      prefixUrl = "germany/";
    }
    if (this.isSingleboard.value == true) {
      prefixUrl = prefixUrl + "singleboard/";
    }
    if (this.isArrivals.value == true) {
      prefixUrl = prefixUrl + "arrivals/";
    }

    this.router.navigate([prefixUrl, stationCode]);
  }

  async attemptCalculate(): Promise<string> {
    const stations = await this.stationLookup
      .Search(this.searchBox.value)
      .toPromise();

    const codeMatchedStations = stations.filter(
      (s) => s.code.toUpperCase() === this.searchBox.value.toUpperCase()
    );
    if (codeMatchedStations.length > 0) {
      return codeMatchedStations[0].code;
    }

    const nameMatchedStations = stations.filter(
      (s) => s.name.toLowerCase() === this.searchBox.value.toLowerCase()
    );
    if (nameMatchedStations.length > 0) {
      return nameMatchedStations[0].code;
    }

    return null;
  }

  stationDisplay(station: Station) {
    {
      if (!station) {
        return null;
      }

      return `${station.name} - (${station.code}) - [${station.country}]`;
    }
  }

  asIsOrder(a, b) {
    return 1;
  }
}
