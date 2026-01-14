<script>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
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
    <!--<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height=" 125" />-->

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink to="/">Home1appvue</RouterLink>
        <RouterLink to="/reader">About2</RouterLink>
        <RouterLink to="/library">About3</RouterLink>
        <RouterLink to="/cart">About4</RouterLink>
        <RouterLink to="/viewer">About5</RouterLink>
        <RouterLink to="/about">About6</RouterLink>
        <RouterLink to="/about">About7appvue</RouterLink>
      </nav>
      </div>
      <RouterView />
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
