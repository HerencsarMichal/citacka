<script>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
  }
}
</script>

<template>
  <div id = "app">
    <Navbar />
    <main class="main-content">
      <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height=" 125" />-->
      <RouterView />
    </main>
  </div>
</template>

<style>
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: whitesmoke;
  /*margin-top: 60px;*/
}

.main-content {
  padding-top: 80px;
}
</style>
