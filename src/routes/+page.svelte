<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';

  const hello = trpc($page).greeting.createQuery();
</script>

{#if $hello.isLoading}
  <p>Loading data in<br /><code>+page.svelte</code></p>
{/if}

{#if $hello.isSuccess}
  <p>{$hello.data}</p>
{/if}

{#if $hello.isError}
  <p>Failed to load data in<br /><code>+page.svelte</code></p>
{/if}
