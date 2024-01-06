<script lang="ts">
	import {
		SpotifyService,
		type SpotifyAuthResponse,
		type SpotifyBackupPlaylist,
		type SpotifyBackupPlaylistTrack,
		type SpotifyBackupUserPlaylists
	} from '$lib';
	import * as localForage from 'localforage';
	import { onMount } from 'svelte';

	export let data;
	const { spotifyAuthResponse } = data;

	let fetchedPlaylists = false;

	let spotifyBackupUserPlaylists = {
		userId: '',
		playlists: []
	} as SpotifyBackupUserPlaylists;

	async function fetchUserPlaylists(userId: string): Promise<SpotifyBackupUserPlaylists> {
		const userPlaylists = await SpotifyService.getUserPlaylists(userId);

		spotifyBackupUserPlaylists.userId = userId;

		return new Promise(async (resolve) => {
			if (!userPlaylists.items) {
				console.info('No playlists were found for the user!');
				// TODO: display something on UI!
				return resolve(spotifyBackupUserPlaylists);
			}

			for (let i = 0; i < userPlaylists.items.length; i++) {
				const item = userPlaylists.items[i];
				const userPlaylistItems = await SpotifyService.getPlaylistTracks(item.id, item.name);

				spotifyBackupUserPlaylists.playlists.push({
					id: item.id,
					name: item.name,
					tracks: userPlaylistItems.items?.map(
						(i) =>
							({
								name: i?.track?.name,
								album: i?.track?.album?.name,
								artists: i?.track?.artists
									? i.track.artists
											.map((a) => a.name)
											.join(', ')
											.trim()
									: []
							}) as SpotifyBackupPlaylistTrack
					)
				} as SpotifyBackupPlaylist);
			}

			console.debug(`Fetched playlists!`);
			fetchedPlaylists = true;
			return resolve(spotifyBackupUserPlaylists);
		});
	}

	function downloadPlaylistExport(): void {
		const content = JSON.stringify(spotifyBackupUserPlaylists, null, 2);
		const date = new Date().toLocaleDateString().replace(/\//g, '-');
		var a = document.createElement('a');
		var file = new Blob([content], { type: 'application/json' });
		a.href = URL.createObjectURL(file);
		a.download = `${spotifyBackupUserPlaylists.userId}_spotify-backup_${date}.json`;
		a.click();
	}

	onMount(async () => {
		// TODO: get this server side, don't exposes token client side if possible
		await localForage.setItem<SpotifyAuthResponse>('spotify_auth_response', spotifyAuthResponse);

		const userProfile = await SpotifyService.getUserProfile();
		const userPlaylistExport = await fetchUserPlaylists(userProfile.id);
		console.log(userPlaylistExport); // TODO: export to csv/json/email...
	});
</script>

<section class="export-playlists">
	<p
		class="export-playlists__loading-indicator"
		class:export-playlists__loading-indicator--loading={!fetchedPlaylists}
	>
		Fetching Your Playlists...
	</p>
	<button type="button" on:click={() => downloadPlaylistExport()} disabled={!fetchedPlaylists}
		>Download Playlists Export (.json)</button
	>
</section>

<style lang="scss">
	.export-playlists {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.export-playlists__loading-indicator {
		display: none;
	}

	.export-playlists__loading-indicator--loading {
		display: initial;
	}

	button {
		height: 40px;
		width: 250px;
		background-color: #1db954; // TODO: add to color map
		border: none;
		border-radius: 24px;
		color: white;
		font-weight: bold;
		cursor: pointer;

		&:disabled {
			background-color: gray;
			cursor: not-allowed;
		}
	}
</style>
