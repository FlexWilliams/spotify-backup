<script lang="ts">
	import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } from '$env/static/public';

	export let data;
	const { stateCode } = data;

	const client_id = PUBLIC_SPOTIFY_CLIENT_ID;
	const redirect_uri = encodeURI(PUBLIC_SPOTIFY_REDIRECT_URI);

	function loginWithSpotify(): void {
		const state = stateCode;
		const scope = 'playlist-read-private';
		const urlParams = `response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;
		const redirectUrl = `https://accounts.spotify.com/authorize?${urlParams}`;

		window.location.href = redirectUrl;
	}
</script>

<button type="button" on:click={() => loginWithSpotify()}>Login with Spotify</button>

<style lang="scss">
	button {
		height: 40px;
		width: 250px;
		background-color: #1db954;
		border: none;
		border-radius: 24px;
		color: white;
		font-weight: bold;
		font-size: 1em;
		cursor: pointer;
	}
</style>
