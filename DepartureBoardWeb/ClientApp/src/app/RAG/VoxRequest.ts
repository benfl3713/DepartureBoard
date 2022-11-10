/** Rail Announcements Generator. By Roy Curtis, MIT license, 2018 */

import { Sounds } from "./VoxEngine";

/** Represents a request for a vox file, immediately begun on creation */
export class VoxRequest {
  /** Relative remote path of this voice file request */
  public  readonly path: string;
  /** Amount of seconds to delay the playback of this request */
  public  readonly delay: number;
  /** Audio context to use for decoding */
  private readonly context: AudioContext;
  /** Abort controller to allow the fetch to be aborted */
  private readonly abort: AbortController;

  /** Whether this request is done and ready for handling (even if failed) */
  public isDone: boolean = false;
  /** Raw audio data from the loaded file, if available */
  public buffer?: AudioBuffer;
  /** Playback rate to force this clip to play at */
  public forceRate?: number;

  public constructor(path: string, delay: number, context: AudioContext) {
    console.debug('VOX REQUEST:', path);
    this.context = context;
    this.path    = path;
    this.delay   = delay;
    this.abort   = new AbortController();

    // https://developers.google.com/web/updates/2017/09/abortable-fetch
    fetch(path, { signal : this.abort.signal })
      .then ( this.onFulfill.bind(this) )
      .catch( this.onError.bind(this)   );

    // Timeout all fetches by 10 seconds
    setTimeout(_ => this.abort.abort(), 10 * 1000);
  }

  /** Cancels this request from proceeding any further */
  public cancel(): void {
    this.abort.abort();
  }

  /** Begins decoding the loaded MP3 voice file to raw audio data */
  private onFulfill(res: Response): void {
    if (!res.ok) {
      throw Error(`VOX NOT FOUND: ${res.status} @ ${this.path}`);
    }

    res.arrayBuffer().then( this.onArrayBuffer.bind(this) );
  }

  /** Takes the array buffer from the fulfilled fetch and decodes it */
  private onArrayBuffer(buffer: ArrayBuffer): void {
    Sounds.decode(this.context, buffer)
      .then ( this.onDecode.bind(this) )
      .catch( this.onError.bind(this)  );
  }

  /** Called when the fetched buffer is decoded successfully */
  private onDecode(buffer: AudioBuffer): void {
    this.buffer = buffer;
    this.isDone = true;
  }

  /** Called if the fetch or decode stages fail */
  private onError(err: any): void {
    console.log('REQUEST FAIL:', err);
    this.isDone = true;
  }
}
