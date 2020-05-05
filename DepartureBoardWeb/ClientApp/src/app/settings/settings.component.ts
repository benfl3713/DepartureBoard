import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-component-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settingsType: string = "general";

  settingsForm = new FormGroup({
    mainboard_count: new FormControl(),
    general_fontColour: new FormControl()
  });

  constructor() {
    this.Load();
  }

  Load() {
    //General Settings
    this.settingsForm.controls["general_fontColour"].setValue(localStorage.getItem("settings_general_fontColour") || "#ff9729");
    //MainBoard Settings
    this.settingsForm.controls["mainboard_count"].setValue(localStorage.getItem("settings_mainboard_count") || "6");
  }

  Save() {
    //General Settings
    localStorage.setItem("settings_general_fontColour", this.settingsForm.controls["general_fontColour"].value || "#ff9729");
    //MainBoard Settings
    localStorage.setItem("settings_mainboard_count", this.settingsForm.controls["mainboard_count"].value || "6");
  }
}
