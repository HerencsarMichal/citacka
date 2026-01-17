<template>
    <div class="page">
        <div class="container">
            <div class="page-container card shadow rounded-xl">

                <!-- Header -->
                <div class="page-header">
                    <div>
                        <h1>📚 Katalóg kníh</h1>
                        <p class="subtitle">Objavte našu ponuku digitálnych a fyzických kníh</p>
                    </div>

                    <!-- Košík button -->
                    <Button variant="primary" @click="$router.push('/cart')">
                        🛒 Košík
                        <Badge v-if="cartItemsCount > 0" variant="danger" size="small">
                            {{ cartItemsCount }}
                        </Badge>
                    </Button>
                </div>

                <!-- Filters -->
                <div class="filters-section">
                    <div class="filter-group">
                        <label>Žáner:</label>
                        <select v-model="selectedGenre" class="filter-select">
                            <option value="">Všetky žánre</option>
                            <option v-for="genre in genres" :key="genre" :value="genre">
                                {{ genre }}
                            </option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>Zoradiť:</label>
                        <select v-model="sortBy" class="filter-select">
                            <option value="title">Názov</option>
                            <option value="price-asc">Cena (najlacnejšie)</option>
                            <option value="price-desc">Cena (najdrahšie)</option>
                            <option value="rating">Hodnotenie</option>
                            <option value="stock">Dostupnosť</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>Hľadať:</label>
                        <input v-model="searchQuery" type="text" placeholder="Hľadať knihy..." class="search-input">
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="isLoading" class="loading-state">
                    <div class="spinner">⏳</div>
                    <p>Načítavam katalóg...</p>
                </div>

                <!-- Books Grid -->
                <div v-else-if="filteredBooks.length > 0" class="books-grid">
                    <div v-for="book in paginatedBooks" :key="book.id" class="book-card-catalog">
                        <div class="book-icon" :style="{ backgroundColor: book.color }">
                            <span class="emoji">{{ book.emoji }}</span>
                        </div>

                        <div class="book-info">
                            <h3 class="book-title">{{ book.title }}</h3>
                            <p class="book-author">{{ book.author }}</p>

                            <div class="book-meta">
                                <Badge variant="info" size="small">{{ book.genre }}</Badge>
                                <span class="book-pages">📄 {{ book.pages }} strán</span>
                            </div>

                            <div class="book-rating">
                                ⭐ {{ book.rating }}
                            </div>

                            <p class="book-description">{{ book.description }}</p>

                            <div class="book-footer">
                                <div class="price-stock">
                                    <div class="book-price">{{ book.price }}€</div>
                                    <Badge
                                        :variant="book.stock > 10 ? 'success' : book.stock > 0 ? 'warning' : 'danger'"
                                        size="small">
                                        {{ book.stock > 0 ? `Skladom: ${book.stock} ks` : 'Vypredané' }}
                                    </Badge>
                                </div>

                                <div class="book-actions">
                                    <Button v-if="isPurchased(book.id)" variant="secondary" block
                                        @click="$router.push(`/reader/${book.id}`)">
                                        📖 Čítať
                                    </Button>
                                    <Button v-else-if="isInCart(book.id)" variant="ghost" block
                                        @click="removeFromCart(book.id)">
                                        ❌ Odstrániť z košíka
                                    </Button>
                                    <Button v-else variant="primary" block :disabled="book.stock === 0"
                                        @click="addToCart(book.id)">
                                        🛒 Do košíka
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-else class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h2>Nenašli sa žiadne knihy</h2>
                    <p>Skúste zmeniť filter alebo vyhľadávanie</p>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="pagination">
                    <Button variant="ghost" :disabled="currentPage === 1" @click="currentPage--">
                        ← Predchádzajúca
                    </Button>

                    <span class="page-info">
                        Strana {{ currentPage }} z {{ totalPages }}
                    </span>

                    <Button variant="ghost" :disabled="currentPage === totalPages" @click="currentPage++">
                        Ďalšia →
                    </Button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useBooksStore } from '@/stores/books'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'

