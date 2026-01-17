<template>
  <div class="reader-page">
    <!-- Loading -->
    <div v-if="isLoading" class="reader-loading">
      <div class="spinner">📖</div>
      <p>Načítavam knihu...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="reader-error">
      <div class="error-icon">❌</div>
      <h2>{{ error }}</h2>
      <Button variant="primary" @click="$router.push('/library')">
        ← Späť do knižnice
      </Button>
    </div>

    <!-- Reader -->
    <div v-else class="reader-container">
      <!-- Header -->
      <div class="reader-header">
        <Button variant="ghost" @click="$router.push('/library')">
          ← Späť
        </Button>

        <div class="book-title-header">
          <h1>{{ book.title }}</h1>
          <p class="book-author">{{ book.author }}</p>
        </div>

        <div class="reader-controls">
          <Badge variant="info" size="small">{{ currentProgress }}%</Badge>
          <Button variant="ghost" size="small" @click="settingsOpen = true">
            ⚙️
          </Button>
        </div>
      </div>

      <!-- Content -->
      <div 
        class="reader-content" 
        ref="readerContent" 
        @scroll="handleScroll"
        :style="{ backgroundColor: readerSettings.pageBackground }"
      >
        <div 
          class="reader-text"
          :style="{ 
            maxWidth: readerSettings.textWidth + 'px',
            backgroundColor: readerSettings.backgroundColor 
          }"
        >
          <h1 class="book-title-main">{{ book.title }}</h1>
          <p class="book-author-main">{{ book.author }}</p>
          <hr class="divider">
          
          <div 
            class="book-text"
            :style="{
              fontSize: readerSettings.fontSize + 'px',
              fontFamily: readerSettings.fontFamily,
              lineHeight: readerSettings.lineHeight,
              color: readerSettings.textColor
            }"
          >
            {{ bookContent }}
          </div>
        </div>
      </div>

      <!-- Footer with progress -->
      <div class="reader-footer">
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: currentProgress + '%' }"
            ></div>
          </div>
          <span class="progress-text">{{ currentProgress }}% prečítané</span>
        </div>

        <Button 
          variant="primary" 
          size="small"
          @click="settingsOpen = true"
        >
          ⚙️ Nastavenia
        </Button>
      </div>

      <!-- Floating Settings Button (mobile) -->
      <button class="floating-settings-btn" @click="settingsOpen = true">
        ⚙️
      </button>

      <!-- Settings Panel -->
      <SettingsPanel
        :isOpen="settingsOpen"
        v-model:fontSize="readerSettings.fontSize"
        v-model:fontFamily="readerSettings.fontFamily"
        v-model:lineHeight="readerSettings.lineHeight"
        v-model:textWidth="readerSettings.textWidth"
        v-model:backgroundColor="readerSettings.backgroundColor"
        v-model:textColor="readerSettings.textColor"
        @close="settingsOpen = false"
        @reset="resetSettings"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useBooksStore } from '@/stores/books'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'

