import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ThemeService } from "../Services/ThemeService";
import { GoogleAnalyticsEventsService } from "../Services/google.analytics";
import { NotifierService } from "angular-notifier";
import { GlobalEvents } from "../GlobalEvents";
import { ActivatedRoute } from "@angular/router";

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
    private route: ActivatedRoute
  ) {
    document.title = "Settings - Departure Board";
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
    singleboard_scrollspeed: new FormControl(300),

    departureadmin_uid: new FormControl(""),
    departureadmin_enabled: new FormControl(false),

    buses_showStopName: new FormControl(false),
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
      singleboard_scrollspeed: 300,
      departureadmin_uid: "",
      departureadmin_enabled: false,
      buses_showStopName: false,
    });
    this.Save(false);
    this.Load();
    this.googleAnalyticsEventsService.emitEvent("Settings", "ResetAll");
  }

  CheckUrlRoute(){
    if(this.route.children.length != 1)return;

    this.route.children[0].paramMap.subscribe(u => {
      if (!u.has("type")) return;


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
      }
    });
  }
}
