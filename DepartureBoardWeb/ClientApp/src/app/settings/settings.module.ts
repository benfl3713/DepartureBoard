import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../external/material.module';
import {SettingsAnnouncementsComponent} from './settings-announcements.component';
import {SettingsBusesComponent} from './settings-buses.component';
import {SettingsDepartureadminComponent} from './settings-departureadmin.component';
import {SettingsGeneralComponent} from './settings-general.component';
import {SettingsMainboardComponent} from './settings-mainboard.component';
import {SettingsSingleboardComponent} from './settings-singleboard.component';
import {SettingsComponent} from "./settings.component";

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsGeneralComponent,
        SettingsMainboardComponent,
        SettingsSingleboardComponent,
        SettingsDepartureadminComponent,
        SettingsBusesComponent,
        SettingsAnnouncementsComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ]
})
export class SettingsModule {
}
