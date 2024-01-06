<script lang="ts">
	export let totalPlaylists = 0;
	export let fetchedPlaylists = 0;
</script>

<label for="progress-bar">Fetching Playlists...({fetchedPlaylists}/{totalPlaylists})</label>
<progress id="progress-bar" max={totalPlaylists} value={fetchedPlaylists}></progress>

<style lang="scss">
	label {
		font-size: 1.25em;
	}
</style>
