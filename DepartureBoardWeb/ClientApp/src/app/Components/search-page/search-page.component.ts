import {Component} from '@angular/core';
import {ToggleConfig} from "../../ToggleConfig";
import {Station} from "../../models/station.model";
import {environment} from "../../../environments/environment";
import {debounceTime, map, take, tap} from "rxjs/operators";
import {FormControl} from "@angular/forms";
import {Observable, of, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {StationLookupService} from "../../Services/station-lookup.service";
import {DepartureService} from "../../Services/departure.service";
import {Departure} from "../../models/departure.model";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent {
  stations: any;
  filteredOptions: NextStation[];
  searchBox = new FormControl();
  typedEvent: Subject<void> = new Subject();
  showNothingFound = false;
  cachedDepartures = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private stationLookup: StationLookupService,
    private departureService: DepartureService
  ) {
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
    this.showNothingFound = false;
    const query = this.searchBox.value;
    if (query) {
      ToggleConfig.LoadingBar.next(true);
      this.stationLookup.Search(query).subscribe(
        (s) => {
          this.filteredOptions = s.map(st => ({
            ...st,
            nextDeparture: this.getNextDeparture(st)
          }));
          if (s.length == 0) {
            this.showNothingFound = true;
          }
        },
        null,
        () => ToggleConfig.LoadingBar.next(false)
      );
    } else {
      this.filteredOptions = Array<NextStation>();
    }
  }

  getNextDeparture(station: Station) {
    if (this.cachedDepartures[station.code]) {
      return of(this.cachedDepartures[station.code]);
    }

    console.log("Loading station", station)
    return this.departureService.GetDepartures(station.code, 1, false, null, null, null, false)
      .pipe(map(s => s.length > 0 ? s[0] : null))
      .pipe(tap(s => this.cachedDepartures[station.code] = s))
  }

  public readonly Object = Object;
}

interface NextStation extends Station {
  nextDeparture: Observable<Departure | null>
}
