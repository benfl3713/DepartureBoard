import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError, debounceTime, map, shareReplay, switchMap, tap } from "rxjs/operators";
import { Station } from "src/app/models/station.model";
import { StationLookupService } from "src/app/Services/station-lookup.service";
import { ToggleConfig } from "src/app/ToggleConfig";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  constructor(private stationLookupService: StationLookupService, private router: Router, private breakpointObserver: BreakpointObserver) {}

  searchForm = new FormControl();
  isLoadingStations = false;

  async Search() {
    const value: string = this.searchForm.value;
    let station = null;
    if(value.split('-').length === 2) {
      let code = value.split('-')[1].trim();
      code = code.replace(/\(|\)/g, '');
      station = await this.attemptCalculate(code)
    }

    if (!station) {
      station = await this.attemptCalculate(value);
    }

    if (!station) {
      alert("Invalid Station");
      return;
    }

    let prefixUrl = "";

    if (station.country == "DE") {
      prefixUrl = "germany/";
    }

    this.router.navigate([prefixUrl, station.code]);
  }

  async attemptCalculate(value): Promise<Station> {
    const stations = await this.stationLookupService
      .Search(value)
      .toPromise();

    const codeMatchedStations = stations.filter(
      (s) => s.code.toUpperCase() === value.toUpperCase()
    );
    if (codeMatchedStations.length > 0) {
      return codeMatchedStations[0];
    }

    const nameMatchedStations = stations.filter(
      (s) => s.name.toLowerCase() === value.toLowerCase()
    );
    if (nameMatchedStations.length > 0) {
      return nameMatchedStations[0];
    }

    return null;
  }

  getCountryLogo(station: Station): string{
    if(station.country == "GB"){
      return "assets/images/flags/united-kingdom.svg";
    }

    if(station.country == "DE") {
      return "assets/images/flags/germany.webp";
    }

    return null;
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
}
