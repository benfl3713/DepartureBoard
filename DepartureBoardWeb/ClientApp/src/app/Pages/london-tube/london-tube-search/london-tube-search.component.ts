import {Component, OnInit} from '@angular/core';
import {ToggleConfig} from "../../../ToggleConfig";
import {FormControl} from "@angular/forms";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {debounceTime} from "rxjs/operators";
import {LondonTubeService} from "../../../Services/london-tube.service";

@Component({
  selector: 'app-london-tube-search',
  templateUrl: './london-tube-search.component.html',
  styleUrls: ['./london-tube-search.component.css']
})
export class LondonTubeSearchComponent implements OnInit {
  searchBox = new FormControl();
  lineFilter = new FormControl();
  filteredOptions: any[]
  typedEvent: Subject<void> = new Subject();
  stationInfo: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tubeService: LondonTubeService
  ) {
  }

  ngOnInit(): void {
    this.typedEvent.pipe(debounceTime(200)).subscribe(() => this.filter());
    this.searchBox.valueChanges.subscribe(() => {
      this.stationInfo = null;
      if (!this.showSubSearchParams) {
        return;
      }

      this.tubeService.getStationInfo(this.searchBox.value.id).subscribe(s => {
        this.stationInfo = s;
      });
    });
  }

  keyPressed() {
    this.typedEvent.next();
  }
  filter() {
    this.stationInfo = null;
    const query = this.searchBox.value;
    if (query) {
      ToggleConfig.LoadingBar.next(true);
      this.tubeService.search(query).subscribe(
        (s) => {
          this.filteredOptions = s;
        },
        null,
        () => ToggleConfig.LoadingBar.next(false)
      );
    } else {
      this.filteredOptions = [];
    }
  }

  async Search() {
    console.log(this.searchBox.value)
    let stationId = this.searchBox.value.id;
    if (!stationId) {
      stationId = await this.attemptCalculate();
    }

    if (!stationId) {
      alert("Invalid Station");
      return;
    }

    let extraParams = [];

    if (this.lineFilter.value) {
      extraParams.push(this.lineFilter.value.id);
    }

    this.router.navigate(["london-tube", stationId, ...extraParams]);
  }

  async attemptCalculate(): Promise<string> {
    const stations = await this.tubeService
      .search(this.searchBox.value)
      .toPromise();

    if (stations.length === 1) {
      return stations[0].id;
    }

    const nameMatchedStations = stations.filter(
      (s) => s.name.toLowerCase() === this.searchBox.value.toLowerCase()
    );
    if (nameMatchedStations.length > 0) {
      return nameMatchedStations[0].id;
    }

    return null;
  }

  stationDisplay(station) {
    {
      if (!station) {
        return null;
      }

      return station.name
    }
  }

  asIsOrder(a, b) {
    return 1;
  }

  get showSubSearchParams() {
    if (!this.searchBox.value) {
      return false;
    }
    return typeof this.searchBox.value === 'object';
  }
}
