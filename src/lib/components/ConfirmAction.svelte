<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton';

  export let action: () => void;
  export let prompt = 'Weet je het zeker?';

  const confirmAction = () => {
    modalStore.trigger({
      type: 'confirm',
      title: prompt,
      modalClasses: "!bg-white !font-['Comic_Sans_MS'] !text-xs",
      response: (confirmed: boolean) => {
        if (confirmed) {
          action();
        }
      },
      buttonTextConfirm: 'Ja',
      buttonTextCancel: 'Nee',
    });
  };
</script>

<button on:click={confirmAction}>
  <slot />
</button>
