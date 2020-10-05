declare namespace JamFactoryApi {

  // ---------------------------------------------------------------------------------------------------------------------
  // general

  interface JamResponse {
    label: string;
    name: string;
    active: boolean;
    voting_type: string;
  }

  interface PlaybackBody {
    playback: Zmb3SpotifyApi.PlayerState;
    device_id: string;
  }

  interface LabelBody {
    label: string;
  }

  interface JoinResponseBody {
    label: string;
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // spotify requests

  interface PutSpotifySearchRequest {
    text?: string;
    type?: string;
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // queue requests

  interface PutQueueVoteRequest {
    track?: string;
  }

  interface PutQueuePlaylistRequest {
    collection?: string;
    type?: string;
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // jam requests

  interface PutJamRequest {
    name?: string;
    active?: boolean;
    ip_voting: boolean;
  }

  interface PutJamPlaybackRequest {
    playing?: boolean;
    device_id?: boolean;
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // auth responses

  interface GetAuthCurrentResponse {
    user: string;
    label: string;
    authorized: boolean;
  }

  interface GetAuthLoginResponse {
    url: string;
  }

  interface GetAuthLogoutResponse {
    success: boolean;
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // jam responses

  type GetJamResponse = JamResponse;
  type PutJamResponse = JamResponse;

  type GetJamPlaybackResponse = PlaybackBody;
  type PutPlaybackResponseBody = PlaybackBody;

  type GetJamCreateResponse = LabelBody;
  type PutJamJoinResponse = LabelBody;

  interface GetJamLeaveResponse {
    success: boolean;
  }

  // ---------------------------------------------------------------------------------------------------------------------
  // queue responses

  interface GetQueueResponse {
    queue: SongWithoutId[];
  }

  type PutQueuePlaylistResponse = GetQueueResponse;
  type PutQueueVoteResponse = GetQueueResponse;

  // ---------------------------------------------------------------------------------------------------------------------
  // spotify responses

  interface GetSpotifyDevicesResponse {
    devices: Zmb3SpotifyApi.PlayerDevice[];
  }

  interface GetSpotifyPlaylistsResponse {
    playlists: Zmb3SpotifyApi.SimplePlaylistPage;
  }

  type PutSpotifySearchResponse  = Zmb3SpotifyApi.SearchResult;

  // ---------------------------------------------------------------------------------------------------------------------
  // socketio types

  // type JoinResponseBody = LabelBody;

  // interface JamSessionStateResponseBody {
  //   currentSong: any;
  //   state: any;
  // }

  // ---------------------------------------------------------------------------------------------------------------------
  // other types

  interface SongWithoutId {
    spotifyTrackFull: SpotifyApi.TrackObjectFull;
    votes: number;
    voted: boolean;
  }
}
