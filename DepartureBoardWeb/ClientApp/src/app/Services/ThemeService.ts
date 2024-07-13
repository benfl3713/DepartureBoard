export class ThemeService {
  public static LoadTheme(){
    if (ThemeService.inIframe()){
      document.documentElement.style.setProperty('--mainColour', "#ff9729");
      document.documentElement.style.setProperty('--backgroundColour', "black");
      return;
    }
    document.documentElement.style.setProperty('--mainColour', localStorage.getItem("settings_general_mainColour") || "#ff9729");
    document.documentElement.style.setProperty('--backgroundColour', localStorage.getItem("settings_general_backgroundColour") || "black");
  }

  private static inIframe () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
}
