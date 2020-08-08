declare namespace Zmb3SpotifyApi {
  /**
   *
   */
  interface CurrentlyPlaying {
    timestamp: number,
    context: SpotifyApi.ContextObject,
    progress_ms: number,
    is_playing: boolean,
    item: SpotifyApi.TrackObjectFull
  }

  /**
   *
   */
  interface PlayerState {
    timestamp: number,
    context: SpotifyApi.ContextObject,
    progress_ms: number,
    is_playing: boolean,
    item: SpotifyApi.TrackObjectFull
    device: SpotifyApi.UserDevice,
    shuffle_state: boolean,
    repeat_state: string
  }
}
