<script lang="ts">
  import { page } from '$app/stores';
  import { zCreateTrip, type CreateTrip, type TripCsv } from '$lib/schemas/trip';
  import { trpc } from '$lib/trpc/client';
  import { toastStore } from '@skeletonlabs/skeleton';
  import { parse as parseCsv } from 'papaparse';

  let file: File | undefined;

  let error = '';

  const importMutation = trpc($page).trips.import.createMutation({
    onSuccess: () => {
      toastStore.trigger({
        message: 'Import succesvol!',
        background: 'variant-outline bg-white ring-slate-300',
        classes: "font-['Pangolin']",
        timeout: 3500,
      });
    },
  });

  const HEADER_REMAP = {
    date: 'date',
    start: 'startKm',
    end: 'endKm',
    private: 'isPrivate',
  } satisfies Record<keyof TripCsv, keyof CreateTrip>;

  const parseCsvFileToTrips = async (file: File) => {
    return new Promise<CreateTrip[]>((resolve, reject) => {
      parseCsv(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader(header) {
          return HEADER_REMAP[header as never] || header;
        },
        transform(value, field) {
          if (field === 'date') {
            // 2023-12-25
            if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
              return value;
            }
            // 25-12-2023
            else if (value.match(/^\d{2}-\d{2}-\d{4}$/)) {
              const [day, month, year] = value.split('-');
              return `${year}-${month}-${day}`;
            } else {
              throw new Error(`Invalid date: ${value}`);
            }
          }

          if (field === 'isPrivate') {
            return !!value;
          }

          // Otherwise it's either start or end, which should be numbers
          return +value;
        },
        complete: ({ data, meta }) => {
          const requiredFields = Object.values(HEADER_REMAP);
          const missingFields = requiredFields.filter((field) => !meta.fields?.includes(field));

          if (missingFields.length > 0) {
            const missingFieldsInCsv = missingFields.map((field) => {
              const remappedField = Object.entries(HEADER_REMAP).find(([, value]) => value === field);
              return remappedField ? remappedField[0] : field;
            });

            return reject(new Error(`Ontbrekende velden in CSV: ${missingFieldsInCsv.join(', ')}`));
          }

          const parseResult = zCreateTrip.array().safeParse(data);
          if (!parseResult.success) {
            return reject(new Error(parseResult.error.message));
          }

          resolve(parseResult.data);
        },
        error: reject,
      });
    });
  };

  const onImportConfirm = async () => {
    error = '';
    if (!file) {
      error = 'Please select a file';
      return;
    }

    try {
      const trips = await parseCsvFileToTrips(file);

      $importMutation.mutate(trips);
    } catch (e) {
      if (e instanceof Error) {
        error = e.message;
      }
    }
  };

  const onFileSelect = (e: Event) => {
    error = '';

    const [csv] = (e.target as HTMLInputElement).files as FileList;
    if (!csv) {
      error = 'Please select a file';
    }

    file = csv;
  };
</script>

<h1 class="mt-8">Importeren</h1>

<div>
  <p>Importeer je ritten vanuit een CSV-bestand. Het bestand moet een header hebben met de volgende kolommen:</p>
  <ul class="not-prose list-none">
    <li><code>date</code> - De datum van de rit, in het formaat <code>YYYY-MM-DD</code> of <code>DD-MM-YYYY</code></li>
    <li><code>start</code> - Het aantal kilometers bij het begin van de rit</li>
    <li><code>end</code> - Het aantal kilometers bij het einde van de rit</li>
    <li><code>private</code> - Of de rit privé was of niet</li>
  </ul>
</div>

{#if error}
  <p class="text-error-500">{error}</p>
{/if}

{#if $importMutation.isSuccess}
  <p class="text-success-700">Import succesvol!</p>
{/if}

<form on:submit|preventDefault={onImportConfirm}>
  <input type="file" accept=".csv" on:change={onFileSelect} />
  <button
    type="submit"
    class="rounded-md border border-black bg-gray-300 px-2 py-1"
    disabled={$importMutation.isLoading || $importMutation.isSuccess}>Importeer</button
  >
</form>
