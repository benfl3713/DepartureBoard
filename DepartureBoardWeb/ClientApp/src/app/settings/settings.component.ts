import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ThemeService } from "../Services/ThemeService";
import { GoogleAnalyticsEventsService } from "../Services/google.analytics";
import { NotifierService } from "angular-notifier";
import { GlobalEvents } from "../GlobalEvents";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-component-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  settingsType: string = "general";
  betaProgram: boolean = localStorage.getItem("beta_program") === "true";

  constructor(
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private notifierService: NotifierService,
    private cookieService: CookieService
  ) {
    document.title = "Settings - Departure Board";
  }
  ngOnInit(): void {
    this.Load();
  }

  settingsForm = new FormGroup({
    mainboard_count: new FormControl("6"),
    mainboard_showStationName: new FormControl(false),

    general_mainColour: new FormControl("#ff9729"),
    general_backgroundColour: new FormControl("black"),
    general_dataSource: new FormControl("REALTIMETRAINS"),

    singleboard_showStationName: new FormControl(false),
    singleboard_alternateSecondRow: new FormControl(true),

    departureadmin_uid: new FormControl(""),
    departureadmin_enabled: new FormControl(false),

    buses_showStopName: new FormControl(false),
  });

  Load() {
    Object.keys(this.settingsForm.controls).forEach((key) => {
      if (localStorage.getItem(`settings_${key}`)) {
        this.settingsForm
          .get(key)
          .setValue(localStorage.getItem(`settings_${key}`));
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
      singleboard_showStationName: false,
      singleboard_alternateSecondRow: true,
      departureadmin_uid: "",
      departureadmin_enabled: false,
      buses_showStopName: false,
    });
    this.Save(false);
    this.Load();
    this.googleAnalyticsEventsService.emitEvent("Settings", "ResetAll");
  }

  SetFormValue(key: string, value) {
    this.settingsForm.controls[key].setValue(value);
  }

  changeCookies() {
    this.cookieService.delete("CookieScriptConsent");
    window.location.reload();
  }
}