export default {
    name: 'CatalogPage',
    components: {
        Button,
        Badge
    },
    data() {
        return {
            selectedGenre: '',
            sortBy: 'title',
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 12
        }
    },
    computed: {
        ...mapState(useBooksStore, [
            'allBooks',
            'isLoading',
            'cartItemsCount',
            'isInCart',
            'isPurchased'
        ]),

        genres() {
            const uniqueGenres = new Set(this.allBooks.map(book => book.genre))
            return Array.from(uniqueGenres).sort()
        },

        filteredBooks() {
            let books = [...this.allBooks]

            // Filter by genre
            if (this.selectedGenre) {
                books = books.filter(book => book.genre === this.selectedGenre)
            }

            // Search
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase()
                books = books.filter(book =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query)
                )
            }

            // Sort
            switch (this.sortBy) {
                case 'price-asc':
                    books.sort((a, b) => a.price - b.price)
                    break
                case 'price-desc':
                    books.sort((a, b) => b.price - a.price)
                    break
                case 'rating':
                    books.sort((a, b) => b.rating - a.rating)
                    break
                case 'stock':
                    books.sort((a, b) => b.stock - a.stock)
                    break
                default:
                    books.sort((a, b) => a.title.localeCompare(b.title))
            }

            return books
        },

        totalPages() {
            return Math.ceil(this.filteredBooks.length / this.itemsPerPage)
        },

        paginatedBooks() {
            const start = (this.currentPage - 1) * this.itemsPerPage
            const end = start + this.itemsPerPage
            return this.filteredBooks.slice(start, end)
        }
    },
    watch: {
        filteredBooks() {
            this.currentPage = 1
        }
    },
    async mounted() {
        const store = useBooksStore()
        if (this.allBooks.length === 0) {
            await store.initializeBooks()
        }
    },
    methods: {
        ...mapActions(useBooksStore, ['addToCart', 'removeFromCart']),

        addToCart(bookId) {
            const result = useBooksStore().addToCart(bookId)
            if (result.success) {
                alert('✅ Kniha pridaná do košíka')
            } else {
                alert('❌ ' + result.message)
            }
        }
    }
}
</script>

<style scoped>
.page {
    padding-top: 80px;
    padding-bottom: 40px;
    min-height: 100vh;
}

.page-container {
    background-color: white;
    padding: 2.5rem;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 2rem;
}

.subtitle {
    color: var(--gray-600);
    font-size: 1.1rem;
    margin-top: 0.5rem;
}

/* Filters */
.filters-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: var(--gray-100);
    border-radius: 12px;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-group label {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--gray-700);
}

.filter-select,
.search-input {
    padding: 0.75rem;
    border: 2px solid var(--gray-300);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.filter-select:focus,
.search-input:focus {
    outline: none;
    border-color: var(--gold);
}

/* Books Grid */
.books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.book-card-catalog {
    background: white;
    border: 2px solid var(--gray-200);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.book-card-catalog:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--gold);
}

.book-icon {
    width: 100%;
    aspect-ratio: 3/4;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

.emoji {
    font-size: 4rem;
}

.book-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.book-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--brown-dark);
    margin-bottom: 0.5rem;
}

.book-author {
    font-size: 0.9rem;
    color: var(--gray-600);
    margin-bottom: 0.75rem;
}

.book-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

.book-pages {
    font-size: 0.85rem;
    color: var(--gray-600);
}

.book-rating {
    font-size: 0.9rem;
    color: var(--gold);
    margin-bottom: 0.75rem;
}

.book-description {
    font-size: 0.9rem;
    color: var(--gray-600);
    line-height: 1.5;
    margin-bottom: 1rem;
    flex: 1;
}

.book-footer {
    margin-top: auto;
}

.price-stock {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.book-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--brown-medium);
}

/* Loading & Empty */
.loading-state,
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
}

.spinner {
    font-size: 3rem;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.empty-icon {
    font-size: 5rem;
    opacity: 0.5;
    margin-bottom: 1rem;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid var(--gray-200);
}

.page-info {
    font-weight: 600;
    color: var(--gray-700);
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .books-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1rem;
    }
}
</style>