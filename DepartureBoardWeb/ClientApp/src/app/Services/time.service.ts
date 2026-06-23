import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  private timezoneOffsetMinutes: number = 0;
  private currentTime$ = new BehaviorSubject<Date>(new Date());
  private timeInterval: any;
  private isInitialized = false;

  constructor(private http: HttpClient) {
    this.initializeTimeService();
  }

  private initializeTimeService(): void {
    // Fetch timezone offset from API
    this.http
      .get<number>(environment.apiBaseUrl + '/api/Config/GetTimezoneOffset')
      .subscribe({
        next: (offsetMinutes) => {
          this.timezoneOffsetMinutes = offsetMinutes;
          this.isInitialized = true;
          this.updateTime();
        },
        error: (error) => {
          console.error('Failed to fetch timezone offset, using local time:', error);
          this.timezoneOffsetMinutes = 0;
          this.isInitialized = true;
          this.updateTime();
        },
      });

    // Start interval to update time every second
    this.timeInterval = setInterval(() => {
      if (this.isInitialized) {
        this.updateTime();
      }
    }, 1000);
  }

  private updateTime(): void {
    // Calculate time using UTC + server timezone offset
    const utcTime = new Date();
    const utcTimestamp = utcTime.getTime();
    const localOffset = utcTime.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const serverTimestamp = utcTimestamp + localOffset + (this.timezoneOffsetMinutes * 60000);
    const serverTime = new Date(serverTimestamp);

    this.currentTime$.next(serverTime);
  }

  public getCurrentTime$(): Observable<Date> {
    return this.currentTime$.asObservable();
  }

  public getCurrentTime(): Date {
    return this.currentTime$.value;
  }

  public destroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
}

