<script>
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import '../app.css';

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <main class="container px-4">
    <slot />
  </main>
</QueryClientProvider>
