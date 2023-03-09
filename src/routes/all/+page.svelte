<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';

  const client = trpc($page);

  const trips = client.trips.all.createQuery();
</script>

<h2 class="mt-4 font-['Anton'] text-3xl uppercase tracking-widest text-center">All mijn ritten</h2>
{#if $trips.data}
  <ul class="list-none">
    {#each $trips.data as trip}
      <li class="border-b border-black border-dashed mr-4">
        <div class="not-prose">
          <p class="mb-0 font-bold font-['Dokdo'] text-4xl tracking-wider">{trip.date.toDateString()}</p>
          <p class="font-['Mynerve'] text-3xl">Start: {trip.startKm}km</p>

          <p class="font-['Mynerve'] text-3xl">Eind: {trip.endKm}km</p>
          {#if trip.isPrivate}
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-md border-4 text-lg italic underline font-bold border-gray-800 text-gray-800"
            >
              Privé
            </span>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
{:else}
  <p>Er zijn nog geen ritten</p>
{/if}

<style lang="postcss">
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Ballet:opsz@16..72&family=Comic+Neue:wght@400;700&family=Dokdo&family=Mynerve&family=Odor+Mean+Chey&family=Pangolin&family=Solitreo&display=swap');

  * {
    @apply text-black;
  }
</style>
