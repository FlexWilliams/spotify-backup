<script lang="ts">
	import type { SpotifyUserPlaylists } from '$lib';
	import { createEventDispatcher } from 'svelte';

	export let playlist: SpotifyUserPlaylists;

	const dispatch = createEventDispatcher();

	function handleSelectPlaylistForExport(): void {
		dispatch('selectPlaylistForExport', playlist.id);
	}
</script>

<section class="playlist-card">
	<div>
		<p class="playlist-card__playlist-name">{playlist?.name}</p>
		<p class="playlist-card__playlist-track-count">Total Tracks: {playlist?.tracks?.total}</p>
	</div>
	<div>
		<input
			type="checkbox"
			class="play-list-card__checkbox"
			on:change={() => handleSelectPlaylistForExport()}
		/>
	</div>
</section>

<style lang="scss">
	.playlist-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid black;
		padding: 16px;
		margin: 16px;
	}

	.playlist-card__playlist-name {
		font-size: 1.25em;
		margin: 0;
	}

	.playlist-card__playlist-track-count {
		margin: 0;
		font-size: 0.75em;
	}

	.play-list-card__checkbox {
		width: 40px;
		height: 40px;
	}
</style>
