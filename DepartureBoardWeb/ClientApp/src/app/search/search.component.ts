import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
	selector: 'app-components-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	stations: any;
	searchBox = new FormControl();
	filteredOptions: any;

	constructor(private http: HttpClient, private router: Router) { }

	ngOnInit(): void {
		this.http.get("/api/StationLookup").subscribe(s => { this.stations = s;});
	}

	filter() {
		var query = this.searchBox.value;
		if (query) {
			this.http.get("/api/StationLookup?query=" + query).subscribe(s => { this.filteredOptions = s; });
	  }
		else {
			this.filteredOptions = Array<string>();
    }
	}

	Search() {
		var stationCode = this.getKeyByValue(this.stations, this.searchBox.value);
		if (!stationCode) {
			alert("Invalid Station");
			return;
		}
		this.router.navigate(([stationCode]));
	}

  private getKeyByValue(object, value) {
	  return Object.keys(object).find(key => object[key] === value);
  }
}
