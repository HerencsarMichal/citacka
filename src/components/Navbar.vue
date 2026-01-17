<template>
    <nav class="navbar">
        <div class="navbar-container">
            <div class="navbar-left">
                <router-link to="/" class="logo">📚</router-link>
            </div>
            <!-- Navlinks-->
            <div class="nav-links">
                <router-link to="/" class="nav-link">Home</router-link>
                <router-link to="/reader" class="nav-link">Reader</router-link>
                <router-link to="/library" class="nav-link">Library</router-link>
                <router-link to="/cart" class="nav-link">Cart</router-link>
                <router-link to="/about" class="nav-link">About</router-link>
                <router-link to="/contact" class="nav-link">Contact</router-link>
            </div>
            <div class="navbar-right">
                <router-link to="/cart" class="cart">🛒</router-link>
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
    top: 0;
    z-index: 1000;
    padding: 0;
    margin: 0;
    height: 60px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
    align-items: center;
    display: flex;
    padding: 0 30px;     /* Odsadenie od ľava pre nabar komponenty*/
    height: 100%;
    justify-content: space-between;
}

.nav-links {
    padding: 0 30px;
    display: flex;
    gap: 20px;
    flex-grow: 1;
    justify-content: center;
}

.navbar-left {
    display: flex;
    align-items: center;
}

.navbar-right {
    display: flex;
    align-items: center;
}

.logo {
    font-size: 40px;
    margin-right: 50px;
}

.cart {
    font-size: 30px;
    margin-left: 50px;
    cursor: pointer;
    transition: transform 0.2s;
}

.nav-link:hover {
    color: blue;
    text-decoration: underline;
    padding: 0px 10px;
    border-radius: 5px;
    transition: background-color 0.3s, transform 0.2s;
    transform: scale(1, 1);
}

.nav-link.router-link-exact-active {
    font-weight: bold;
    border-bottom: 2px solid white;
    color: gold;
}
</style>