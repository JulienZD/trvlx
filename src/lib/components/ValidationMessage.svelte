<script lang="ts">
  export let message: string | string[] | null | undefined;
</script>

{#if message}
  <span class="text-red-500">{message}</span>
{/if}
