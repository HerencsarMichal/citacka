<template>
  <div class="app">
    <Navbar />
    <main class="main-content">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useBooksStore } from './stores/books';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
  },
  async mounted() {
    // Inicializácie kníh pri štarte aplikácie
    const booksStore = useBooksStore();
    await booksStore.initializeBooks();
    // Loading uloženého stavu kníh (napr. knižnica, košík)
    booksStore.restoreState();
  }
}
</script>
