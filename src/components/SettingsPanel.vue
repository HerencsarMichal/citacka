<template>
  <div class="settings-panel" :class="{ open: isOpen }">
    <div class="settings-overlay" @click="$emit('close')"></div>
    
    <div class="settings-content">
      <div class="settings-header">
        <h2>⚙️ Nastavenia čítania</h2>
        <Button variant="ghost" size="small" @click="$emit('close')">
          ✕
        </Button>
      </div>

      <div class="settings-body">
        
        <!-- Veľkosť písma -->
        <div class="setting-group">
          <label class="setting-label">
            <span class="label-icon">🔤</span>
            Veľkosť písma
          </label>
          <div class="font-size-controls">
            <Button 
              variant="ghost" 
              size="small"
              @click="decreaseFontSize"
              :disabled="fontSize <= 14"
            >
              A-
            </Button>
            <span class="font-size-value">{{ fontSize }}px</span>
            <Button 
              variant="ghost" 
              size="small"
              @click="increaseFontSize"
              :disabled="fontSize >= 28"
            >
              A+
            </Button>
          </div>
        </div>

        <!-- Font rodina -->
        <div class="setting-group">
          <label class="setting-label">
            <span class="label-icon">✍️</span>
            Typ písma
          </label>
          <div class="font-family-grid">
            <button
              v-for="font in fontFamilies"
              :key="font.value"
              class="font-option"
              :class="{ active: fontFamily === font.value }"
              @click="$emit('update:fontFamily', font.value)"
            >
              <span :style="{ fontFamily: font.value }">{{ font.name }}</span>
            </button>
          </div>
        </div>

        <!-- Riadkovanie -->
        <div class="setting-group">
          <label class="setting-label">
            <span class="label-icon">📏</span>
            Riadkovanie
          </label>
          <div class="line-height-controls">
            <button
              v-for="lh in lineHeights"
              :key="lh.value"
              class="line-height-option"
              :class="{ active: lineHeight === lh.value }"
              @click="$emit('update:lineHeight', lh.value)"
            >
              {{ lh.label }}
            </button>
          </div>
        </div>

        <!-- Šírka textu -->
        <div class="setting-group">
          <label class="setting-label">
            <span class="label-icon">↔️</span>
            Šírka textu
          </label>
          <div class="width-controls">
            <button
              v-for="w in textWidths"
              :key="w.value"
              class="width-option"
              :class="{ active: textWidth === w.value }"
              @click="$emit('update:textWidth', w.value)"
            >
              {{ w.label }}
            </button>
          </div>
        </div>

        <!-- Farba pozadia -->
        <div class="setting-group">
          <label class="setting-label">
            <span class="label-icon">🎨</span>
            Pozadie
          </label>
          <div class="color-grid">
            <button
              v-for="bg in backgrounds"
              :key="bg.value"
              class="color-option"
              :class="{ active: backgroundColor === bg.value }"
              :style="{ backgroundColor: bg.value }"
              @click="$emit('update:backgroundColor', bg.value)"
            >
              <span v-if="backgroundColor === bg.value" class="check-mark">✓</span>
            </button>
          </div>
        </div>

        <!-- Farba textu -->
        <div class="setting-group">
          <label class="setting-label">
            <span class="label-icon">🖊️</span>
            Farba textu
          </label>
          <div class="color-grid">
            <button
              v-for="color in textColors"
              :key="color.value"
              class="color-option"
              :class="{ active: textColor === color.value }"
              :style="{ backgroundColor: color.value }"
              @click="$emit('update:textColor', color.value)"
            >
              <span v-if="textColor === color.value" class="check-mark">✓</span>
            </button>
          </div>
        </div>

        <!-- Reset button -->
        <div class="setting-group">
          <Button variant="secondary" block @click="$emit('reset')">
            🔄 Obnoviť predvolené
          </Button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button.vue'

