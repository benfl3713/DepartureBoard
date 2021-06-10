import { NgModule } from '@angular/core';
import { TuiRootModule, TuiThemeNightModule, TuiModeModule, TuiButtonModule, TuiDataListModule } from '@taiga-ui/core';
import { TuiIslandModule, TuiInputModule, TuiAvatarModule } from '@taiga-ui/kit';
import {TuiLetModule} from '@taiga-ui/cdk';





@NgModule({
	exports: [
    TuiRootModule,
    TuiIslandModule,
    TuiThemeNightModule,
    TuiInputModule,
    TuiModeModule,
    TuiButtonModule,
    TuiLetModule,
    TuiDataListModule,
    TuiAvatarModule
	]
})
export class TuiModule { }


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
