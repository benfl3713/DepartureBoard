export class ConfigService {
  public getItem(key: string): string {
    if (this.inIframe()) {
      console.warn("ConfigService.getItem called in iframe, returning null")
      return null;
    }
    return localStorage.getItem(key);
  }

  public setItem(key: string, value: string): void {
    if (this.inIframe()) {
      console.warn("ConfigService.setItem called in iframe, returning null")
      return;
    }
    localStorage.setItem(key, value)
  }

  inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
}
