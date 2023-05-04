/** Rail Announcements Generator. By Roy Curtis, MIT license, 2018 */

/** Utility class for audio functionality */
class Sounds {
  /**
   * Decodes the given audio file into raw audio data. This is a wrapper for the older
   * callback-based syntax, since it is the only one iOS currently supports.
   *
   * @param context Audio context to use for decoding
   * @param buffer Buffer of encoded file data (e.g. mp3) to decode
   */
  public static async decode(context: AudioContext, buffer: ArrayBuffer)
    : Promise<AudioBuffer> {
    return new Promise <AudioBuffer> ( (resolve, reject) => {
      return context.decodeAudioData(buffer, resolve, reject);
    });
  }
}
