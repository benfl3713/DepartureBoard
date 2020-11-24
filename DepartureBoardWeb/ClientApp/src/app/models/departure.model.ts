export interface Departure {
  lastUpdated: string;
  stationName: string;
  stationCode: string;
  platform: string;
  operatorName: string;
  aimedDeparture?: Date;
  expectedDeparture?: Date;
  origin: string;
  destination: string;
  status: any;
  length: number;
  stops: StationStop[];
}

export interface StationStop {
  stationCode: string;
  stationName: string;
  stationStopType: StopType;
  platform: number;
  aimedDeparture?: Date;
  expectedDeparture?: Date;
}

export enum StopType {
  LI,
  LO,
  LT,
}
