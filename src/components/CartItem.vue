<template>
  <div class="cart-item">
    <div class="item-image" :style="{ backgroundColor: book.color }">
      <span class="emoji">{{ book.emoji }}</span>
    </div>
    
    <div class="item-details">
      <h3 class="item-title">{{ book.title }}</h3>
      <p class="item-author">{{ book.author }}</p>
      <Badge variant="info" size="small">{{ book.genre }}</Badge>
    </div>
    
    <div class="item-quantity">
      <button 
        class="qty-btn" 
        @click="decreaseQuantity"
        :disabled="quantity <= 1"
      >
        −
      </button>
      <span class="qty-value">{{ quantity }}</span>
      <button 
        class="qty-btn" 
        @click="increaseQuantity"
        :disabled="quantity >= book.stock"
      >
        +
      </button>
    </div>
    
    <div class="item-price">
      <div class="unit-price">{{ book.price }}€ / ks</div>
      <div class="total-price">{{ totalPrice }}€</div>
    </div>
    
    <div class="item-actions">
      <Button 
        variant="danger" 
        size="small"
        @click="$emit('remove')"
      >
        🗑️ Odstrániť
      </Button>
    </div>
  </div>
</template>

<script>
import Button from './Button.vue'
import Badge from './Badge.vue'

export default {
  name: 'CartItem',
  components: {
    Button,
    Badge
  },
  props: {
    book: {
      type: Object,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  },
  computed: {
    totalPrice() {
      return (this.book.price * this.quantity).toFixed(2)
    }
  },
  methods: {
    increaseQuantity() {
      if (this.quantity < this.book.stock) {
        this.$emit('update-quantity', this.quantity + 1)
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.$emit('update-quantity', this.quantity - 1)
      }
    }
  },
  emits: ['update-quantity', 'remove']
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background-color: white;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.cart-item:hover {
  border-color: var(--gold);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  flex-shrink: 0;
  width: 80px;
  height: 100px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji {
  font-size: 2.5rem;
}

.item-details {
  flex-grow: 1;
  min-width: 0;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-author {
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 2px solid var(--gray-300);
  background-color: white;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  border-color: var(--gold);
  background-color: var(--gold);
  color: white;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  min-width: 40px;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--brown-dark);
}

.item-price {
  flex-shrink: 0;
  text-align: right;
}

.unit-price {
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
}

.total-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--brown-medium);
}

.item-actions {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .cart-item {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .item-details {
    width: 100%;
    order: 1;
  }
  
  .item-quantity {
    order: 3;
  }
  
  .item-price {
    order: 2;
    margin-left: auto;
  }
  
  .item-actions {
    width: 100%;
    order: 4;
  }
}
</style>