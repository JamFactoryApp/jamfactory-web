declare namespace JamFactoryApi {
  // ---------------------------------------------------------------------------------------------------------------------
  // request types

  /**
   *
   */
  interface SearchRequestBody {
    text?: string,
    type?: string
  }

  /**
   *
   */
  interface VoteRequestBody {
    track?: string
  }

  /**
   *
   */
  interface AddPlaylistRequestBody {
    playlist?: string
  }

  /**
   *
   */
  interface SetJamSessionRequestBody {
    name?: string,
    active?: boolean,
    ip_voting: boolean
  }

  /**
   *
   */
  interface SetPlayBackRequestBody {
    playing?: boolean,
    device_id?: boolean
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // response types
  /**
   *
   */
  interface StatusResponseBody {
    user: string,
    label: string,
    authorized: boolean
  }

  /**
   *
   */
  interface LoginResponseBody {
    url: string
  }

  /**
   *
   */
  interface JamSessionBody {
    label: string,
    name: string,
    active: boolean,
    device_id: string,
    ip_voting: boolean
  }

  /**
   *
   */
  type GetJamSessionResponseBody = JamSessionBody;

  /**
   *
   */
  type SetJamSessionResponseBody = JamSessionBody;

  /**
   *
   */
  interface PlaybackBody {
    playback: Zmb3SpotifyApi.PlayerState
  }

  /**
   *
   */
  type GetPlaybackResponseBody = PlaybackBody;

  /**
   *
   */
  type SetPlaybackResponseBody = PlaybackBody;

  /**
   *
   */
  interface labelBody {
    label: string
  }

  /**
   *
   */
  type CreateJamSessionResponseBody = labelBody;

  /**
   *
   */
  type JoinRequestBody = labelBody;

  /**
   *
   */
  type JoinResponseBody = labelBody;

  /**
   *
   */
  interface LeaveJamSessionResponseBody {
    success: boolean
  }

  /**
   *
   */
  interface JamSessionStateResponseBody {
    currentSong: any;
    state: any
  }
}
