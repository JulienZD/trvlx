<script lang="ts">
  export let action: () => void;
  export let prompt = 'Are you sure?';

  const confirmAction = () => {
    if (confirm(prompt)) {
      action();
    }
  };
</script>

<button on:click={confirmAction}>
  <slot />
</button>
