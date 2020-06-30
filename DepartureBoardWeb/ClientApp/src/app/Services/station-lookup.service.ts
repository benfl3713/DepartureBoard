import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationLookupService {

  constructor(private http:HttpClient) { }

  GetStationNameFromCode(stationCode:string):Observable<string>{
    return this.http.get<string>("/api/StationLookup/GetStationNameFromCode?code=" + stationCode.toUpperCase())
  }
}
