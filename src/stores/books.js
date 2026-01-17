// src/stores/books.js
import { defineStore } from 'pinia'

export const useBooksStore = defineStore('books', {
  state: () => ({
    // Všetky knihy v katalógu
    allBooks: [],
    
    // Nákupný košík
    cart: [],
    
    // Zakúpené knihy (v knižnici)
    purchasedBooks: [],
    
    // Loading state
    isLoading: false
  }),

  getters: {
    // Celkový počet položiek v košíku
    cartItemsCount(state) {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },

    // Celková cena košíka
    cartTotal(state) {
      return state.cart.reduce((total, item) => {
        const book = state.allBooks.find(b => b.id === item.bookId)
        return total + (book ? book.price * item.quantity : 0)
      }, 0)
    },

    // Knihy dostupné na kúpu (nie vypredané)
    availableBooks(state) {
      return state.allBooks.filter(book => book.stock > 0)
    },

    // Knihy v knižnici (zakúpené)
    libraryBooks(state) {
      return state.purchasedBooks.map(purchased => {
        const book = state.allBooks.find(b => b.id === purchased.bookId)
        return {
          ...book,
          ...purchased
        }
      })
    },

    // Kontrola či je kniha v košíku
    isInCart: (state) => (bookId) => {
      return state.cart.some(item => item.bookId === bookId)
    },

    // Kontrola či je kniha zakúpená
    isPurchased: (state) => (bookId) => {
      return state.purchasedBooks.some(item => item.bookId === bookId)
    }
  },

  actions: {
    // Inicializácia - načítanie kníh
    async initializeBooks() {
      this.isLoading = true
      
      // Generovanie metadát pre 100 kníh
      const bookMetadata = this.generateBookMetadata()
      
      // Simulácia načítania (v reálnej app by ste načítali zo servera)
      this.allBooks = bookMetadata.map(meta => ({
        ...meta,
        stock: Math.floor(Math.random() * 20) + 5, // 5-25 kusov na sklade
        price: Math.floor(Math.random() * 20) + 10, // 10-30 EUR
        rating: (Math.random() * 2 + 3).toFixed(1) // 3.0-5.0
      }))

      this.isLoading = false
    },

    // Generovanie metadát pre knihy
    generateBookMetadata() {
      const authors = [
        'J.K. Rowling', 'J.R.R. Tolkien', 'George Orwell', 'Paulo Coelho',
        'Antoine de Saint-Exupéry', 'F. Scott Fitzgerald', 'Jane Austen',
        'Ernest Hemingway', 'Gabriel García Márquez', 'Harper Lee'
      ]
      
      const genres = ['Fantasy', 'Sci-Fi', 'Klasika', 'Romantika', 'Thriller', 'Dobrodružstvo']
      const emojis = ['📚', '📖', '📕', '📗', '📘', '📙', '⚡', '💍', '👁️', '🧪', '👑', '🌟']
      const colors = ['#FFD700', '#8B4513', '#2C3E50', '#E67E22', '#3498DB', '#9B59B6', '#E74C3C', '#27AE60']

      const metadata = []
      for (let i = 1; i <= 100; i++) {
        metadata.push({
          id: i,
          filename: `Book${i}.txt`,
          title: `Kniha ${i}`,
          author: authors[Math.floor(Math.random() * authors.length)],
          genre: genres[Math.floor(Math.random() * genres.length)],
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          description: `Fascinujúci príbeh, ktorý vás pohltí od prvej do poslednej strany. Táto kniha sa stala bestsellerom a získala množstvo ocenení.`,
          pages: Math.floor(Math.random() * 400) + 100
        })
      }
      return metadata
    },

    // Pridať knihu do košíka
    addToCart(bookId, quantity = 1) {
      const book = this.allBooks.find(b => b.id === bookId)
      
      if (!book) {
        return { success: false, message: 'Kniha nebola nájdená' }
      }

      if (book.stock < quantity) {
        return { success: false, message: 'Nedostatok kusov na sklade' }
      }

      const existingItem = this.cart.find(item => item.bookId === bookId)
      
      if (existingItem) {
        if (book.stock < existingItem.quantity + quantity) {
          return { success: false, message: 'Nedostatok kusov na sklade' }
        }
        existingItem.quantity += quantity
      } else {
        this.cart.push({
          bookId,
          quantity,
          addedAt: new Date().toISOString()
        })
      }

      return { success: true, message: 'Pridané do košíka' }
    },

    // Odstrániť z košíka
    removeFromCart(bookId) {
      const index = this.cart.findIndex(item => item.bookId === bookId)
      if (index !== -1) {
        this.cart.splice(index, 1)
      }
    },

    // Aktualizovať množstvo v košíku
    updateCartQuantity(bookId, quantity) {
      const item = this.cart.find(item => item.bookId === bookId)
      const book = this.allBooks.find(b => b.id === bookId)

      if (!item || !book) return { success: false }

      if (quantity <= 0) {
        this.removeFromCart(bookId)
        return { success: true }
      }

      if (quantity > book.stock) {
        return { success: false, message: 'Nedostatok kusov na sklade' }
      }

      item.quantity = quantity
      return { success: true }
    },

    // Vyprázdniť košík
    clearCart() {
      this.cart = []
    },

    // Dokončiť objednávku
    async checkout() {
      if (this.cart.length === 0) {
        return { success: false, message: 'Košík je prázdny' }
      }

      // Kontrola dostupnosti
      for (const item of this.cart) {
        const book = this.allBooks.find(b => b.id === item.bookId)
        if (!book || book.stock < item.quantity) {
          return { 
            success: false, 
            message: `Nedostatok kusov: ${book?.title || 'neznáma kniha'}` 
          }
        }
      }

      // Znížiť sklad a pridať do knižnice
      for (const item of this.cart) {
        const book = this.allBooks.find(b => b.id === item.bookId)
        book.stock -= item.quantity

        // Pridať do zakúpených (každý kus osobitne)
        for (let i = 0; i < item.quantity; i++) {
          this.purchasedBooks.push({
            bookId: item.bookId,
            purchasedAt: new Date().toISOString(),
            status: 'planned',
            progress: 0
          })
        }
      }

      const orderSummary = {
        items: [...this.cart],
        total: this.cartTotal,
        date: new Date().toISOString()
      }

      this.clearCart()

      return { 
        success: true, 
        message: 'Objednávka úspešne dokončená',
        order: orderSummary
      }
    },

    // Aktualizovať progress čítania
    updateReadingProgress(bookId, progress) {
      const purchased = this.purchasedBooks.find(p => p.bookId === bookId)
      if (purchased) {
        purchased.progress = progress
        
        if (progress === 100) {
          purchased.status = 'completed'
        } else if (progress > 0) {
          purchased.status = 'reading'
        }
      }
    },

    // Načítať obsah knihy
    async loadBookContent(bookId) {
      try {
        const book = this.allBooks.find(b => b.id === bookId)
        if (!book) return null

        // Skús viaceré cesty
        const possiblePaths = [
          `/books/${book.filename}`,  // Pre produkciu s base path
          `${import.meta.env.BASE_URL}books/${book.filename}`, // S explicit base
          `./books/${book.filename}`, // Relatívna cesta
        ]

        let content = null
        let successPath = null

        for (const path of possiblePaths) {
          try {
            console.log(`🔍 Skúšam načítať: ${path}`)
            const response = await fetch(path)
            
            if (response.ok) {
              content = await response.text()
              successPath = path
              console.log(`✅ Úspech! Kniha načítaná z: ${path}`)
              break
            }
          } catch (e) {
            console.log(`❌ Cesta ${path} zlyhala:`, e.message)
            continue
          }
        }

        if (!content) {
          console.warn(`⚠️ Kniha ${book.filename} sa nenašla na žiadnej ceste, použije sa placeholder`)
          return {
            ...book,
            content: null
          }
        }
        
        return {
          ...book,
          content
        }
      } catch (error) {
        console.error('Chyba pri načítaní knihy:', error)
        return null
      }
    }
  }
})