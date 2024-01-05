export interface SpotifyAuthResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

/**
 * Only set the properties needed to get relevant playlist info, update when necessary.
 * See: https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
 */
export interface SpotifyUserProfile {
	id: string;
}
