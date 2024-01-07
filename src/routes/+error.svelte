<script lang="ts">
	import { page } from '$app/stores';
</script>

<section class="server-error">
	<h1>Error:</h1>
	<p>{$page.error?.message}</p>
</section>

<style lang="scss">
	.server-error {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		word-wrap: break-word;
		overflow: hidden;
		text-align: center;
	}

	h1 {
		font-size: 2em;
		font-weight: bold;
		color: red;
	}
</style>
