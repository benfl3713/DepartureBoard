import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemeService } from '../Services/ThemeService';
import { GoogleAnalyticsEventsService } from '../Services/google.analytics';

@Component({
  selector: 'app-component-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsType: string = "general";

  constructor(public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {}
  ngOnInit(): void {
    this.Load();
  }

  settingsForm = new FormGroup({
    mainboard_count: new FormControl(),
    general_mainColour: new FormControl(),
    general_backgroundColour: new FormControl()
  });

  Load() {
    //General Settings
    this.settingsForm.controls["general_mainColour"].setValue(localStorage.getItem("settings_general_mainColour") || "#ff9729");
    this.settingsForm.controls["general_backgroundColour"].setValue(localStorage.getItem("settings_general_backgroundColour") || "black");
    //MainBoard Settings
    this.settingsForm.controls["mainboard_count"].setValue(localStorage.getItem("settings_mainboard_count") || "6");
  }

  Save() {
    //General Settings
    localStorage.setItem("settings_general_mainColour", this.settingsForm.controls["general_mainColour"].value || "#ff9729");
    localStorage.setItem("settings_general_backgroundColour", this.settingsForm.controls["general_backgroundColour"].value || "black");
    //MainBoard Settings
    localStorage.setItem("settings_mainboard_count", this.settingsForm.controls["mainboard_count"].value || "6");

    ThemeService.LoadTheme();
    this.googleAnalyticsEventsService.emitEvent("Settings", "Saved");
  }

  ResetAll() {
    Object.keys(this.settingsForm.controls).forEach(key => {
      this.settingsForm.get(key).setValue(null);
    });
    this.Save();
    this.Load();
    this.googleAnalyticsEventsService.emitEvent("Settings", "ResetAll");
  }

  SetFormValue(key:string, value) {
    this.settingsForm.controls[key].setValue(value);
  }
}
