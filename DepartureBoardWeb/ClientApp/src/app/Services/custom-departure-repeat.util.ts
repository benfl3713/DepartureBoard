import { Departure, StationStop } from "src/app/models/departure.model";

export const CUSTOM_DEPARTURE_REPEAT_INTERVAL_OPTIONS = [
  { value: 0, label: "No repeat" },
  { value: 30, label: "Every 30 minutes" },
  { value: 60, label: "Every 1 hour" },
  { value: 120, label: "Every 2 hours" },
];
const SUPPORTED_REPEAT_INTERVALS = CUSTOM_DEPARTURE_REPEAT_INTERVAL_OPTIONS
  .map((option) => option.value)
  .filter((value) => value > 0);
const DEFAULT_REPEAT_WINDOW_HOURS = 24;
const MAX_EXPANDED_DEPARTURES = 300;

function parseDate(value: string | Date | undefined): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function getDepartureTime(departure: Departure): number | null {
  const aimed = parseDate(departure.aimedDeparture);
  if (aimed) {
    return aimed.getTime();
  }

  const expected = parseDate(departure.expectedDeparture);
  if (expected) {
    return expected.getTime();
  }

  return null;
}

function shiftDate(value: string | Date | undefined, offsetMs: number): Date | undefined {
  const date = parseDate(value);
  if (!date) {
    return undefined;
  }

  return new Date(date.getTime() + offsetMs);
}

function shiftStop(stop: StationStop, offsetMs: number): StationStop {
  return {
    ...stop,
    aimedDeparture: shiftDate(stop.aimedDeparture, offsetMs),
    expectedDeparture: shiftDate(stop.expectedDeparture, offsetMs),
  };
}

function shiftDeparture(departure: Departure, offsetMs: number): Departure {
  return {
    ...departure,
    aimedDeparture: shiftDate(departure.aimedDeparture, offsetMs),
    expectedDeparture: shiftDate(departure.expectedDeparture, offsetMs),
    stops: (departure.stops || []).map((stop) => shiftStop(stop, offsetMs)),
  };
}

export function expandCustomDeparturesWithRepeat(
  departures: Departure[] = [],
  repeatIntervalMinutes: number,
  now: Date = new Date(),
  repeatWindowHours: number = DEFAULT_REPEAT_WINDOW_HOURS
): Departure[] {
  if (
    !SUPPORTED_REPEAT_INTERVALS.includes(repeatIntervalMinutes) ||
    departures.length === 0
  ) {
    return departures;
  }

  const repeatableDepartures = departures.filter((departure) => getDepartureTime(departure) !== null);
  const nonRepeatableDepartures = departures.filter((departure) => getDepartureTime(departure) === null);

  if (repeatableDepartures.length === 0) {
    return departures;
  }

  const intervalMs = repeatIntervalMinutes * 60 * 1000;
  const nowMs = now.getTime();
  const repeatWindowMs = repeatWindowHours * 60 * 60 * 1000;
  const earliestRelevantTime = nowMs - intervalMs;
  const latestRelevantTime = nowMs + repeatWindowMs + intervalMs;

  const expandedDepartures: Departure[] = [];
  repeatableDepartures.forEach((departure) => {
    const departureTime = getDepartureTime(departure);
    if (departureTime === null) {
      return;
    }

    const startCycle = Math.max(
      0,
      Math.ceil((earliestRelevantTime - departureTime) / intervalMs)
    );
    const endCycle = Math.floor(
      (latestRelevantTime - departureTime) / intervalMs
    );

    if (endCycle < startCycle) {
      return;
    }

    for (let cycle = startCycle; cycle <= endCycle; cycle++) {
      const offsetMs = cycle * intervalMs;
      expandedDepartures.push(shiftDeparture(departure, offsetMs));
    }
  });

  const sortedDepartures = [...expandedDepartures, ...nonRepeatableDepartures].sort((a, b) => {
    const aTime = getDepartureTime(a);
    const bTime = getDepartureTime(b);

    if (aTime === null && bTime === null) {
      return 0;
    }

    if (aTime === null) {
      return 1;
    }

    if (bTime === null) {
      return -1;
    }

    return aTime - bTime;
  });

  const relevantDepartures = sortedDepartures.filter((departure) => {
    const departureTime = getDepartureTime(departure);
    return (
      departureTime === null ||
      (departureTime >= earliestRelevantTime &&
        departureTime <= latestRelevantTime)
    );
  });

  const departuresToReturn =
    relevantDepartures.length > 0 ? relevantDepartures : sortedDepartures;

  return departuresToReturn.slice(0, MAX_EXPANDED_DEPARTURES);
}
