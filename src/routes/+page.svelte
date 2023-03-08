<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';
  import type { PageData } from './$types';
  import { signIn, signOut } from '@auth/sveltekit/client';

  export let data: PageData;
  let name = '';

  // This gets run without any debounce
  $: hello = trpc($page).example.greeting.createQuery(
    {
      name,
    },
    {
      enabled: !!name,
    }
  );

  const queries = data.queries();
  const foo = data.foo();
</script>

<div class="flex flex-col max-w-sm">
  <label for="name">Name</label>
  <input class="border rounded border-blue-600" id="name" type="text" bind:value={name} />
</div>

{#if $hello.isLoading}
  <p>Enter your name to be greeted</p>
{/if}

{#if $hello.isSuccess}
  <p>{$hello.data}</p>
{/if}

{#if $hello.isError}
  <p>Failed to load data in<br /><code>+page.svelte</code></p>
{/if}

{#each $queries as query}
  {#if query.isLoading}
    Loading...
  {:else if query.isError}
    {query.error.message}
  {:else if query.data}
    {query.data}
  {/if}
  <br />
{/each}

{#if $foo.isLoading}
  Loading...
{:else if $foo.isError}
  {$foo.error.message}
{:else if $foo.data}
  {$foo.data}
{/if}

<h1>SvelteKit Auth Example</h1>
<p>
  {#if $page.data.session}
    <span>
      <small>Signed in as</small><br />
      <strong>{$page.data.session.user?.name ?? 'User'}</strong>
    </span>
    <button on:click={() => signOut()} class="button">Sign out</button>
  {:else}
    <span>You are not signed in</span>
    <button on:click={() => signIn('discord')}>Sign In with Discord</button>
  {/if}
</p>
