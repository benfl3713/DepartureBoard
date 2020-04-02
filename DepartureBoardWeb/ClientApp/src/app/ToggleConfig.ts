import { BehaviorSubject } from "rxjs";

export class ToggleConfig {
  public static LoadingBar = new BehaviorSubject<boolean>(false);
}
