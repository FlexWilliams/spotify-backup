<script lang="ts">
	import {
		SpotifyService,
		type SpotifyAuthResponse,
		type SpotifyBackupPlaylist,
		type SpotifyBackupPlaylistTrack,
		type SpotifyBackupUserPlaylists,
		type SpotifyUserPlaylists,
		type SpotifyUserPlaylistsResponse,
		type SpotifyUserProfile
	} from '$lib';
	import * as localForage from 'localforage';
	import { onMount } from 'svelte';

	export let data;
	const { spotifyAuthResponse } = data;

	let doneFetchingUserPlaylists = false;
	let doneExportingUserPlaylists = false;
	let exportingPlaylists = false;
	let totalPlaylists = 0;
	let userProfile: SpotifyUserProfile;
	let userPlaylists: Partial<SpotifyUserPlaylistsResponse>;

	let spotifyBackupUserPlaylists = {
		userId: '',
		playlists: []
	} as SpotifyBackupUserPlaylists;

	async function exportAllPlaylists(
		userId: string,
		playlists?: SpotifyUserPlaylists[]
	): Promise<SpotifyBackupUserPlaylists> {
		spotifyBackupUserPlaylists.userId = userId;
		doneExportingUserPlaylists = false;
		exportingPlaylists = true;

		return new Promise(async (resolve) => {
			if (!playlists) {
				console.info('No playlists were passed in to export!');
				exportingPlaylists = false;
				doneExportingUserPlaylists = true;
				// TODO: display something on UI!
				return resolve(spotifyBackupUserPlaylists);
			}

			for (let i = 0; i < playlists.length; i++) {
				const item = playlists[i];
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

			exportingPlaylists = false; // REFACTOR: nasty work having duplicate flags, needed because of html markup
			doneExportingUserPlaylists = true;
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
		userProfile = await SpotifyService.getUserProfile();
		userPlaylists = await SpotifyService.getUserPlaylists(userProfile.id);
		doneFetchingUserPlaylists = true;
		totalPlaylists = userPlaylists.total || 0;
	});
</script>

<section class="export-playlists">
	{#if !doneFetchingUserPlaylists}
		<p
			class="export-playlists__loading-indicator"
			class:export-playlists__loading-indicator--loading={!doneFetchingUserPlaylists}
		>
			Fetching number of playlists...
		</p>
	{:else}
		<!-- TODO: make into component (for specific playlist selection and export)-->
		<section class="user-playlists">
			<p class="user-playlists__playlist-count">
				Total Playlists: <span>{totalPlaylists}</span>
			</p>

			{#if doneExportingUserPlaylists}
				<button type="button" on:click={() => downloadPlaylistExport()}
					>Download Playlists Export (.json)</button
				>
			{:else}
				{#if exportingPlaylists}
					<p>Exporting playlists from Spotify...</p>
				{/if}
				<button
					type="button"
					on:click={() => exportAllPlaylists(userProfile.id, userPlaylists.items)}
					disabled={exportingPlaylists}>Export All Playlists</button
				>
			{/if}
		</section>
	{/if}
</section>

<style lang="scss">
	.export-playlists {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.export-playlists__loading-indicator {
		font-size: 1.5em;
		display: none;
	}

	.export-playlists__loading-indicator--loading {
		display: initial;
	}

	.user-playlists {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.user-playlists__playlist-count {
		font-size: 1.5em;

		span {
			font-weight: bold;
		}
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
