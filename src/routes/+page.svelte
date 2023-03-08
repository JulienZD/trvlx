<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';

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
