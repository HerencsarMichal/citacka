<template>
    <nav class="navbar">
        <div class="navbar-container">
            <div class="navbar-left">
                <router-link to="/" class="logo">📚</router-link>
            </div>

            <!-- Hamburger button -->
            <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen" :class="{ active: mobileMenuOpen }">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <!-- Nav links -->
            <div class="nav-links" :class="{ open: mobileMenuOpen }">
                <router-link to="/" class="nav-link" @click="mobileMenuOpen = false">Domov</router-link>
                <router-link to="/library" class="nav-link" @click="mobileMenuOpen = false">Knihovňa</router-link>
                <router-link to="/catalog" class="nav-link" @click="mobileMenuOpen = false">Katalóg</router-link>
                <router-link to="/cart" class="nav-link" @click="mobileMenuOpen = false">Košík</router-link>
                <router-link to="/about" class="nav-link" @click="mobileMenuOpen = false">O nás</router-link>
                <router-link to="/contact" class="nav-link" @click="mobileMenuOpen = false">Kontakt</router-link>
            </div>

            <div class="navbar-right">
                <router-link to="/cart" class="cart">🛒</router-link>
            </div>
        </div>

        <!-- Overlay for mobile menu -->
        <div v-if="mobileMenuOpen" class="nav-overlay" @click="mobileMenuOpen = false"></div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
        return {
            mobileMenuOpen: false
        }
    },
    watch: {
        $route() {
            // Zatvor mobile menu pri zmene route
            this.mobileMenuOpen = false
        }
    }
}
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
    padding: 0 30px;
    height: 100%;
    justify-content: space-between;
    position: relative;
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
    z-index: 1001;
}

.navbar-right {
    display: flex;
    align-items: center;
    z-index: 1001;
}

.logo {
    font-size: 40px;
    margin-right: 50px;
    text-decoration: none;
}

.cart {
    font-size: 30px;
    margin-left: 50px;
    cursor: pointer;
    transition: transform 0.2s;
    text-decoration: none;
}

.cart:hover {
    transform: scale(1.1);
}

.nav-link {
    color: white;
    text-decoration: none;
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

/* Hamburger menu */
.hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    z-index: 1001;
    transition: transform 0.3s;
}

.hamburger span {
    width: 25px;
    height: 3px;
    background-color: white;
    border-radius: 3px;
    transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
    opacity: 0;
}

.hamburger.active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
}

/* Mobile overlay */
.nav-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
}

/* Responsive - Mobile */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }

    .navbar-right .cart {
        margin-left: 0;
        margin-right: 15px;
    }

    .nav-links {
        position: fixed;
        top: 0;
        right: -300px;
        width: 280px;
        height: 100vh;
        background-color: #4a4a4a;
        flex-direction: column;
        align-items: flex-start;
        padding: 80px 2rem 2rem;
        gap: 1.5rem;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
        transition: right 0.3s ease;
        z-index: 1000;
        justify-content: flex-start;
    }

    .nav-links.open {
        right: 0;
    }

    .nav-overlay {
        display: block;
    }

    .nav-link {
        width: 100%;
        padding: 0.75rem 0;
        font-size: 1.1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-link:hover {
        padding-left: 10px;
        background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-link.router-link-exact-active {
        border-bottom: 2px solid gold;
        background-color: rgba(255, 215, 0, 0.1);
    }
}

@media (max-width: 480px) {
    .navbar-container {
        padding: 0 15px;
    }

    .logo {
        font-size: 32px;
        margin-right: 0;
    }

    .cart {
        font-size: 24px;
    }
}
</style>