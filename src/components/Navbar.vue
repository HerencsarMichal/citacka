<template>

    <nav class="navbar">
        <div class="navbar-container">
            <!--< class="navbar-brand"> -->
            <!-- <router-link to="/" class="brand-link">Temporary1</router-link> -->
        <!-- Navlinks-->
         <div class="nav-links">
            <router-link to="/about" class="nav-link">About</router-link>
            <router-link to="/services" class="nav-link">Services</router-link>
            <router-link to="/contact" class="nav-link">Contact</router-link>
            <router-link to="/about" class="nav-link">About</router-link>
            <router-link to="/services" class="nav-link">Services</router-link>
            <router-link to="/contact" class="nav-link">Contact</router-link>
            <router-link to="/profile" class="nav-link">Profil</router-link>
         <!-- </div> -->
         </div>
    </div>
    </nav>

    </template>

    <script>
export default {
    name: 'Navbar',
};
    </script>
    <style scoped>

.navbar {
    background-color: gray;
    color: white;
    position: fixed;
    width: 100%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    top: 0;
    z-index: 1000;
    height: 60px;
}

.navbar-container {
    max-width: 800px;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 100%;
}
</style>