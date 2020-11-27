import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Station } from "../models/station.model";

@Injectable({
  providedIn: "root",
})
export class StationLookupService {
  constructor(private http: HttpClient) {}

  GetStationNameFromCode(stationCode: string): Observable<string> {
    return this.http.get<string>(
      "/api/StationLookup/GetStationNameFromCode?code=" +
        stationCode.toUpperCase()
    );
  }

  Search(query: string): Observable<Station[]> {
    return this.http.get<Station[]>("/api/StationLookup?query=" + query);
  }
}
