<template>
  <div class="page">
    <div class="container">
      <div class="page-container card shadow rounded-xl">
        
        <!-- Header -->
        <div class="page-header text-center mb-4">
          <h1>📚 Moja knižnica</h1>
          <p class="subtitle">Vaše zakúpené a dostupné knihy</p>
        </div>
        
        <!-- Obsah -->
        <div class="page-content">
          
          <!-- Štatistiky -->
          <div class="stats-grid mb-5">
            <div class="stat-card">
              <div class="stat-icon">📖</div>
              <div class="stat-value">{{ totalBooks }}</div>
              <div class="stat-label">Kníh v knižnici</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-value">{{ completedBooks }}</div>
              <div class="stat-label">Prečítaných</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📗</div>
              <div class="stat-value">{{ readingBooks }}</div>
              <div class="stat-label">Práve čítam</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⏰</div>
              <div class="stat-value">{{ plannedBooks }}</div>
              <div class="stat-label">Na prečítanie</div>
            </div>
          </div>

          <!-- Filter tabs -->
          <div class="filter-tabs mb-4">
            <Button 
              variant="ghost"
              size="small"
              :class="{ active: activeFilter === 'all' }"
              @click="activeFilter = 'all'"
            >
              Všetky knihy
            </Button>
            
            <Button 
              variant="ghost"
              size="small"
              :class="{ active: activeFilter === 'reading' }"
              @click="activeFilter = 'reading'"
            >
              Práve čítam
            </Button>
            
            <Button 
              variant="ghost"
              size="small"
              :class="{ active: activeFilter === 'completed' }"
              @click="activeFilter = 'completed'"
            >
              Prečítané
            </Button>
            
            <Button 
              variant="ghost"
              size="small"
              :class="{ active: activeFilter === 'planned' }"
              @click="activeFilter = 'planned'"
            >
              Plánujem čítať
            </Button>
          </div>

          <!-- Prázdna knižnica -->
          <div v-if="filteredBooks.length === 0 && activeFilter === 'all'" class="empty-library text-center py-5">
            <div class="empty-icon mb-3">📚</div>
            <h2 class="mb-3">Vaša knižnica je prázdna</h2>
            <p class="mb-4 text-secondary">Začnite pridávať knihy z katalógu</p>
            <Button 
              variant="primary"
              @click="$router.push('/catalog')"
            >
              Prejsť do katalógu
            </Button>
          </div>

          <!-- Žiadne výsledky pre filter -->
          <div v-else-if="filteredBooks.length === 0" class="empty-library text-center py-5">
            <div class="empty-icon mb-3">🔍</div>
            <h2 class="mb-3">Žiadne knihy v tejto kategórii</h2>
            <p class="mb-4 text-secondary">Skúste iný filter</p>
          </div>

          <!-- Zoznam kníh -->
          <div v-else class="books-grid">
            <BookCard 
              v-for="book in filteredBooks" 
              :key="book.id"
              :book="book"
              type="library"
            >
              <!-- Custom slot pre actions -->
              <template #actions>
                <Button 
                  variant="primary"
                  block
                  @click="goToReader(book.id)"
                >
                  {{ book.progress > 0 ? 'Pokračovať v čítaní' : 'Začať čítať' }}
                </Button>
              </template>
            </BookCard>
          </div>

        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useBooksStore } from '@/stores/books'
import BookCard from '@/components/BookCard.vue'
import Button from '@/components/Button.vue'

export default {
  name: 'LibraryPage',
  components: {
    BookCard,
    Button
  },
  data() {
    return {
      activeFilter: 'all'
    }
  },
  computed: {
    ...mapState(useBooksStore, ['libraryBooks']),

    // Unikátne knihy - každá kniha iba raz (aj keď máme viac kópií)
    uniqueLibraryBooks() {
      const uniqueBooks = []
      const seenIds = new Set()
      
      for (const book of this.libraryBooks) {
        if (!seenIds.has(book.id)) {
          seenIds.add(book.id)
          uniqueBooks.push(book)
        }
      }
      
      return uniqueBooks
    },

    totalBooks() {
      return this.uniqueLibraryBooks.length
    },

    completedBooks() {
      return this.uniqueLibraryBooks.filter(book => book.status === 'completed').length
    },

    readingBooks() {
      return this.uniqueLibraryBooks.filter(book => book.status === 'reading').length
    },

    plannedBooks() {
      return this.uniqueLibraryBooks.filter(book => book.status === 'planned').length
    },

    filteredBooks() {
      if (this.activeFilter === 'all') {
        return this.uniqueLibraryBooks
      }
      return this.uniqueLibraryBooks.filter(book => book.status === this.activeFilter)
    }
  },
  methods: {
    goToReader(bookId) {
      this.$router.push({
        name: 'reader',
        params: { bookId }
      })
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

.subtitle {
  color: var(--gray-600);
  font-size: 1.1rem;
}

/* Štatistiky */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background-color: var(--gray-100);
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: var(--gold);
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--brown-medium);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--gray-600);
  font-size: 0.9rem;
}

/* Filter tabs */
.filter-tabs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  border-bottom: 2px solid var(--gray-200);
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.filter-tabs :deep(.app-button) {
  position: relative;
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  color: var(--gray-600);
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -1rem;
  border-radius: 0;
}

.filter-tabs :deep(.app-button:hover) {
  background-color: transparent !important;
  color: var(--brown-medium);
  transform: none;
}

.filter-tabs :deep(.app-button.active) {
  color: var(--brown-medium);
  border-bottom-color: var(--gold);
}

/* Prázdna knižnica */
.empty-library {
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 5rem;
  opacity: 0.5;
}

/* Books grid */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

/* Responzívny dizajn */
@media (max-width: 768px) {
  .filter-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>