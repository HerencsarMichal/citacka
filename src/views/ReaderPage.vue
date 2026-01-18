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
        <Button variant="ghost" size="small" @click="$router.push('/library')">
          ← Späť
        </Button>

        <div class="book-title-header">
          <div class="book-emoji" :style="{ backgroundColor: book.color }">
            {{ book.emoji }}
          </div>
          <div class="book-info-header">
            <h1>{{ book.title }}</h1>
            <p class="book-author">{{ book.author }}</p>
          </div>
        </div>

        <div class="reader-controls">
          <Badge variant="primary" size="small">{{ currentProgress }}%</Badge>
          <Button variant="primary" size="small" @click="settingsOpen = true">
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
        
        // Ak je dostupný obsah zo súboru, použi ho
        if (bookData.content && bookData.content.trim().length > 0) {
          this.bookContent = bookData.content
          console.log('✅ Kniha načítaná úspešne:', bookData.filename, bookData.content.length, 'znakov')
        } else {
          // Použiť placeholder len ak obsah neexistuje
          console.warn('⚠️ Obsah knihy nie je dostupný, používam placeholder')
          this.bookContent = this.generatePlaceholderContent()
        }

        // Načítaj uložený progress
        const store = useBooksStore()
        const purchased = store.purchasedBooks.find(p => p.bookId === bookId)
        if (purchased) {
          this.currentProgress = purchased.progress || 0
        }

      } catch (err) {
        console.error('❌ Error loading book:', err)
        this.error = 'Chyba pri načítaní knihy'
      } finally {
        this.isLoading = false
      }
    },

    generatePlaceholderContent() {
      return `
Toto je začiatok knihy "${this.book.title}" od autora ${this.book.author}.

Keďže skutočný obsah knihy nie je k dispozícii, tento text slúži ako ukážka čítačky.

V reálnej aplikácii by tu bol celý text knihy načítaný zo súboru /src/books/${this.book.filename}.

Skúste scrollovať nadol, aby ste videli ako funguje sledovanie progressu čítania.

Môžete si tiež upraviť nastavenia čítania - kliknite na tlačidlo "⚙️ Nastavenia" v pravom hornom rohu.

Nastavenia zahŕňajú:
- Veľkosť písma
- Typ písma (font)
- Riadkovanie
- Šírku textu
- Farbu pozadia
- Farbu textu

Všetky nastavenia sa automaticky ukladajú a budú zachované pri ďalšom otvorení čítačky.

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
    },

    restoreScrollPosition() {
      this.$nextTick(() => {
        const element = this.$refs.readerContent
        if (element && this.currentProgress > 0) {
          // Počkaj kým sa načíta obsah a potom obnov pozíciu podľa progress
          setTimeout(() => {
            const scrollHeight = element.scrollHeight - element.clientHeight
            const scrollPosition = (this.currentProgress / 100) * scrollHeight
            element.scrollTop = scrollPosition
            console.log(`📖 Obnovená pozícia: ${this.currentProgress}% (${scrollPosition}px)`)
          }, 500)
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
  padding-top: 70px; /* Výška navbar */
  min-height: 100vh;
  transition: background-color 0.3s;
  background-color: #f5f1e8;
}

.reader-loading,
.reader-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
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
  height: calc(100vh - 70px); /* Plná výška mínus navbar */
}

.reader-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 3px solid var(--gold);
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.book-title-header {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 0;
}

.book-emoji {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s;
}

.book-emoji:hover {
  transform: scale(1.05);
}

.book-info-header {
  flex: 1;
  min-width: 0;
}

.book-info-header h1 {
  font-size: 1.4rem;
  margin-bottom: 0.25rem;
  color: var(--brown-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}

.book-author {
  font-size: 0.9rem;
  color: var(--gold);
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
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.3s;
  border: 2px solid rgba(0, 0, 0, 0.05);
}

.reader-text:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.book-title-main {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 0.5rem;
  text-align: center;
  line-height: 1.2;
}

.book-author-main {
  font-size: 1.4rem;
  color: var(--gold);
  opacity: 0.7;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 500;
}

.divider {
  border: none;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%);
  opacity: 0.2;
  margin: 2.5rem 0;
  border-radius: 2px;
}

.book-text {
  white-space: pre-wrap;
  transition: all 0.3s;
}

.reader-footer {
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-top: 3px solid var(--gold);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: space-between;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.progress-bar-container {
  flex: 1;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 100%);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold) 0%, #FFA000 50%, var(--brown-medium) 100%);
  transition: width 0.3s ease;
  box-shadow: 0 0 8px rgba(255, 179, 0, 0.5);
  border-radius: 8px;
}

.progress-text {
  font-size: 0.9rem;
  color: var(--brown-medium);
  font-weight: 700;
  display: block;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Floating Settings Button */
.floating-settings-btn {
  position: fixed;
  bottom: 100px;
  right: 2rem;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold) 0%, #FFA000 100%);
  color: var(--brown-dark);
  border: 3px solid white;
  font-size: 1.8rem;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(255, 179, 0, 0.4);
  transition: all 0.3s ease;
  z-index: 50;
  display: none;
  animation: pulse-float 2s ease-in-out infinite;
}

@keyframes pulse-float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-5px) scale(1.05);
  }
}

.floating-settings-btn:hover {
  transform: scale(1.15) translateY(-5px);
  box-shadow: 0 12px 32px rgba(255, 179, 0, 0.6);
  animation: none;
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