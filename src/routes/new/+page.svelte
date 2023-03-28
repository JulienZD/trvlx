<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';
  import { onMount } from 'svelte';
  import { zCreateTrip } from '$lib/schemas/trip';

  import { createForm } from 'felte';
  import { validator } from '@felte/validator-zod';
  import { extractFormErrors } from '$lib/util/form';
  import ValidationMessage from '$lib/components/ValidationMessage.svelte';

  const client = trpc($page);

  const mostRecentTrip = client.trips.mostRecent.createQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const createTrip = client.trips.create.createMutation();

  const modeOrAvgDistance = client.trips.modeOrAvgDistance.createQuery();

  let now = new Date(),
    month,
    day,
    year;

  let dateString = '';

  let hasSeenModeOrAvgUsageMessage = false;

  onMount(() => {
    (month = '' + (now.getMonth() + 1)), (day = '' + now.getDate()), (year = now.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    dateString = [year, month, day].join('-');
  });

  const {
    form,
    errors: formErrors,
    setFields,
    touched,
  } = createForm({
    extend: validator({
      schema: zCreateTrip,
    }),
    initialValues: {
      date: dateString,
      startKm: $mostRecentTrip?.data?.endKm || 0,
      endKm: ($mostRecentTrip?.data?.endKm || 0) + ($modeOrAvgDistance.data || 1),
      isPrivate: false,
    },
    onSubmit: (data) => $createTrip.mutate(data),
  });

  $: setFields((fields) => {
    const latestStartKm = $mostRecentTrip?.data?.endKm || 0;

    return {
      ...fields,
      date: dateString,
      startKm: latestStartKm,
      endKm: Math.max(fields.endKm || 0, latestStartKm + ($modeOrAvgDistance.data || 1)),
    };
  });

  $: errors = extractFormErrors($createTrip, $formErrors);

  $: {
    // Recalculate endKm based on mode / avg when startKm changes, and endKm hasn't yet
    if ($touched.startKm && !$touched.endKm) {
      setFields((fields) => ({
        ...fields,
        endKm: fields.startKm + ($modeOrAvgDistance.data || 1),
      }));
    }

    hasSeenModeOrAvgUsageMessage = $touched.endKm;
  }
</script>

<h2 class="mt-4 font-['Anton'] text-3xl">Nieuwe rit</h2>

<form use:form class="flex w-full flex-col justify-center gap-y-4 px-8 text-black">
  <div class="flex flex-col ">
    <label for="date">Datum</label>
    <input class="rounded-sm border border-black" type="date" name="date" id="date" value={dateString} />
    <ValidationMessage message={errors.date} />
  </div>

  <div class="flex flex-col font-['Solitreo'] text-xl">
    <label for="startKm">Kilometerstand start</label>
    <input
      disabled={$mostRecentTrip.isLoading}
      class="rounded-sm border border-black pl-2 italic"
      min="0"
      type="number"
      name="startKm"
      id="startKm"
    />
    <ValidationMessage message={errors.startKm} />
  </div>

  <div class="flex flex-col font-['Dokdo'] text-3xl">
    <label for="endKm">Kilometerstand eind</label>
    <input
      class="rounded-sm border border-black pl-2"
      min={$mostRecentTrip?.data?.endKm || 0}
      type="number"
      name="endKm"
      id="endKm"
    />
    {#if !hasSeenModeOrAvgUsageMessage}
      <p class="mt-0.5 font-['Pangolin'] text-sm italic">
        Automatisch ingevuld op basis van je meest gebruikte rit of gemiddelde rit.
      </p>
    {/if}
    <ValidationMessage message={errors.endKm} />
  </div>

  <label for="isPrivate" class="relative ml-16 inline-flex cursor-pointer items-center font-['Pangolin']">
    <input id="isPrivate" name="isPrivate" type="checkbox" checked={false} class="peer sr-only" />
    <div
      class="peer h-8 w-14 rounded-md border border-black bg-white after:absolute after:top-[2px] after:left-[2px] after:h-7 after:w-7 after:rounded-sm after:border after:border-black after:bg-black after:transition-all after:content-[''] peer-checked:bg-white peer-checked:after:translate-x-full peer-checked:after:border-black peer-focus:outline-none"
    />
    <span class="ml-3 text-3xl font-medium">Prive</span>
  </label>

  <button
    type="submit"
    class="mt-8 h-12 rounded-sm border border-black pl-2 text-left font-['Odor_Mean_Chey'] text-2xl font-bold tracking-tight md:after:mx-14"
    class:bg-red-700={$createTrip.isError}>Toeveogen</button
  >
</form>

{#if $createTrip.isSuccess}
  <div class="mt-8 font-['Ballet'] text-2xl">Rit toegeveogd!</div>
{/if}

<style lang="postcss">
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Ballet:opsz@16..72&family=Comic+Neue:wght@400;700&family=Dokdo&family=Odor+Mean+Chey&family=Pangolin&family=Solitreo&display=swap');
</style>
