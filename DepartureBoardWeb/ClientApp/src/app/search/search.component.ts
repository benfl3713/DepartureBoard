import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";

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
  filteredOptions: any;

  constructor(private http: HttpClient, private router: Router) {
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
      this.http.get("/api/StationLookup?query=" + query).subscribe((s) => {
        this.filteredOptions = s;
      });
    } else {
      this.filteredOptions = Array<string>();
    }
  }

  Search() {
    const stationCode = this.getKeyByValue(this.stations, this.searchBox.value);
    if (!stationCode) {
      alert("Invalid Station");
      return;
    }

    let prefixUrl = "";

    if (this.isSingleboard.value == true) {
      prefixUrl = prefixUrl + "singleboard/";
    }
    if (this.isArrivals.value == true) {
      prefixUrl = prefixUrl + "arrivals/";
    }

    this.router.navigate([prefixUrl, stationCode]);
  }

  private getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  asIsOrder(a, b) {
    return 1;
  }
}
