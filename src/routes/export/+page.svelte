<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';
  import { unparse } from 'papaparse';

  const getTripsToExport = trpc($page).trips.export.createMutation();

  const exportTrips = async () => {
    const trips = await $getTripsToExport.mutateAsync();

    const csv = unparse(trips);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ritten.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
</script>

<h1 class="mt-4">Exporteer je ritten</h1>

<div class="grid place-content-center">
  <button class="btn variant-filled-primary text-white font-bold" on:click={exportTrips}>Exporteer</button>
</div>
