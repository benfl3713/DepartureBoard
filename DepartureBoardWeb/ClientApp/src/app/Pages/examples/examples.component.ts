import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Speech } from 'src/app/RAG/Speech';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-components-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css']
})
export class ExamplesComponent implements OnInit{
  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute) { document.title = "Examples - Departure Board"; }

  ngOnInit() {

    const code = this.route.snapshot.queryParamMap.has("crs") ? this.route.snapshot.queryParamMap.get("crs") : "CRE"

    const data: any = {
      "aimedDeparture": "2023-03-29T18:16:00",
      "destination": "Manchester Piccadilly",
      "expectedDeparture": "2023-03-29T18:16:00",
      "extraDetails": null,
      "lastUpdated": "2023-03-29T17:13:48.8363085+00:00",
      "length": 0,
      "operatorName": "Northern",
      "origin": "Crewe",
      "platform": "1",
      "stationCode": code,
      "status": 0,
      "stops": [
          {
              "aimedDeparture": "2023-03-29T18:23:00",
              "expectedDeparture": "2023-03-29T18:23:00",
              "platform": "2",
              "stationCode": "SDB",
              "stationName": "Sandbach"
          },
          {
              "aimedDeparture": "2023-03-29T18:28:00",
              "expectedDeparture": "2023-03-29T18:28:00",
              "platform": null,
              "stationCode": "HCH",
              "stationName": "Holmes Chapel"
          },
          {
              "aimedDeparture": "2023-03-29T18:37:00",
              "expectedDeparture": "2023-03-29T18:37:00",
              "platform": "1",
              "stationCode": "ALD",
              "stationName": "Alderley Edge"
          },
          {
              "aimedDeparture": "2023-03-29T18:40:00",
              "expectedDeparture": "2023-03-29T18:40:00",
              "platform": "1",
              "stationCode": "WML",
              "stationName": "Wilmslow"
          },
          {
              "aimedDeparture": "2023-03-29T18:44:00",
              "expectedDeparture": "2023-03-29T18:44:00",
              "platform": null,
              "stationCode": "SYA",
              "stationName": "Styal"
          },
          {
              "aimedDeparture": "2023-03-29T19:07:00",
              "expectedDeparture": "2023-03-29T19:07:00",
              "platform": "3B",
              "stationCode": "MIA",
              "stationName": "Manchester Airport"
          },
          {
              "aimedDeparture": "2023-03-29T19:11:00",
              "expectedDeparture": "2023-03-29T19:11:00",
              "platform": "1",
              "stationCode": "HDG",
              "stationName": "Heald Green"
          },
          {
              "aimedDeparture": "2023-03-29T19:14:00",
              "expectedDeparture": "2023-03-29T19:14:00",
              "platform": null,
              "stationCode": "GTY",
              "stationName": "Gatley"
          },
          {
              "aimedDeparture": "2023-03-29T19:16:00",
              "expectedDeparture": "2023-03-29T19:16:00",
              "platform": null,
              "stationCode": "EDY",
              "stationName": "East Didsbury"
          },
          {
              "aimedDeparture": "2023-03-29T19:18:00",
              "expectedDeparture": "2023-03-29T19:18:00",
              "platform": null,
              "stationCode": "BNA",
              "stationName": "Burnage"
          },
          {
              "aimedDeparture": "2023-03-29T19:20:00",
              "expectedDeparture": "2023-03-29T19:20:00",
              "platform": null,
              "stationCode": "MAU",
              "stationName": "Mauldeth Road"
          },
          {
              "aimedDeparture": "2023-03-29T19:28:00",
              "expectedDeparture": "2023-03-29T19:27:00",
              "platform": "12",
              "stationCode": "MAN",
              "stationName": "Manchester Piccadilly"
          }
      ]
  }
    const vox = new Speech(this.datePipe);

    setTimeout(() => vox.speak(data, {}), 100);
  }
}
