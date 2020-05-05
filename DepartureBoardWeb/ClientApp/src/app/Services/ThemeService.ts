export class ThemeService {
  public static LoadTheme(){
    document.documentElement.style.setProperty('--mainColour', localStorage.getItem("settings_general_mainColour") || "#ff9729");
    document.documentElement.style.setProperty('--backgroundColour', localStorage.getItem("settings_general_backgroundColour") || "black");
  }
}
