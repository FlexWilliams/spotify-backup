import type { SpotifyPlaylistItem } from '$lib/spotify';

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

export function spotifyTrackToBackupTrack(item: SpotifyPlaylistItem): SpotifyBackupPlaylistTrack {
	return {
		name: item?.track?.name,
		album: item?.track?.album?.name,
		artists: item?.track?.artists
			? item.track.artists
					.map((a) => a.name)
					.join(', ')
					.trim()
			: []
	} as SpotifyBackupPlaylistTrack;
}
