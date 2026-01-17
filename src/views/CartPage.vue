<template>
  <div class="page">
    <div class="container">
      <div class="page-container card shadow rounded-xl">

        <!-- Header -->
        <div class="page-header">
          <div>
            <h1>🛒 Nákupný košík</h1>
            <p class="subtitle">Vaše vybraté knihy</p>
          </div>

          <Badge v-if="cartItemsCount > 0" variant="primary" size="large">
            {{ cartItemsCount }} {{ cartItemsCount === 1 ? 'položka' : 'položiek' }}
          </Badge>
        </div>

        <!-- Obsah -->
        <div class="page-content">

          <!-- Prázdny košík -->
          <div v-if="cartItems.length === 0" class="empty-cart text-center py-5">
            <div class="empty-icon mb-3">🛒</div>
            <h2 class="mb-3">Váš košík je prázdny</h2>
            <p class="mb-4 text-secondary">Pridajte si knihy z katalógu</p>
            <Button variant="primary" @click="$router.push('/catalog')">
              📚 Prejsť do katalógu
            </Button>
          </div>

          <!-- Košík s položkami -->
          <div v-else>
            <!-- Zoznam položiek -->
            <div class="cart-items-list">
              <CartItem v-for="item in cartItems" :key="item.bookId" :book="getBookById(item.bookId)"
                :quantity="item.quantity" @update-quantity="updateQuantity(item.bookId, $event)"
                @remove="removeItem(item.bookId)" />
            </div>

            <!-- Sumár -->
            <div class="cart-summary">
              <h3 class="summary-title">Súhrn objednávky</h3>

              <div class="summary-row">
                <span>Medzisúčet ({{ cartItemsCount }} ks):</span>
                <span class="summary-value">{{ subtotal.toFixed(2) }} €</span>
              </div>

              <div class="summary-row">
                <span>Poštovné:</span>
                <span class="summary-value">{{ shipping.toFixed(2) }} €</span>
              </div>

              <div class="summary-row">
                <span>DPH (20%):</span>
                <span class="summary-value">{{ vat.toFixed(2) }} €</span>
              </div>

              <div class="summary-row total">
                <span class="total-label">Celkom:</span>
                <span class="total-value">{{ total.toFixed(2) }} €</span>
              </div>

              <div class="summary-note">
                📦 Objednávka zahŕňa digitálnu aj fyzickú kópiu každej knihy
              </div>
            </div>

            <!-- Tlačidlá -->
            <div class="cart-actions">
              <Button variant="ghost" @click="handleClearCart">
                🗑️ Vyprázdniť košík
              </Button>

              <Button variant="primary" size="large" @click="handleCheckout">
                ✅ Dokončiť objednávku ({{ total.toFixed(2) }} €)
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'pinia'
import { useBooksStore } from '@/stores/books'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import CartItem from '@/components/CartItem.vue'

export default {
  name: 'CartPage',
  components: {
    Button,
    Badge,
    CartItem
  },
  computed: {
    ...mapState(useBooksStore, ['cart', 'allBooks']),
    ...mapGetters(useBooksStore, ['cartItemsCount', 'cartTotal']),

    cartItems() {
      return this.cart
    },

    subtotal() {
      return this.cartTotal
    },

    shipping() {
      // Poštovné 3.99€ alebo zadarmo nad 50€
      return this.subtotal >= 50 ? 0 : 3.99
    },

    vat() {
      return (this.subtotal + this.shipping) * 0.20
    },

    total() {
      return this.subtotal + this.shipping + this.vat
    }
  },
  methods: {
    ...mapActions(useBooksStore, ['removeFromCart', 'clearCart', 'updateCartQuantity', 'checkout']),

    getBookById(bookId) {
      return this.allBooks.find(book => book.id === bookId) || {}
    },

    updateQuantity(bookId, newQuantity) {
      const result = this.updateCartQuantity(bookId, newQuantity)
      if (!result.success && result.message) {
        alert('❌ ' + result.message)
      }
    },

    removeItem(bookId) {
      if (confirm('Naozaj chcete odstrániť túto knihu z košíka?')) {
        this.removeFromCart(bookId)
      }
    },

    handleClearCart() {
      if (confirm('Naozaj chcete vyprázdniť celý košík?')) {
        this.clearCart()
      }
    },

    async handleCheckout() {
      if (confirm(`Potvrdiť objednávku za ${this.total.toFixed(2)} €?`)) {
        const result = await this.checkout()

        if (result.success) {
          alert('✅ Objednávka úspešne dokončená!\n\nKnihy boli pridané do vašej knižnice.')
          this.$router.push('/library')
        } else {
          alert('❌ ' + result.message)
        }
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

/* Prázdny košík */
.empty-cart {
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 5rem;
  opacity: 0.5;
}

/* Cart items list */
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* Sumár */
.cart-summary {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid var(--gray-200);
  margin-bottom: 2rem;
}

.summary-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--gray-300);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: 1rem;
  color: var(--gray-700);
}

.summary-value {
  font-weight: 600;
  color: var(--brown-dark);
}

.summary-row.total {
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 3px solid var(--brown-medium);
  font-size: 1.3rem;
  font-weight: 700;
}

.total-label {
  color: var(--brown-dark);
}

.total-value {
  color: var(--brown-medium);
  font-size: 1.8rem;
}

.summary-note {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--gray-600);
  border-left: 4px solid var(--gold);
}

/* Cart actions */
.cart-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

/* Responzívny dizajn */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cart-actions {
    flex-direction: column;
    width: 100%;
  }

  .cart-actions>* {
    width: 100%;
  }
}
</style>