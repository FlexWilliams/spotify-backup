<script lang="ts">
	import {
		SpotifyService,
		spotifyTrackToBackupTrack,
		type SpotifyAuthResponse,
		type SpotifyBackupUserPlaylists,
		type SpotifyUserPlaylists,
		type SpotifyUserPlaylistsResponse,
		type SpotifyUserProfile
	} from '$lib';
	import UserPlaylists from '$lib/playlists/UserPlaylists.svelte';
	import * as localForage from 'localforage';
	import { onMount } from 'svelte';

	export let data;
	const { spotifyAuthResponse } = data;

	let doneFetchingUserPlaylists = false;
	let doneExportingUserPlaylists = false;
	let exportingPlaylists = false;
	let totalPlaylists = 0;
	let totalPlaylistsSelected = 0;
	let totalPlaylistsExported = 0;
	let userProfile: SpotifyUserProfile;
	let userPlaylists: Partial<SpotifyUserPlaylistsResponse>;

	let spotifyBackupUserPlaylists = {
		userId: '',
		playlists: []
	} as SpotifyBackupUserPlaylists;

	async function exportAllPlaylists(
		playlists?: SpotifyUserPlaylists[]
	): Promise<SpotifyBackupUserPlaylists> {
		spotifyBackupUserPlaylists.userId = userProfile.id;
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
					tracks: userPlaylistItems.items
						? userPlaylistItems.items.map((item) => spotifyTrackToBackupTrack(item))
						: []
				});

				totalPlaylistsExported++;
			}

			console.debug(`Fetched playlists!`);

			exportingPlaylists = false; // REFACTOR: nasty work having duplicate flags, needed because of html markup
			doneExportingUserPlaylists = true;
			return resolve(spotifyBackupUserPlaylists);
		});
	}

	async function exportSelectedPlaylists(selectedPlaylistIds: string[]): Promise<void> {
		if (!selectedPlaylistIds) {
			return;
		}

		const selectedPlaylists = userPlaylists.items?.filter(
			(i) => selectedPlaylistIds.indexOf(i.id) > -1
		);
		await exportAllPlaylists(selectedPlaylists);
	}

	function resetExportQueue(playlistsSelected: number): void {
		totalPlaylistsSelected = playlistsSelected;
		totalPlaylistsExported = 0;
		doneExportingUserPlaylists = false;
	}

	function resetPlaylistExport(): void {
		doneExportingUserPlaylists = false;
		document.querySelectorAll('.play-list-card__checkbox').forEach((val) => {
			(val as HTMLInputElement).checked = false;
		});
		totalPlaylistsSelected = 0;
		totalPlaylistsExported = 0;
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
		await localForage.setItem<SpotifyAuthResponse>('spotify_auth_response', spotifyAuthResponse);
		userProfile = await SpotifyService.getUserProfile();
		userPlaylists = await SpotifyService.getUserPlaylists(userProfile.id);
		doneFetchingUserPlaylists = true;
		totalPlaylists = userPlaylists.total || 0;
	});
</script>

<section class="spotify-playlists-export">
	{#if !doneFetchingUserPlaylists}
		<p
			class="export-playlists__loading-indicator"
			class:export-playlists__loading-indicator--loading={!doneFetchingUserPlaylists}
		>
			Fetching number of playlists...
		</p>
	{:else}
		<UserPlaylists
			{totalPlaylists}
			{totalPlaylistsSelected}
			{totalPlaylistsExported}
			playlists={userPlaylists.items || []}
			{doneExportingUserPlaylists}
			{exportingPlaylists}
			on:exportAllPlaylists={() => exportAllPlaylists(userPlaylists.items)}
			on:exportSelectedPlaylists={(event) => exportSelectedPlaylists(event.detail)}
			on:downloadPlaylistExport={() => downloadPlaylistExport()}
			on:resetPlaylistExport={() => resetPlaylistExport()}
			on:resetExportQueue={(event) => resetExportQueue(event.detail)}
		/>
	{/if}
</section>

<style lang="scss">
	.spotify-playlists-export {
		display: flex;
		flex-direction: column;
		height: 100%;
		align-items: center;
		font-size: 1.5em;
		font-weight: bold;
		width: 100%;
	}
</style>
