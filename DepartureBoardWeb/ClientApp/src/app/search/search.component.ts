import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { StationLookupService } from "../Services/station-lookup.service";
import { Station } from "../models/station.model";

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private stationLookup: StationLookupService
  ) {
    document.title = "Departure Board";
  }

  ngOnInit(): void {
    this.http.get("/api/StationLookup").subscribe((s) => {
      this.stations = s;
    });
  }

  filter() {
    const query = this.searchBox.value;
    if (query) {
      this.stationLookup.Search(query).subscribe((s) => {
        this.filteredOptions = s;
      });
    } else {
      this.filteredOptions = Array<Station>();
    }
  }

  Search() {
    const stationCode = this.searchBox.value.code;
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
