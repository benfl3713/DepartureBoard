import { Departure } from "./models/departure.model";

export const ExampleGermanDepartures: Departure[] = JSON.parse(`
[
  {
      "lastUpdated": "2020-11-27T19:54:35.6711109+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-27T20:21:00",
      "expectedDeparture": "2020-11-27T20:21:00",
      "origin": "Frankfurt(Main)Hbf",
      "destination": "Bruxelles Midi",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 10"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Aachen Süd(Gr)",
              "platform": null,
              "aimedDeparture": "2020-11-27T20:24:00",
              "expectedDeparture": "2020-11-27T20:24:00"
          },
          {
              "stationCode": null,
              "stationName": "Liège-Guillemins",
              "platform": null,
              "aimedDeparture": "2020-11-27T20:46:00",
              "expectedDeparture": "2020-11-27T20:46:00"
          },
          {
              "stationCode": null,
              "stationName": "Bruxelles-Nord",
              "platform": null,
              "aimedDeparture": "2020-11-27T21:28:00",
              "expectedDeparture": "2020-11-27T21:28:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.5567914+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "6",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T07:08:00",
      "expectedDeparture": "2020-11-28T07:08:00",
      "origin": "Aachen Hbf",
      "destination": "Berlin Ostbahnhof",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "IC 2235"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Herzogenrath",
              "platform": null,
              "aimedDeparture": "2020-11-28T07:23:00",
              "expectedDeparture": "2020-11-28T07:23:00"
          },
          {
              "stationCode": null,
              "stationName": "Geilenkirchen",
              "platform": null,
              "aimedDeparture": "2020-11-28T07:31:00",
              "expectedDeparture": "2020-11-28T07:31:00"
          },
          {
              "stationCode": null,
              "stationName": "Rheydt Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T07:48:00",
              "expectedDeparture": "2020-11-28T07:48:00"
          },
          {
              "stationCode": null,
              "stationName": "Mönchengladbach Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T07:55:00",
              "expectedDeparture": "2020-11-28T07:55:00"
          },
          {
              "stationCode": null,
              "stationName": "Viersen",
              "platform": null,
              "aimedDeparture": "2020-11-28T08:03:00",
              "expectedDeparture": "2020-11-28T08:03:00"
          },
          {
              "stationCode": null,
              "stationName": "Krefeld Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T08:15:00",
              "expectedDeparture": "2020-11-28T08:15:00"
          },
          {
              "stationCode": null,
              "stationName": "Duisburg Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T08:31:00",
              "expectedDeparture": "2020-11-28T08:31:00"
          },
          {
              "stationCode": null,
              "stationName": "Mülheim(Ruhr)Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T08:39:00",
              "expectedDeparture": "2020-11-28T08:39:00"
          },
          {
              "stationCode": null,
              "stationName": "Essen Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T08:48:00",
              "expectedDeparture": "2020-11-28T08:48:00"
          },
          {
              "stationCode": null,
              "stationName": "Bochum Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T08:58:00",
              "expectedDeparture": "2020-11-28T08:58:00"
          },
          {
              "stationCode": null,
              "stationName": "Dortmund Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T09:12:00",
              "expectedDeparture": "2020-11-28T09:12:00"
          },
          {
              "stationCode": null,
              "stationName": "Hamm(Westf)Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T09:43:00",
              "expectedDeparture": "2020-11-28T09:43:00"
          },
          {
              "stationCode": null,
              "stationName": "Gütersloh Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T10:02:00",
              "expectedDeparture": "2020-11-28T10:02:00"
          },
          {
              "stationCode": null,
              "stationName": "Bielefeld Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T10:13:00",
              "expectedDeparture": "2020-11-28T10:13:00"
          },
          {
              "stationCode": null,
              "stationName": "Herford",
              "platform": null,
              "aimedDeparture": "2020-11-28T10:21:00",
              "expectedDeparture": "2020-11-28T10:21:00"
          },
          {
              "stationCode": null,
              "stationName": "Hannover Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T11:04:00",
              "expectedDeparture": "2020-11-28T11:04:00"
          },
          {
              "stationCode": null,
              "stationName": "Wolfsburg Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T11:37:00",
              "expectedDeparture": "2020-11-28T11:37:00"
          },
          {
              "stationCode": null,
              "stationName": "Berlin-Spandau",
              "platform": null,
              "aimedDeparture": "2020-11-28T12:40:00",
              "expectedDeparture": "2020-11-28T12:40:00"
          },
          {
              "stationCode": null,
              "stationName": "Berlin Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T12:58:00",
              "expectedDeparture": "2020-11-28T12:58:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.5486784+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T07:40:00",
      "expectedDeparture": "2020-11-28T07:40:00",
      "origin": "Bruxelles Midi",
      "destination": "Frankfurt(Main)Hbf",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 11"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Köln Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T08:23:00",
              "expectedDeparture": "2020-11-28T08:23:00"
          },
          {
              "stationCode": null,
              "stationName": "Frankfurt(M) Flughafen Fernbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T09:18:00",
              "expectedDeparture": "2020-11-28T09:18:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.7924964+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T08:21:00",
      "expectedDeparture": "2020-11-28T08:21:00",
      "origin": "Frankfurt(Main)Hbf",
      "destination": "Bruxelles Midi",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 18"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Aachen Süd(Gr)",
              "platform": null,
              "aimedDeparture": "2020-11-28T08:24:00",
              "expectedDeparture": "2020-11-28T08:24:00"
          },
          {
              "stationCode": null,
              "stationName": "Liège-Guillemins",
              "platform": null,
              "aimedDeparture": "2020-11-28T08:46:00",
              "expectedDeparture": "2020-11-28T08:46:00"
          },
          {
              "stationCode": null,
              "stationName": "Bruxelles-Nord",
              "platform": null,
              "aimedDeparture": "2020-11-28T09:28:00",
              "expectedDeparture": "2020-11-28T09:28:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.4710331+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T09:40:00",
      "expectedDeparture": "2020-11-28T09:40:00",
      "origin": "Bruxelles Midi",
      "destination": "Frankfurt(Main)Hbf",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 13"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Köln Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T10:18:00",
              "expectedDeparture": "2020-11-28T10:18:00"
          },
          {
              "stationCode": null,
              "stationName": "Siegburg/Bonn",
              "platform": null,
              "aimedDeparture": "2020-11-28T10:35:00",
              "expectedDeparture": "2020-11-28T10:35:00"
          },
          {
              "stationCode": null,
              "stationName": "Frankfurt(M) Flughafen Fernbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T11:18:00",
              "expectedDeparture": "2020-11-28T11:18:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.6066652+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T10:21:00",
      "expectedDeparture": "2020-11-28T10:21:00",
      "origin": "Frankfurt(Main)Hbf",
      "destination": "Bruxelles Midi",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 316"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Aachen Süd(Gr)",
              "platform": null,
              "aimedDeparture": "2020-11-28T10:24:00",
              "expectedDeparture": "2020-11-28T10:24:00"
          },
          {
              "stationCode": null,
              "stationName": "Liège-Guillemins",
              "platform": null,
              "aimedDeparture": "2020-11-28T10:46:00",
              "expectedDeparture": "2020-11-28T10:46:00"
          },
          {
              "stationCode": null,
              "stationName": "Bruxelles-Nord",
              "platform": null,
              "aimedDeparture": "2020-11-28T11:28:00",
              "expectedDeparture": "2020-11-28T11:28:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.6676039+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T11:39:00",
      "expectedDeparture": "2020-11-28T11:39:00",
      "origin": "Bruxelles Midi",
      "destination": "Frankfurt(Main)Hbf",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 15"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Köln Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T12:18:00",
              "expectedDeparture": "2020-11-28T12:18:00"
          },
          {
              "stationCode": null,
              "stationName": "Siegburg/Bonn",
              "platform": null,
              "aimedDeparture": "2020-11-28T12:35:00",
              "expectedDeparture": "2020-11-28T12:35:00"
          },
          {
              "stationCode": null,
              "stationName": "Frankfurt(M) Flughafen Fernbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T13:18:00",
              "expectedDeparture": "2020-11-28T13:18:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.7320573+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T12:21:00",
      "expectedDeparture": "2020-11-28T12:21:00",
      "origin": "Frankfurt(Main)Hbf",
      "destination": "Bruxelles Midi",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 16"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Aachen Süd(Gr)",
              "platform": null,
              "aimedDeparture": "2020-11-28T12:24:00",
              "expectedDeparture": "2020-11-28T12:24:00"
          },
          {
              "stationCode": null,
              "stationName": "Liège-Guillemins",
              "platform": null,
              "aimedDeparture": "2020-11-28T12:46:00",
              "expectedDeparture": "2020-11-28T12:46:00"
          },
          {
              "stationCode": null,
              "stationName": "Bruxelles-Nord",
              "platform": null,
              "aimedDeparture": "2020-11-28T13:28:00",
              "expectedDeparture": "2020-11-28T13:28:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.5259757+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T13:39:00",
      "expectedDeparture": "2020-11-28T13:39:00",
      "origin": "Bruxelles Midi",
      "destination": "Frankfurt(Main)Hbf",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 315"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Köln Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T14:27:00",
              "expectedDeparture": "2020-11-28T14:27:00"
          },
          {
              "stationCode": null,
              "stationName": "Frankfurt(M) Flughafen Fernbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T15:18:00",
              "expectedDeparture": "2020-11-28T15:18:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.4324119+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T14:21:00",
      "expectedDeparture": "2020-11-28T14:21:00",
      "origin": "Frankfurt(Main)Hbf",
      "destination": "Bruxelles Midi",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 314"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Aachen Süd(Gr)",
              "platform": null,
              "aimedDeparture": "2020-11-28T14:24:00",
              "expectedDeparture": "2020-11-28T14:24:00"
          },
          {
              "stationCode": null,
              "stationName": "Liège-Guillemins",
              "platform": null,
              "aimedDeparture": "2020-11-28T14:46:00",
              "expectedDeparture": "2020-11-28T14:46:00"
          },
          {
              "stationCode": null,
              "stationName": "Bruxelles-Nord",
              "platform": null,
              "aimedDeparture": "2020-11-28T15:28:00",
              "expectedDeparture": "2020-11-28T15:28:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.5484565+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T15:39:00",
      "expectedDeparture": "2020-11-28T15:39:00",
      "origin": "Bruxelles Midi",
      "destination": "Frankfurt(Main)Hbf",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 17"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Köln Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T16:20:00",
              "expectedDeparture": "2020-11-28T16:20:00"
          },
          {
              "stationCode": null,
              "stationName": "Siegburg/Bonn",
              "platform": null,
              "aimedDeparture": "2020-11-28T16:35:00",
              "expectedDeparture": "2020-11-28T16:35:00"
          },
          {
              "stationCode": null,
              "stationName": "Montabaur",
              "platform": null,
              "aimedDeparture": "2020-11-28T16:55:00",
              "expectedDeparture": "2020-11-28T16:55:00"
          },
          {
              "stationCode": null,
              "stationName": "Limburg Süd",
              "platform": null,
              "aimedDeparture": "2020-11-28T17:06:00",
              "expectedDeparture": "2020-11-28T17:06:00"
          },
          {
              "stationCode": null,
              "stationName": "Frankfurt(M) Flughafen Fernbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T17:27:00",
              "expectedDeparture": "2020-11-28T17:27:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.7318217+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T16:21:00",
      "expectedDeparture": "2020-11-28T16:21:00",
      "origin": "Frankfurt(Main)Hbf",
      "destination": "Bruxelles Midi",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 14"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Aachen Süd(Gr)",
              "platform": null,
              "aimedDeparture": "2020-11-28T16:24:00",
              "expectedDeparture": "2020-11-28T16:24:00"
          },
          {
              "stationCode": null,
              "stationName": "Liège-Guillemins",
              "platform": null,
              "aimedDeparture": "2020-11-28T16:46:00",
              "expectedDeparture": "2020-11-28T16:46:00"
          },
          {
              "stationCode": null,
              "stationName": "Bruxelles-Nord",
              "platform": null,
              "aimedDeparture": "2020-11-28T17:28:00",
              "expectedDeparture": "2020-11-28T17:28:00"
          }
      ]
  },
  {
      "lastUpdated": "2020-11-27T19:54:35.6581544+00:00",
      "stationName": "Aachen Hbf",
      "stationCode": "8000001",
      "platform": "9",
      "operatorName": "DB",
      "aimedDeparture": "2020-11-28T19:39:00",
      "expectedDeparture": "2020-11-28T19:39:00",
      "origin": "Bruxelles Midi",
      "destination": "Frankfurt(Main)Hbf",
      "status": 0,
      "length": 0,
      "extraDetails": {
          "name": "ICE 19"
      },
      "stops": [
          {
              "stationCode": null,
              "stationName": "Köln Hbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T20:17:00",
              "expectedDeparture": "2020-11-28T20:17:00"
          },
          {
              "stationCode": null,
              "stationName": "Siegburg/Bonn",
              "platform": null,
              "aimedDeparture": "2020-11-28T20:35:00",
              "expectedDeparture": "2020-11-28T20:35:00"
          },
          {
              "stationCode": null,
              "stationName": "Frankfurt(M) Flughafen Fernbf",
              "platform": null,
              "aimedDeparture": "2020-11-28T21:18:00",
              "expectedDeparture": "2020-11-28T21:18:00"
          }
      ]
  }
]
`);
