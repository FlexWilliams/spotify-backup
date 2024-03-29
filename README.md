# Spotify Backup

![Spotify Backup](ui.png 'Spotify Backup mobile screenshot')

<br>

[Demo](https://spotify-backup.pages.dev)

### Currently supports exporting:

1. User Playlists (All)
2. User Playlists (Explicit Selection)

### Sample playlist export (.json)

```json
{
  "userId": "github_user",
  "playlists": [
    {
      "id": "5Z4XPHaCVo3HbXc29s2nL7",
      "name": "House hop",
      "tracks": [
        {
          "name": "Consequence",
          "album": "The Crusade",
          "artists": "TEK.LUN"
        },
        {
          "name": "2018",
          "album": "2018",
          "artists": "Singularis"
        }
      ]
    },
    {
      "id": "3SwrJFECZ4SxA1RLZWE7fd",
      "name": "Poddys",
      "tracks": [
        {
          "name": "Charge Your Battery",
          "album": "Awakening OD",
          "artists": "Awakening OD"
        }
      ]
    }
    ...
  ]
}
```

### Development

#### Installing

```
pnpm install
```

#### Running

NOTE: You need to set the following environment variables within a dotenv file [svelte](https://learn.svelte.dev/tutorial/env-static-private) & [vite](https://vitejs.dev/guide/env-and-mode.html#env-files) :

```
SPOTIFY_CLIENT_SECRET=
PUBLIC_SPOTIFY_CLIENT_ID=
PUBLIC_SPOTIFY_REDIRECT_URI=
```

<br>

Start local dev server:

```
pnpm dev
```

<br>

#### Deploying (Using Cloudfare)

```
pnpm deploy:dev
```

<br>

#### Debugging (In Cloudfare)

Once deployed, leverage [wrangler](https://developers.cloudflare.com/pages/functions/debugging-and-logging/) to view the logs within the running cloudfare instance:

```
pnpm tail:logs
```
