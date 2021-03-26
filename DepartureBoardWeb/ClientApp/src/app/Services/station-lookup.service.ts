import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Station } from "../models/station.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class StationLookupService {
  constructor(private http: HttpClient) {}

  GetStationNameFromCode(stationCode: string): Observable<string> {
    return this.http.get<string>(
      environment.apiBaseUrl +
        "/api/StationLookup/GetStationNameFromCode?code=" +
        stationCode.toUpperCase()
    );
  }

  Search(query: string): Observable<Station[]> {
    return this.http.get<Station[]>(
      environment.apiBaseUrl + "/api/StationLookup?query=" + query
    );
  }
}
