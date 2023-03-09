# Trvlx

A very basic app to track odometer readings.

<img width="350" src="./.github/images/trvlx.png" />

**Note**: The UI was designed as a joke by my friend. It was implemented poorly on purpose. This was mostly built to play around with [tRPC](https://trpc.io) in SvelteKit, most notably the [Svelte Query](https://github.com/vishalbalaji/trpc-svelte-query-adapter) adapter.

## Developing

Once you've installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
