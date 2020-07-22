import { EventEmitter } from "@angular/core";

export class GlobalEvents {
  public static SettingsChanged: EventEmitter<null> = new EventEmitter();
}
