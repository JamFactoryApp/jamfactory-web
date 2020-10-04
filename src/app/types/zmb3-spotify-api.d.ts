declare namespace Zmb3SpotifyApi {
  interface BasePage {
    href: string;
    limit: number;
    offset: number;
    total: number;
    next: string;
    previous: string;
  }

  interface SimpleArtist {
    name: string;
    id: string;
    uri: string;
    href: string;
    external_urls: any;
  }

  type FullArtist = SimpleArtist & {
    popularity: number;
    genres: string[];
    followers: Followers;
    images: Image[];
  };

  interface SimpleAlbum {
    name: string;
    artists: SimpleArtist[];
    album_group: string;
    album_type: string;
    id: string;
    uri: string;
    available_markets: string[];
    href: string;
    images: Image[];
    external_urls: any;
    release_date: string;
    release_date_precision: string;
  }

  interface SimpleTrack {
    artists: SimpleArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: any;
    href: string;
    id: string;
    name: string;
    preview_url: string;
    track_number: number;
    uri: number;
  }

  type FullTrack = SimpleTrack & {
    album: SimpleAlbum;
    external_ids: any;
    popularity: number;
  };

  interface CurrentlyPlaying {
    timestamp: number;
    context: SpotifyApi.ContextObject;
    progress_ms: number;
    is_playing: boolean;
    item: SpotifyApi.TrackObjectFull;
  }

  interface PlayerState {
    timestamp: number;
    context: SpotifyApi.ContextObject;
    progress_ms: number;
    is_playing: boolean;
    Item: SpotifyApi.TrackObjectFull;
    device: SpotifyApi.UserDevice;
    shuffle_state: boolean;
    repeat_state: string;
  }

  interface SimplePlaylist {
    collaborative: boolean;
    external_urls: any;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: User;
    public: boolean;
    snapshot_id: string;
    tracks: PlaylistTracks[];
    uri: string;
  }

  interface PlaylistTracks {
    href: string;
    total: number;
  }

  interface User {
    display_name: string;
    external_urls: any;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    uri: string;
  }

  interface Followers {
    total: number;
    href: string;
  }

  type SimplePlaylistPage = BasePage & {
    items: SimplePlaylist[];
  };

  type FullArtistPage = BasePage & {
    items: FullArtist[];
  };

  type SimpleAlbumPage = BasePage & {
    items: SimpleAlbum[];
  };

  type FullTrackPage = BasePage & {
    items: FullTrack[];
  };

  interface SearchResult {
    artists: FullArtistPage;
    albums: SimpleAlbumPage;
    playlists: SimplePlaylistPage;
    tracks: FullTrackPage;
  }

  interface Image {
    height: number;
    width: number;
    url: string;
  }

  interface PlayerDevice {
    id: string;
    is_active: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
  }
}
