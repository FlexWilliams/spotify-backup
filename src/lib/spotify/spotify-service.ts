import * as localForage from 'localforage';
import type { SpotifyAuthResponse, SpotifyUserProfile } from './auth';
import type {
	SpotifyAlbum,
	SpotifyArtist,
	SpotifyPlaylistItem,
	SpotifyPlaylistsItemsResponse,
	SpotifyTrack,
	SpotifyUserPlaylists,
	SpotifyUserPlaylistsResponse
} from './playlist';

export class SpotifyService {
	private static initialized = false;

	public static init(): void {
		if (this.initialized) {
			return;
		}

		localForage.config({
			driver: localForage.INDEXEDDB,
			name: 'Spotify Backup',
			storeName: 'spotify_backup',
			description: 'Storage for the Spotify Backup app'
		});

		this.initialized = true;
	}

	private static async getAccessToken(): Promise<string> {
		// TODO: get this server side, don't exposes token client side if possible
		let spotifyAuthResponse =
			await localForage.getItem<SpotifyAuthResponse>('spotify_auth_response');

		if (!spotifyAuthResponse) {
			throw Error('Error retrieving the saved spotify auth');
		}

		return spotifyAuthResponse.access_token;
	}

	public static async getUserProfile(): Promise<SpotifyUserProfile> {
		const accessToken = await SpotifyService.getAccessToken();
		const response = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: 'Bearer ' + accessToken
			}
		});

		const data = (await response.json()) as SpotifyUserProfile;

		await localForage.setItem<SpotifyUserProfile>('spotify_user_profile', data);

		return data;
	}

	/**
	 *
	 * Can also user this API (current user) instead of by user id, but id more flexible:
	 * https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
	 *
	 * TODO: implement rate limiting fallback,
	 * See: https://developer.spotify.com/documentation/web-api/concepts/rate-limits
	 *
	 * @param userId The id of the user to get playlists for
	 */
	public static async getUserPlaylists(
		userId: string,
		nextUrl?: string,
		spotifyUserPlaylistsResponse?: Partial<SpotifyUserPlaylistsResponse>
	): Promise<Partial<SpotifyUserPlaylistsResponse>> {
		const accessToken = await SpotifyService.getAccessToken();
		const response = await fetch(
			nextUrl || `https://api.spotify.com/v1/users/${userId}/playlists`,
			{
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			}
		);

		const data = (await response.json()) as SpotifyUserPlaylistsResponse;

		if (!nextUrl) {
			console.debug(`\nTotal Playlists: ${data.total}\n`);
		}

		const playlists = data.items.map(
			(item) =>
				({
					id: item.id,
					name: item.name,
					tracks: { ...item.tracks }
				}) as SpotifyUserPlaylists
		);
		const previousPlaylists = [...(spotifyUserPlaylistsResponse?.items || [])]; // REFACTOR: nasty work here lol

		spotifyUserPlaylistsResponse = {
			total: data.total,
			items: [...previousPlaylists, ...playlists]
		} as Partial<SpotifyUserPlaylistsResponse>;

		if (data.next) {
			return SpotifyService.getUserPlaylists(userId, data.next, spotifyUserPlaylistsResponse);
		} else {
			return spotifyUserPlaylistsResponse;
		}
	}

	/**
	 * Relevant API:
	 * https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
	 *
	 * @param playlistId The id of the playlist to get tracks for
	 */
	public static async getPlaylistTracks(
		playlistId: string,
		playlistName: string,
		nextUrl?: string,
		spotifyPlaylistsItemsResponse?: Partial<SpotifyPlaylistsItemsResponse>
	): Promise<Partial<SpotifyPlaylistsItemsResponse>> {
		const accessToken = await SpotifyService.getAccessToken();
		const response = await fetch(
			nextUrl || `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
			{
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			}
		);

		const data = (await response.json()) as SpotifyPlaylistsItemsResponse;

		if (!nextUrl) {
			console.log(`\nTotal Tracks for [Playlist] ${playlistName}: ${data.total}\n`);
		}

		// TODO: create mapper classes and add null checking
		const playlistTracks = data?.items.map(
			(item) =>
				({
					added_at: item?.added_at,
					track: {
						id: item?.track?.id,
						name: item?.track?.name,
						album: {
							id: item?.track?.album.id,
							name: item?.track?.album.name
						} as SpotifyAlbum,
						artists: item?.track?.artists?.map(
							(artist) =>
								({
									id: artist?.id,
									name: artist?.name
								}) as SpotifyArtist
						)
					} as SpotifyTrack
				}) as SpotifyPlaylistItem
		);

		const previousPlaylistTracks = [...(spotifyPlaylistsItemsResponse?.items || [])]; // REFACTOR: nasty work here lol

		spotifyPlaylistsItemsResponse = {
			total: data?.total,
			items: [...previousPlaylistTracks, ...playlistTracks]
		} as Partial<SpotifyPlaylistsItemsResponse>;

		if (data.next) {
			return SpotifyService.getPlaylistTracks(
				playlistId,
				playlistName,
				data.next,
				spotifyPlaylistsItemsResponse
			);
		} else {
			return spotifyPlaylistsItemsResponse;
		}
	}
}
