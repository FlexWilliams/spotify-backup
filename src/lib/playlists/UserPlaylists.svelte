<script lang="ts">
	import type { SpotifyUserPlaylists } from '$lib/spotify';
	import { createEventDispatcher } from 'svelte';
	import PlaylistCard from './PlaylistCard.svelte';

	export let totalPlaylists: number;
	export let totalPlaylistsSelected: number;
	export let playlists: SpotifyUserPlaylists[];
	export let doneExportingUserPlaylists: boolean;
	export let exportingPlaylists: boolean;

	let selectedPlaylistsForExport: string[] = [];

	const dispatch = createEventDispatcher();

	function handleDownloadPlaylistExportClick(): void {
		dispatch('downloadPlaylistExport');
	}

	function handleExportAllPlaylistsClick(): void {
		dispatch('exportAllPlaylists');
	}

	function handleExportSelectedPlaylistsClick(): void {
		dispatch('exportSelectedPlaylists', selectedPlaylistsForExport);
	}

	function selectPlaylistForExport(event: any): void {
		const playlistId = event?.detail;
		if (!playlistId) {
			return;
		}

		if (selectedPlaylistsForExport.indexOf(playlistId) > -1) {
			selectedPlaylistsForExport = selectedPlaylistsForExport.filter((s) => s !== playlistId);
		} else {
			selectedPlaylistsForExport.push(playlistId);
		}

		dispatch('resetExportQueue', selectedPlaylistsForExport.length);
	}
</script>

<section class="user-playlists">
	<p class="user-playlists__playlist-count">
		Total Playlists: <span>{totalPlaylists}</span>
	</p>

	<ul class="user-playlists__playlists">
		{#each playlists as p}
			<li class="user-playlists__playlist">
				<PlaylistCard
					playlist={p}
					on:selectPlaylistForExport={(event) => selectPlaylistForExport(event)}
				/>
			</li>
		{/each}
	</ul>

	<section class="user-playlists__export-actions">
		{#if doneExportingUserPlaylists}
			<button type="button" on:click={() => handleDownloadPlaylistExportClick()}
				>Download Playlists Export (.json)</button
			>
		{:else}
			{#if exportingPlaylists}
				<p>Exporting playlists from Spotify...</p>
			{/if}
			<section class="user-playlists__export-actions-buttons">
				<button
					type="button"
					on:click={() => handleExportAllPlaylistsClick()}
					disabled={exportingPlaylists}>Export All Playlists</button
				>
				<button
					type="button"
					on:click={() => handleExportSelectedPlaylistsClick()}
					disabled={exportingPlaylists}
					>Export Selected Playlists {totalPlaylistsSelected}/{totalPlaylists}</button
				>
			</section>
		{/if}
	</section>
</section>

<style lang="scss">
	@import '../styles/styles.scss';

	.user-playlists {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.user-playlists__playlists {
		height: 100%;
		overflow-y: auto;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.user-playlists__export-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-top: 32px;
		text-align: center;
	}

	.user-playlists__export-actions-buttons {
		display: flex;
		width: 100%;
		justify-content: space-around;
	}

	.user-playlists__playlist-count {
		font-size: 1.5em;
		margin-bottom: 32px;
		span {
			font-weight: bold;
		}
	}

	button {
		@include button;
	}
</style>
