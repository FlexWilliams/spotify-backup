<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {});
</script>

<header>
	<h1>Spotify Backup</h1>
</header>
<main>
	<slot />
</main>
<footer></footer>

<style lang="scss">
	header {
		display: flex;
		justify-content: center;
		box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
	}

	main {
		padding: 32px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
