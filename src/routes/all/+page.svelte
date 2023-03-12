<script lang="ts">
  import { page } from '$app/stores';
  import ConfirmAction from '$lib/components/ConfirmAction.svelte';
  import TrashIcon from '$lib/components/TrashIcon.svelte';
  import { trpc } from '$lib/trpc/client';
  import { toastStore } from '@skeletonlabs/skeleton';

  const client = trpc($page);

  const trips = client.trips.all.createQuery();
  const deleteTrip = client.trips.delete.createMutation({
    onSuccess: () => {
      toastStore.trigger({
        message: 'Rit verwijderd 👌',
        background: 'variant-outline bg-white ring-slate-300',
        classes: "font-['Pangolin']",
        timeout: 3500,
      });
      $trips.refetch();
    },
  });

  const onDeleteTrip = (tripId: string) => {
    $deleteTrip.mutate({ id: tripId });
  };
</script>

<h2 class="mt-4 text-center font-['Anton'] text-3xl uppercase tracking-widest">All mijn ritten</h2>
{#if $trips.data?.length}
  <ul class="list-none">
    {#each $trips.data as trip (trip.id)}
      {@const tripDate = trip.date.toLocaleDateString('nl', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
      <li class="mr-4 border-b border-dashed border-black">
        <div class="not-prose">
          <p class="mb-0 font-['Dokdo'] text-4xl font-bold tracking-wider capitalize">{tripDate}</p>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-['Mynerve'] text-3xl">Start: {trip.startKm}km</p>

              <p class="font-['Mynerve'] text-3xl">Eind: {trip.endKm}km</p>
              {#if trip.isPrivate}
                <span
                  class="inline-flex items-center rounded-md border-4 border-gray-800 px-2.5 py-0.5 text-lg font-bold italic text-gray-800 underline"
                >
                  Privé
                </span>
              {/if}
            </div>
            <ConfirmAction prompt="Wil je echt {tripDate} verwijderen?" action={() => onDeleteTrip(trip.id)}>
              <TrashIcon />
            </ConfirmAction>
          </div>
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
