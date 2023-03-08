<script lang="ts">
  const handleSubmit = (ev: SubmitEvent) => {
    console.log('submit', ev);
  };
</script>

<h2 class="mt-4 text-3xl font-['Anton']">Nieuwe rit</h2>

<form on:submit|preventDefault={handleSubmit} class="flex w-full flex-col justify-center gap-y-4 px-8">
  <div class="flex flex-col ">
    <label for="date">Datum</label>
    <input class="rounded-sm border border-black" type="date" name="date" id="date" />
  </div>

  <div class="flex flex-col font-['Solitreo'] text-xl">
    <label for="start">Kilometerstand start</label>
    <input class="rounded-sm border border-black pl-2 italic" min="0" type="number" name="start" id="start" />
  </div>
  <div class="flex flex-col font-['Dokdo'] text-3xl">
    <label for="end">Kilometerstand eind</label>
    <input class="rounded-sm border border-black pl-2" min="0" type="number" name="end" id="end" />
  </div>

  <label for="private" class="ml-16 relative inline-flex cursor-pointer items-center font-['Pangolin']">
    <input id="private" type="checkbox" class="peer sr-only" />
    <div
      class="peer h-8 w-14 bg-white border border-black rounded-md after:absolute after:top-[2px] after:left-[2px] after:h-7 after:w-7 after:border after:border-black after:bg-black after:rounded-sm after:transition-all after:content-[''] peer-checked:bg-white peer-checked:after:translate-x-full peer-checked:after:border-black peer-focus:outline-none"
    />
    <span class="ml-3 text-3xl font-medium">Prive</span>
  </label>

  <button
    type="submit"
    class="mt-8 rounded-sm border border-black font-bold text-2xl text-left pl-2 md:after:mx-14 h-12 font-['Odor_Mean_Chey'] tracking-tight"
    >Toeveogen</button
  >
</form>

<style lang="postcss">
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Ballet:opsz@16..72&family=Comic+Neue:wght@400;700&family=Dokdo&family=Odor+Mean+Chey&family=Pangolin&family=Solitreo&display=swap');

  * {
    @apply text-black;
  }
</style>
