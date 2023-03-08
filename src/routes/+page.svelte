<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';

  let greeting = 'press the button to load data';
  let loading = false;

  const loadData = async () => {
    loading = true;
    greeting = await trpc($page).greeting.query();
    loading = false;
  };
</script>

<p>Loading data in<br /><code>+page.svelte</code></p>

<a href="#load" role="button" class="secondary" aria-busy={loading} on:click|preventDefault={loadData}>Load</a>
<p>{greeting}</p>
