import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ThemeService } from "../Services/ThemeService";
import { GoogleAnalyticsEventsService } from "../Services/google.analytics";
import { NotifierService } from "angular-notifier";
import { GlobalEvents } from "../GlobalEvents";

@Component({
  selector: "app-component-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  settingsType: string = "general";

  constructor(
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private notifierService: NotifierService
  ) {
    document.title = "Settings - Departure Board";
  }
  ngOnInit(): void {
    this.Load();
  }

  settingsForm = new FormGroup({
    mainboard_count: new FormControl(),
    mainboard_showStationName: new FormControl(false),
    general_mainColour: new FormControl(),
    general_backgroundColour: new FormControl(),
    general_dataSource: new FormControl(),
    singleboard_showStationName: new FormControl(),
    departureadmin_uid: new FormControl(),
    departureadmin_enabled: new FormControl(),
  });

  Load() {
    //General Settings
    this.settingsForm.controls["general_mainColour"].setValue(
      localStorage.getItem("settings_general_mainColour") || "#ff9729"
    );
    this.settingsForm.controls["general_backgroundColour"].setValue(
      localStorage.getItem("settings_general_backgroundColour") || "black"
    );
    this.settingsForm.controls["general_dataSource"].setValue(
      localStorage.getItem("settings_general_dataSource") || "REALTIMETRAINS"
    );
    //MainBoard Settings
    this.settingsForm.controls["mainboard_count"].setValue(
      localStorage.getItem("settings_mainboard_count") || "6"
    );
    this.settingsForm.controls["mainboard_showStationName"].setValue(
      localStorage.getItem("settings_mainboard_showStationName") || "false"
    );
    //SingleBoard Settings
    this.settingsForm.controls["singleboard_showStationName"].setValue(
      localStorage.getItem("settings_singleboard_showStationName") || "false"
    );
    //Departureadmin Settings
    this.settingsForm.controls["departureadmin_uid"].setValue(
      localStorage.getItem("settings_departureadmin_uid") || ""
    );
    this.settingsForm.controls["departureadmin_enabled"].setValue(
      localStorage.getItem("settings_departureadmin_enabled") || false
    );
  }

  Save(showMessage: boolean = true) {
    //General Settings
    localStorage.setItem(
      "settings_general_mainColour",
      this.settingsForm.controls["general_mainColour"].value || "#ff9729"
    );
    localStorage.setItem(
      "settings_general_backgroundColour",
      this.settingsForm.controls["general_backgroundColour"].value || "black"
    );
    localStorage.setItem(
      "settings_general_dataSource",
      this.settingsForm.controls["general_dataSource"].value || "REALTIMETRAINS"
    );
    //MainBoard Settings
    localStorage.setItem(
      "settings_mainboard_count",
      this.settingsForm.controls["mainboard_count"].value || "6"
    );
    localStorage.setItem(
      "settings_mainboard_showStationName",
      this.settingsForm.controls["mainboard_showStationName"].value || "false"
    );
    //SingleBoard Settings
    localStorage.setItem(
      "settings_singleboard_showStationName",
      this.settingsForm.controls["singleboard_showStationName"].value || "false"
    );
    //Departureadmin Settings
    localStorage.setItem(
      "settings_departureadmin_uid",
      this.settingsForm.controls["departureadmin_uid"].value || ""
    );
    localStorage.setItem(
      "settings_departureadmin_enabled",
      this.settingsForm.controls["departureadmin_enabled"].value || "false"
    );

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
    Object.keys(this.settingsForm.controls).forEach((key) => {
      this.settingsForm.get(key).setValue(null);
    });
    this.Save(false);
    this.Load();
    this.googleAnalyticsEventsService.emitEvent("Settings", "ResetAll");
  }

  SetFormValue(key: string, value) {
    this.settingsForm.controls[key].setValue(value);
  }
}