export default {
  name: 'ReaderPage',
  components: {
    Button,
    Badge,
    SettingsPanel
  },
  data() {
    return {
      book: null,
      bookContent: '',
      isLoading: true,
      error: null,
      currentProgress: 0,
      scrollTimeout: null,
      settingsOpen: false,
      readerSettings: {
        fontSize: 18,
        fontFamily: 'Georgia, serif',
        lineHeight: 1.8,
        textWidth: 800,
        backgroundColor: '#FFFFFF',
        textColor: '#1A1A1A',
        pageBackground: '#F5F1E8'
      },
      defaultSettings: null
    }
  },
  async mounted() {
    // Ulož default settings
    this.defaultSettings = { ...this.readerSettings }
    
    // Načítaj uložené nastavenia
    this.loadSettings()
    
    // Načítaj knihu
    await this.loadBook()
    this.restoreScrollPosition()
  },
  beforeUnmount() {
    this.saveScrollPosition()
    this.saveSettings()
  },
  methods: {
    ...mapActions(useBooksStore, ['loadBookContent', 'updateReadingProgress']),

    async loadBook() {
      this.isLoading = true
      this.error = null

      try {
        const bookId = parseInt(this.$route.params.bookId)
        const bookData = await this.loadBookContent(bookId)

        if (!bookData) {
          this.error = 'Kniha nebola nájdená'
          return
        }

        this.book = bookData
        
        // Ak nie je dostupný obsah zo súboru, použije placeholder
        if (bookData.content) {
          this.bookContent = bookData.content
        } else {
          this.bookContent = this.generatePlaceholderContent()
        }

        // Načítaj uložený progress
        const store = useBooksStore()
        const purchased = store.purchasedBooks.find(p => p.bookId === bookId)
        if (purchased) {
          this.currentProgress = purchased.progress || 0
        }

      } catch (err) {
        console.error('Error loading book:', err)
        this.error = 'Chyba pri načítaní knihy'
      } finally {
        this.isLoading = false
      }
    },

    generatePlaceholderContent() {
      return `
Toto je začiatok knihy "${this.book.title}" od autora ${this.book.author}.

Keďže sobsah knihy narazil na určitú chybu a nie je k dispozícii, tento text slúži ako ukážka čítačky.

Keby to funguje, tak tu máme text z knihy :(

Príjemné čítanie!

`.repeat(50)
    },

    handleScroll() {
      clearTimeout(this.scrollTimeout)
      this.scrollTimeout = setTimeout(() => {
        this.updateProgress()
      }, 200)
    },

    updateProgress() {
      const element = this.$refs.readerContent
      if (!element) return

      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight
      const progress = Math.round((scrollTop / scrollHeight) * 100)

      this.currentProgress = Math.min(progress, 100)

      const bookId = parseInt(this.$route.params.bookId)
      this.updateReadingProgress(bookId, this.currentProgress)
    },

    saveScrollPosition() {
      const element = this.$refs.readerContent
      if (element) {
        const bookId = this.$route.params.bookId
        localStorage.setItem(`scroll_${bookId}`, element.scrollTop.toString())
      }
    },

    restoreScrollPosition() {
      this.$nextTick(() => {
        const element = this.$refs.readerContent
        if (element) {
          const bookId = this.$route.params.bookId
          const savedPosition = localStorage.getItem(`scroll_${bookId}`)
          if (savedPosition) {
            element.scrollTop = parseInt(savedPosition)
          }
        }
      })
    },

    saveSettings() {
      localStorage.setItem('readerSettings', JSON.stringify(this.readerSettings))
    },

    loadSettings() {
      const saved = localStorage.getItem('readerSettings')
      if (saved) {
        try {
          this.readerSettings = { ...this.readerSettings, ...JSON.parse(saved) }
        } catch (err) {
          console.error('Error loading settings:', err)
        }
      }
    },

    resetSettings() {
      this.readerSettings = { ...this.defaultSettings }
      this.saveSettings()
    }
  }
}
</script>

<style scoped>
.reader-page {
  min-height: 100vh;
  transition: background-color 0.3s;
}

.reader-loading,
.reader-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.spinner {
  font-size: 4rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.reader-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.reader-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 2px solid var(--gray-200);
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

.book-title-header {
  flex: 1;
  text-align: center;
  min-width: 0;
}

.book-title-header h1 {
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
  color: var(--brown-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 0.9rem;
  color: var(--gray-600);
  margin: 0;
}

.reader-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reader-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  transition: background-color 0.3s;
}

.reader-text {
  margin: 0 auto;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.book-title-main {
  font-size: 2.5rem;
  font-weight: 700;
  color: inherit;
  margin-bottom: 0.5rem;
  text-align: center;
}

.book-author-main {
  font-size: 1.3rem;
  color: inherit;
  opacity: 0.7;
  text-align: center;
  margin-bottom: 2rem;
}

.divider {
  border: none;
  border-top: 2px solid currentColor;
  opacity: 0.2;
  margin: 2rem 0;
}

.book-text {
  white-space: pre-wrap;
  transition: all 0.3s;
}

.reader-footer {
  padding: 1rem 2rem;
  background-color: white;
  border-top: 2px solid var(--gray-200);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: space-between;
}

.progress-bar-container {
  flex: 1;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--brown-medium));
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: var(--gray-600);
  font-weight: 600;
  display: block;
  text-align: center;
}

/* Floating Settings Button */
.floating-settings-btn {
  position: fixed;
  bottom: 80px;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), #FFA000);
  color: var(--brown-dark);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 50;
  display: none;
}

.floating-settings-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.floating-settings-btn:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .reader-header {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }

  .book-title-header {
    order: 3;
    width: 100%;
  }

  .reader-text {
    padding: 2rem 1.5rem;
  }

  .book-title-main {
    font-size: 1.8rem;
  }

  .reader-footer {
    flex-direction: column;
    gap: 1rem;
  }

  .progress-bar-container {
    width: 100%;
  }

  .floating-settings-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>