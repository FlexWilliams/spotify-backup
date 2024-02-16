<script lang="ts">
	import { goto } from '$app/navigation';
	import { type SpotifyAuthResponse } from '$lib';
	import * as localForage from 'localforage';
	import { onMount } from 'svelte';

	export let data;
	const { spotifyAuthResponse } = data;

	onMount(async () => {
		await localForage.setItem<SpotifyAuthResponse>('spotify_auth_response', spotifyAuthResponse);
		goto('/user-playlists');
	});
</script>
