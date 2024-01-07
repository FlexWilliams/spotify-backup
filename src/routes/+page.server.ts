import { AUTH_STATE_KEY } from '$lib/storage';

function getStateCode(): string {
	const min = Math.ceil(9999999);
	const max = Math.floor(99999999);

	const val = Math.floor(Math.random() * (max - min + 1) + min);

	return `${val}`;
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const spotifyAuthClientStateCode = getStateCode();

	// Set the cookie for later verification
	// See: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
	cookies.set(AUTH_STATE_KEY, spotifyAuthClientStateCode, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	});

	return {
		stateCode: spotifyAuthClientStateCode
	};
}
