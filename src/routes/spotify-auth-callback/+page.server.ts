import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import type { SpotifyAuthResponse } from '$lib/spotify';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, url }) {
	// TODO: `state` validation (security flaw)!!
	// See: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
	const state = url.searchParams.get('state');

	const code = url.searchParams.get('code');
	const redirect_uri = 'http://localhost:5173/spotify-auth-callback';

	if (!state || !code) {
		throw Error(`Received invalid state or code after spotify auth redirect!`);
	}

	const formData = `code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(
		redirect_uri
	)}&grant_type=authorization_code`;

	// TODO: ensure this is only accessible via svelte backend
	const bearerToken = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
		'base64'
	);

	const fetchToken = async (): Promise<SpotifyAuthResponse> => {
		const res = await fetch(`https://accounts.spotify.com/api/token`, {
			method: 'POST',
			body: formData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				Authorization: `Basic ${bearerToken}`
			}
		});

		const data = await res.json();

		return data as SpotifyAuthResponse;
	};

	return {
		spotifyAuthResponse: await fetchToken()
	};
}
