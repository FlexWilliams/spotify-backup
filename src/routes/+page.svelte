<script lang="ts">
	import { onMount } from 'svelte';

	const client_id = '35d2f05f0f9742a9bd7dd4f383a30b7d';
	const redirect_uri = encodeURI('http://localhost:5173/spotify-auth-callback');

	onMount(() => {});

	function getStateCode(): string {
		const min = Math.ceil(9999999);
		const max = Math.floor(99999999);

		const val = Math.floor(Math.random() * (max - min + 1) + min);
		return `${val}`;
	}
	function loginWithSPotify(): void {
		const state = getStateCode();
		const scope = 'playlist-read-private';
		const redirectUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;

		window.location.href = redirectUrl;
	}
</script>

<button type="button" on:click={() => loginWithSPotify()}>Login with Spotify</button>

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