export default {
  name: 'SettingsPanel',
  components: {
    Button
  },
  props: {
    isOpen: Boolean,
    fontSize: Number,
    fontFamily: String,
    lineHeight: Number,
    textWidth: Number,
    backgroundColor: String,
    textColor: String
  },
  data() {
    return {
      fontFamilies: [
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Times', value: '"Times New Roman", serif' },
        { name: 'Merriweather', value: 'Merriweather, serif' },
        { name: 'Arial', value: 'Arial, sans-serif' },
        { name: 'Verdana', value: 'Verdana, sans-serif' },
        { name: 'Courier', value: '"Courier New", monospace' }
      ],
      lineHeights: [
        { label: 'Úzke', value: 1.4 },
        { label: 'Normálne', value: 1.6 },
        { label: 'Voľné', value: 1.8 },
        { label: 'Veľmi voľné', value: 2.0 }
      ],
      textWidths: [
        { label: 'Úzke', value: 600 },
        { label: 'Normálne', value: 800 },
        { label: 'Široké', value: 1000 },
        { label: 'Maximálne', value: 1200 }
      ],
      backgrounds: [
        { value: '#FFFFFF' },  // Biela
        { value: '#F5F1E8' },  // Krémová
        { value: '#FFF9E6' },  // Svetlo žltá
        { value: '#E8F4F8' },  // Svetlo modrá
        { value: '#2C2C2C' },  // Tmavo šedá
        { value: '#1A1A1A' },  // Čierna
      ],
      textColors: [
        { value: '#1A1A1A' },  // Čierna
        { value: '#333333' },  // Tmavo šedá
        { value: '#4A4A4A' },  // Šedá
        { value: '#D4D4D4' },  // Svetlo šedá (pre dark mode)
        { value: '#E0E0E0' },  // Biela šedá (pre dark mode)
        { value: '#FFFFFF' },  // Biela (pre dark mode)
      ]
    }
  },
  methods: {
    increaseFontSize() {
      if (this.fontSize < 28) {
        this.$emit('update:fontSize', this.fontSize + 1)
      }
    },
    decreaseFontSize() {
      if (this.fontSize > 14) {
        this.$emit('update:fontSize', this.fontSize - 1)
      }
    }
  },
  emits: ['close', 'update:fontSize', 'update:fontFamily', 'update:lineHeight', 
          'update:textWidth', 'update:backgroundColor', 'update:textColor', 'reset']
}
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  pointer-events: none;
}

.settings-panel.open {
  pointer-events: auto;
}

.settings-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.settings-panel.open .settings-overlay {
  opacity: 1;
}

.settings-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 90vw;
  background-color: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.settings-panel.open .settings-content {
  transform: translateX(0);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid var(--gray-200);
}

.settings-header h2 {
  font-size: 1.3rem;
  color: var(--brown-dark);
  margin: 0;
}

.settings-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--brown-dark);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.label-icon {
  font-size: 1.2rem;
}

/* Font size controls */
.font-size-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.font-size-value {
  min-width: 60px;
  text-align: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--brown-medium);
}

/* Font family grid */
.font-family-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.font-option {
  padding: 0.75rem;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.font-option:hover {
  border-color: var(--gold);
}

.font-option.active {
  border-color: var(--gold);
  background-color: #FFF9E6;
}

/* Line height controls */
.line-height-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.line-height-option {
  padding: 0.75rem;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: 600;
}

.line-height-option:hover {
  border-color: var(--gold);
}

.line-height-option.active {
  border-color: var(--gold);
  background-color: #FFF9E6;
  color: var(--brown-dark);
}

/* Width controls */
.width-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.width-option {
  padding: 0.75rem;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: 600;
}

.width-option:hover {
  border-color: var(--gold);
}

.width-option.active {
  border-color: var(--gold);
  background-color: #FFF9E6;
  color: var(--brown-dark);
}

/* Color grid */
.color-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
}

.color-option {
  width: 100%;
  aspect-ratio: 1;
  border: 3px solid var(--gray-300);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-option:hover {
  transform: scale(1.1);
  border-color: var(--gold);
}

.color-option.active {
  border-color: var(--gold);
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--gold);
}

.check-mark {
  font-size: 1.5rem;
  color: var(--gold);
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .settings-content {
    width: 100%;
    max-width: 100%;
  }

  .font-family-grid,
  .line-height-controls,
  .width-controls {
    grid-template-columns: 1fr;
  }
}
</style>