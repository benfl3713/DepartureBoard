import {switchMap} from 'rxjs/operators';
import {Component, OnInit} from "@angular/core";
import {FormGroup, FormControl} from "@angular/forms";
import {ThemeService} from "../Services/ThemeService";
import {GoogleAnalyticsEventsService} from "../Services/google.analytics";
import {GlobalEvents} from "../GlobalEvents";
import {ActivatedRoute, Router} from "@angular/router";
import {of} from 'rxjs';
import {NotifierService} from "../Services/notifier.service";

@Component({
  selector: "app-component-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  settingsType: string = "general";
  betaProgram: boolean = localStorage.getItem("beta_program") === "true";
  previousPageUrl?: string;

  constructor(
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private route: ActivatedRoute,
    private router: Router,
    private notifierService: NotifierService
  ) {
    document.title = "Settings - Departure Board";
    this.previousPageUrl = this.router.getCurrentNavigation().previousNavigation?.finalUrl.toString();
  }

  ngOnInit(): void {
    this.Load();
    this.CheckUrlRoute();
  }

  settingsForm = new FormGroup({
    mainboard_count: new FormControl("6"),
    mainboard_showStationName: new FormControl(false),

    general_mainColour: new FormControl("#ff9729"),
    general_backgroundColour: new FormControl("black"),
    general_dataSource: new FormControl("REALTIMETRAINS"),
    general_includeNonPassengerServices: new FormControl(false),
    general_betaFeatures: new FormControl(false),

    singleboard_showStationName: new FormControl(false),
    singleboard_alternateSecondRow: new FormControl(true),
    singleboard_showPlatforms: new FormControl(true),
    singleboard_scrollspeed: new FormControl(300),
    singleboard_fontsize: new FormControl(40),

    departureadmin_uid: new FormControl(""),
    departureadmin_enabled: new FormControl(false),

    buses_showStopName: new FormControl(true),
    buses_includeBothDirection: new FormControl(false),

    announcements_arrivals: new FormControl(false),
    announcements_cctv: new FormControl(false),
    announcements_seeItSayItSortIt: new FormControl(false),
    announcements_cctv_interval: new FormControl(20),
    announcements_seeItSayItSortIt_interval: new FormControl(20),
    announcements_smoking: new FormControl(false),
    announcements_smoking_interval: new FormControl(20)
  });

  Load() {
    Object.keys(this.settingsForm.controls).forEach((key) => {
      if (localStorage.getItem(`settings_${key}`)) {
        const value = localStorage.getItem(`settings_${key}`);
        if (value == "true" || value == "false") {
          this.settingsForm.get(key).setValue(value == "true");
        } else {
          this.settingsForm.get(key).setValue(value);
        }
      }
    });
  }

  Save(showMessage: boolean = true) {
    Object.keys(this.settingsForm.controls).forEach((key) => {
      localStorage.setItem(`settings_${key}`, this.settingsForm.get(key).value);
    });

    ThemeService.LoadTheme();
    if (showMessage) {
      this.googleAnalyticsEventsService.emitEvent("Settings", "Saved");
      this.googleAnalyticsEventsService.emitEvent(
        "DataSource",
        localStorage.getItem("settings_general_dataSource")
      );
      this.notifierService.notify("success", "Settings - Saved Successfully");
    }
    GlobalEvents.SettingsChanged.emit();
  }

  ResetAll() {
    this.settingsForm.reset({
      mainboard_count: "6",
      mainboard_showStationName: false,
      general_mainColour: "#ff9729",
      general_backgroundColour: "black",
      general_dataSource: "REALTIMETRAINS",
      general_includeNonPassengerServices: false,
      general_betaFeatures: false,
      singleboard_showStationName: false,
      singleboard_alternateSecondRow: true,
      singleboard_showPlatforms: true,
      singleboard_scrollspeed: 300,
      singleboard_fontsize: null,
      departureadmin_uid: "",
      departureadmin_enabled: false,
      buses_showStopName: true,
      buses_includeBothDirection: false,
      announcements_arrivals: false,
      announcements_cctv: false,
      announcements_seeItSayItSortIt: false,
      announcements_smoking: false
    });
    this.Save(false);
    this.Load();
    this.googleAnalyticsEventsService.emitEvent("Settings", "ResetAll");
  }

  CheckUrlRoute() {
    this.route.url.pipe(switchMap(() => this.route.firstChild?.paramMap ?? of(null))).subscribe(u => {
      if (!u || !u.has("type")) return;


      switch (u.get("type")) {
        case "general":
          this.settingsType = "general";
          break;
        case "mainboard":
          this.settingsType = "mainboard";
          break;
        case "singleboard":
          this.settingsType = "singleboard";
          break;
        case "departureadmin":
          this.settingsType = "departureadmin";
          break;
        case "buses":
          this.settingsType = "buses";
          break;
        case "announcements":
          this.settingsType = "announcements";
          break;
      }
    });
  }

  goBack() {
    this.router.navigateByUrl(this.previousPageUrl);
  }
}
