export interface Departure {
  lastUpdated: string;
  stationName: string;
  stationCode: string;
  platform: string;
  operatorName: string;
  aimedDeparture: string;
  expectedDeparture: string;
  origin: string;
  destination: string;
  status: any;
  serviceTimeTableUrl: string;
  fromDataSouce: any;
  length: number;
  stops: StationStop[];
}

export interface StationStop {
  stationCode: string;
  stationName: string;
  stationStopType: StopType;
  platform: number;
  aimedDeparture: string;
  expectedDeparture: string;
}

export enum StopType {
  LI,
  LO,
  LT,
}
