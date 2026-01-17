<template>
  <div class="contact-page">
    <div class="container">
      <div class="contact-container card shadow rounded-xl">
        <!-- Hlavička -->
        <div class="contact-header text-center mb-4">
          <h1>📞 Kontakt</h1>
          <p class="subtitle">Napíšte nám správu</p>
        </div>

        <!-- Kontaktný formulár -->
        <div class="contact-form mb-4">
          <div class="form-group">
            <label class="form-label" for="name">Celé meno *</label>
            <input type="text" id="name" class="form-control" v-model="formData.name" placeholder="Zadajte vaše meno"
              required>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Emailová adresa *</label>
            <input type="email" id="email" class="form-control" v-model="formData.email" placeholder="Zadajte váš email"
              required>
          </div>

          <div class="form-group">
            <label class="form-label" for="subject">Predmet *</label>
            <input type="text" id="subject" class="form-control" v-model="formData.subject" placeholder="O čo sa jedná?"
              required>
          </div>

          <div class="form-group">
            <label class="form-label" for="message">Správa *</label>
            <textarea id="message" class="form-control" rows="5" v-model="formData.message"
              placeholder="Napíšte nám správu..." required>
            </textarea>
          </div>

          <!-- Tlačidlá -->
          <div class="d-flex gap-3 flex-wrap mt-4">
            <AppButton variant="primary" :disabled="!isFormValid" @click="submitForm" icon-left="📤">
              Odoslať správu
            </AppButton>

            <AppButton variant="secondary" @click="resetForm" icon-left="🧹">
              Vymazať formulár
            </AppButton>
          </div>


          <!-- Správa po odoslaní -->
          <div v-if="showSuccessMessage" class="alert alert-success mt-3">
            ✅ <strong>Správa odoslaná!</strong> Ďakujem za vašu správu. Ozvem sa vám čoskoro.
          </div>

          <!-- Chybová správa -->
          <div v-if="showErrorMessage" class="alert alert-danger mt-3">
            ❌ <strong>Chyba:</strong> {{ errorMessage }}
          </div>
        </div>

        <!-- Kontaktné informácie -->
        <div class="contact-info mt-4">
          <h2 class="text-center mb-4">📫 Kontaktné informácie</h2>

          <div class="row mb-4">
            <div class="col">
              <div class="info-item d-flex gap-3 p-3 rounded bg-gray-100">
                <div class="info-icon" style="font-size: 2rem;">📍</div>
                <div class="info-content">
                  <h4 class="mb-1">Adresa</h4>
                  <p class="mb-0">Knižná ulica 123<br>Čitateľská štvrť<br>811 01 Bratislava</p>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="info-item d-flex gap-3 p-3 rounded bg-gray-100">
                <div class="info-icon" style="font-size: 2rem;">📧</div>
                <div class="info-content">
                  <h4 class="mb-1">Email</h4>
                  <p class="mb-0">info@citackaknih.sk<br>podpora@citackaknih.sk<br>info@bookreader.sk</p>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="info-item d-flex gap-3 p-3 rounded bg-gray-100">
                <div class="info-icon" style="font-size: 2rem;">📞</div>
                <div class="info-content">
                  <h4 class="mb-1">Telefón</h4>
                  <p class="mb-0">+421 123 456 789<br>Pondelok - Piatok<br>8:00 - 16:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from '@/components/Button.vue'

export default {
  name: 'ContactPage',
  components: {
    AppButton
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: ''
    }
  },
  computed: {
    isFormValid() {
      return (
        this.formData.name.trim() !== '' &&
        this.formData.email.trim() !== '' &&
        this.formData.subject.trim() !== '' &&
        this.formData.message.trim() !== ''
      )
    }
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
    submitForm() {
      if (!this.isFormValid) {
        this.showErrorMessage = true
        this.errorMessage = 'Prosím vyplňte všetky povinné polia.'
        setTimeout(() => (this.showErrorMessage = false), 5000)
        return
      }

      if (!this.validateEmail(this.formData.email)) {
        this.showErrorMessage = true
        this.errorMessage = 'Zadajte platnú emailovú adresu.'
        setTimeout(() => (this.showErrorMessage = false), 5000)
        return
      }

      this.showSuccessMessage = true
      this.showErrorMessage = false
      console.log('Formulár odoslaný:', this.formData)

      setTimeout(() => {
        this.resetForm()
        this.showSuccessMessage = false
      }, 5000)
    },
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
      this.showSuccessMessage = false
      this.showErrorMessage = false
    }
  }
}
</script>


<style scoped>
.contact-page {
  padding-top: 80px;
  padding-bottom: 40px;
  min-height: 100vh;
}

.contact-container {
  background-color: white;
  padding: 2.5rem;
}

.subtitle {
  color: var(--gray-600);
  font-size: 1.1rem;
}

.bg-gray-100 {
  background-color: var(--gray-100);
}
</style>