/** Rail Announcements Generator. By Roy Curtis, MIT license, 2018 */

import {Departure, Dictionary} from "../models/departure.model";
import {VoxEngine, VoxKey, Strings} from "./VoxEngine";
import {SpeechSettings} from "./SpeechSettings";
import {DatePipe, DecimalPipe} from "@angular/common";

/** Manages speech synthesis using both native and custom engines */
export class Speech {
  /** Instance of the custom voice engine */
  private readonly voxEngine?: VoxEngine;

  /** Dictionary of browser-provided voices available */
  public  browserVoices: Dictionary<SpeechSynthesisVoice> = {};
  /** Event handler for when speech is audibly spoken */
  public  onspeak?: () => void;
  /** Event handler for when speech has ended */
  public  onstop?: () => void;
  /** Reference to the native speech-stopped check timer */
  private stopTimer: number = 0;

  /** Whether any speech engine is currently speaking */
  public get isSpeaking(): boolean {
    if (this.voxEngine && this.voxEngine.isSpeaking) {
      return true;
    } else {
      return window.speechSynthesis.speaking;
    }
  }

  /** Whether the VOX engine is currently available */
  public get voxAvailable(): boolean {
    return this.voxEngine !== undefined;
  }

  public constructor(private datePipe: DatePipe, private decimalPipe: DecimalPipe) {
    // Some browsers don't properly cancel speech on page close.
    // BUG: onpageshow and onpagehide not working on iOS 11
    window.onbeforeunload =
      window.onunload       =
        window.onpageshow     =
          window.onpagehide     = this.stop.bind(this);

    document.onvisibilitychange            = this.onVisibilityChange.bind(this);
    window.speechSynthesis.onvoiceschanged = this.onVoicesChanged.bind(this);

    // Even though 'onvoiceschanged' is used later to populate the list, Chrome does
    // not actually fire the event until this call...
    this.onVoicesChanged();

    // For some reason, Chrome needs this called once for native speech to work
    window.speechSynthesis.cancel();

    try         { this.voxEngine = new VoxEngine(); } catch (err) { console.error('Could not create VOX engine:', err); }
  }

  /** Begins speaking the given phrase components */
  public speak(departure: Departure, settings: SpeechSettings = {}): void {
    this.stop();

    // VOX engine
    if      ( this.voxEngine) {
      this.speakVox(departure, settings);
    }  else if (this.onstop) {
      this.onstop();
 }
  }

  /** Stops and cancels all queued speech */
  public stop(): void {
    if (!this.isSpeaking) {
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (this.voxEngine) {
      this.voxEngine.stop();
    }

    if (this.onstop) {
      this.onstop();
    }
  }

  /** Pause and unpause speech if the page is hidden or unhidden */
  private onVisibilityChange(): void {
    // TODO: This needs to pause VOX engine
    const hiding = (document.visibilityState === 'hidden');

    if (hiding) { window.speechSynthesis.pause(); } else {        window.speechSynthesis.resume(); }
  }

  /** Handles async voice list loading on some browsers, and sets default */
  private onVoicesChanged(): void {
    this.browserVoices = {};

    window.speechSynthesis.getVoices().forEach(v => this.browserVoices[v.name] = v);
  }

  private getNumberSoundName(number: string){
    const fullNumber = this.decimalPipe.transform(number, "2.0")

    return fullNumber == "00" ? "hundred" : fullNumber;
  }

  /**
   * Synthesizes voice by walking through the given phrase elements, resolving parts to
   * sound file IDs, and feeding the entire array to the vox engine.
   *
   * @param phrase Phrase elements to speak
   * @param settings Settings to use for the voice
   */
  private async speakVox(departure: Departure, settings: SpeechSettings) {
    // const resolver = new Resolver(phrase);
    const voxPath  = "";

    this.voxEngine!.onspeak = () => {
      if (this.onspeak) {
        this.onspeak();
      }
    };

    this.voxEngine!.onstop = () => {
      this.voxEngine!.onspeak = undefined;
      this.voxEngine!.onstop  = undefined;

      if (this.onstop) {
        this.onstop();
      }
    };

    settings = {
      voxPath: 'https://roycurtis.github.io/RAG-VOX-Roy',
      voxChime: 'chime.btm.wav',
      voxReverb: 'ir.stalbans.wav',
      rate: 1,
      volume: 1
    };


    let text: VoxKey[] = ['' +
    'phraseset.platform_wait_intro.2.0', 0.15,
      `number.${departure.platform}.mid`, 0.2,
      'phraseset.platform_wait_intro.2.2', 0.2,
      `number.${this.getNumberSoundName(this.datePipe.transform(departure.aimedDeparture, 'H'))}.begin`, 0.2,
      `number.${this.getNumberSoundName(this.datePipe.transform(departure.aimedDeparture, 'm'))}.mid`, 0.15,
];

    const r = await fetch(`${settings.voxPath}/service.${Strings.filename(departure.operatorName)}.mid.mp3`)
    if (r.status == 200){
      text = [...text, `service.${Strings.filename(departure.operatorName)}.mid`, 0.15,]
    }

    text = [...text,
      'phrase.service_to.4', 0.2,
      `station.${departure.stationCode}.end`, 0.65,
    ]

    console.log(text);

    // 'phrase.platform_wait.0', 0.15,
    //   `number.${departure.platform}.mid`, 0.2,
    //   'phrase.platform_wait.2', 0.2,
    //   'number.17.begin', 0.2,
    //   'number.57.mid', 0.15,
    //   'service.chiltern_railways.mid', 0.15,
    //   'phrase.platform_wait.4', 0.2,
    //   `station.${departure.stationCode}.end`, 0.65

    this.voxEngine!.speak(text, settings);
  }
}
