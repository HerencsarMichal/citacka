<template>
  <div class="book-card">
    <!-- Emoji/Ikona knihy -->
    <div class="book-icon" :style="{ backgroundColor: book.color }">
      <span class="emoji">{{ book.emoji }}</span>
    </div>
    
    <!-- Informácie o knihe -->
    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      
      <!-- Progress bar ak je kniha reading -->
      <div v-if="book.status === 'reading' && book.progress > 0" class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: book.progress + '%' }"></div>
        </div>
        <span class="progress-text">{{ book.progress }}%</span>
      </div>
      
      <!-- Status badge -->
      <div class="status-badge" :class="book.status">
        <span v-if="book.status === 'reading'">📖 Čítam</span>
        <span v-else-if="book.status === 'completed'">✅ Prečítané</span>
        <span v-else-if="book.status === 'planned'">⏰ Plánujem</span>
      </div>
    </div>
    
    <!-- Slot pre custom akcie (tlačidlá) -->
    <div class="book-actions">
      <slot name="actions">
        <!-- Default tlačidlo ak nie je poskytnutý slot -->
        <Button variant="secondary" block>
          Zobraziť detail
        </Button>
      </slot>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
  name: 'BookCard',
  components: {
    Button
  },
  props: {
    book: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style scoped>
.book-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.book-icon {
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.emoji {
  font-size: 4rem;
}

.book-info {
  flex: 1;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.book-author {
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
}

.progress-section {
  margin: 1rem 0;
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
}

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.status-badge.reading {
  background-color: #E3F2FD;
  color: #1976D2;
}

.status-badge.completed {
  background-color: #E8F5E9;
  color: #388E3C;
}

.status-badge.planned {
  background-color: #FFF3E0;
  color: #F57C00;
}

.book-actions {
  margin-top: auto;
}
</style>