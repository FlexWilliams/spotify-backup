import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } from '$env/static/public';
import type { SpotifyAuthResponse } from '$lib/spotify';
import { AUTH_STATE_KEY } from '$lib/storage';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, url, cookies }) {
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	const redirect_uri = PUBLIC_SPOTIFY_REDIRECT_URI;

	if (!state || !code) {
		throw Error(`Received invalid state or code after spotify auth redirect!`);
	}

	const authState = cookies.get(AUTH_STATE_KEY);
	console.log(`\nAuth\nSent: ${authState}, Recieved: ${state}\n`);
	if (authState !== state) {
		throw error(
			500,
			`There was a auth state code mismatch from the Spotify auth!\n Sent: ${authState}, Recieved: ${state}`
		);
	} else {
		cookies.delete(AUTH_STATE_KEY, { path: '/' }); // Auth passed, cookie no longer needed ;)
	}

	const formData = `code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(
		redirect_uri
	)}&grant_type=authorization_code`;

	const bearerToken = Buffer.from(`${PUBLIC_SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
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
