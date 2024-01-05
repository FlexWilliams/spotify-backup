export interface SpotifyUserPlaylistsTracks {
	href: string;
	total: number;
}

export interface SpotifyUserPlaylists {
	id: string;
	name: string;
	tracks: SpotifyUserPlaylistsTracks;
}

/**
 * Model for:
 * https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists
 * https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
 */
export interface SpotifyUserPlaylistsResponse {
	previous: string;
	next: string;
	limit: number;
	offset: number;
	total: number;
	items: SpotifyUserPlaylists[];
}

export interface SpotifyArtist {
	id: string;
	name: string;
	genres: string[];
}

export interface SpotifyAlbum {
	id: string;
	name: string;
}

export interface SpotifyTrack {
	id: string;
	name: string;
	album: SpotifyAlbum;
	artists: SpotifyArtist[];
}

export interface SpotifyPlaylistItem {
	added_at: string;
	track: SpotifyTrack;
}

/**
 * Model for:
 * https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
 */
export interface SpotifyPlaylistsItemsResponse {
	previous: string;
	next: string;
	limit: number;
	offset: number;
	total: number;
	items: SpotifyPlaylistItem[];
}
