import { NgModule } from '@angular/core';
import { TuiRootModule, TuiThemeNightModule, TuiModeModule, TuiButtonModule } from '@taiga-ui/core';
import { TuiIslandModule, TuiInputModule } from '@taiga-ui/kit';



@NgModule({
	exports: [
    TuiRootModule,
    TuiIslandModule,
    TuiThemeNightModule,
    TuiInputModule,
    TuiModeModule,
    TuiButtonModule
	]
})
export class TuiModule { }


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
