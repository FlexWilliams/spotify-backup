export interface SpotifyBackupPlaylistTrack {
	name: string;
	album: string;
	artists: string; // comma separated
}

export interface SpotifyBackupPlaylist {
	id: string;
	name: string;
	tracks: SpotifyBackupPlaylistTrack[];
}

export interface SpotifyBackupUserPlaylists {
	userId: string;
	playlists: SpotifyBackupPlaylist[];
}
