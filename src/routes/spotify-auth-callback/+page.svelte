<script lang="ts">
	export let data;
	const { spotifyAuthResponse } = data;
</script>

<div>Access Token: {spotifyAuthResponse?.access_token}</div>
<div>Token Type: {spotifyAuthResponse?.token_type}</div>
<div>Expires In: {spotifyAuthResponse?.expires_in}</div>
<div>Refresh Token: {spotifyAuthResponse?.refresh_token}</div>
<div>Scope: {spotifyAuthResponse?.scope}</div>
