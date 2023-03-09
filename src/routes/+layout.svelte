<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import type { LayoutData } from './$types';
  import '../app.css';
  import { page } from '$app/stores';
  import { signIn, signOut } from '@auth/sveltekit/client';
  import Arrow from '$lib/components/Arrow.svelte';

  export let data: LayoutData;

  $: signedIn = !!$page.data.session;
</script>

<QueryClientProvider client={data.queryClient}>
  <div class="container prose h-full py-4">
    <div class="flex h-full flex-col border border-black">
      <header class="flex w-full items-center justify-between pl-2 pr-4 align-middle">
        <h1 class="mb-0 font-comicsans text-4xl md:text-6xl">Koele Rittenregistratie App</h1>
        {#if signedIn}
          {#if $page.route.id === '/'}
            <button on:click={() => signOut()} class="shrink-0 rounded border border-black px-2">Sign out</button>
          {:else}
            <a href="/" class="shrink-0 px-2">
              <Arrow />
            </a>
          {/if}
        {/if}
      </header>
      {#if signedIn}
        <main class="prose grow">
          <slot />
        </main>
      {:else}
        <div class="flex flex-col items-center justify-center">
          <h2 class="font-comicsans">Sign in to get started</h2>

          <button
            on:click={() => signIn('discord')}
            class="rounded border border-black bg-[#7289DA] px-2 py-4 font-comicsans text-4xl font-bold text-black"
            >Sign In with Discord</button
          >
        </div>
      {/if}
    </div>
  </div>
</QueryClientProvider>

<style>
  /* Importing this in app.css doesn't work for some reason */
  @import url('https://fonts.googleapis.com/css2?family=Ballet:opsz@16..72&family=Comic+Neue:wght@400;700&display=swap');
</style>
