<template>
  <div class="page">
    <div class="container">
      <div class="page-container card shadow rounded-xl">

        <!-- Header -->
        <div class="page-header text-center mb-4">
          <h1>📚 O BookReader</h1>
          <p class="subtitle">Vaša digitálna knižnica pre pohodlné čítanie</p>
        </div>

        <!-- Obsah -->
        <div class="page-content">
          <!-- O aplikácii -->
          <section class="mb-5">
            <h2 class="mb-3">Čo je BookReader?</h2>
            <p>
              BookReader je moderná webová aplikácia navrhnutá pre milovníkov kníh.
              Umožňuje vám čítať knihy online s možnosťou prispôsobenia čítacieho prostredia
              presne podľa vašich potrieb - od veľkosti písma až po farby pozadia.
            </p>
            <p>
              Naša platforma kombinuje jednoduchosť e-shopu s pokročilými funkciami čítačky,
              čo vám umožňuje nielen získať nové knihy, ale aj si ich užiť v optimálnom prostredí.
            </p>
          </section>

          <!-- Funkcie -->
          <section class="mb-5">
            <h2 class="mb-3">Hlavné funkcie</h2>
            <div class="features-grid">
              <div class="feature-box">
                <div class="feature-icon">📖</div>
                <h3>Personalizovaná čítačka</h3>
                <p>Prispôsobte si veľkosť písma, font, riadkovanie a farby presne podľa seba.</p>
              </div>

              <div class="feature-box">
                <div class="feature-icon">🔖</div>
                <h3>Záložky a poznámky</h3>
                <p>Ukladajte si obľúbené miesta v knihe a pridávajte vlastné poznámky.</p>
              </div>

              <div class="feature-box">
                <div class="feature-icon">📊</div>
                <h3>Sledovanie pokroku</h3>
                <p>Pozrite si štatistiky čítania a históriu prečítaných kníh.</p>
              </div>

              <div class="feature-box">
                <div class="feature-icon">🌙</div>
                <h3>Nočný režim</h3>
                <p>Pohodlné čítanie aj v tme s tmavým režimom a sépiovou témou.</p>
              </div>

              <div class="feature-box">
                <div class="feature-icon">💾</div>
                <h3>Automatické ukladanie</h3>
                <p>Vaša pozícia v knihe sa ukladá automaticky - pokračujte kedykoľvek.</p>
              </div>

              <div class="feature-box">
                <div class="feature-icon">📱</div>
                <h3>Responzívny dizajn</h3>
                <p>Čítajte pohodlne na počítači, tablete alebo mobile.</p>
              </div>
            </div>
          </section>

          <!-- Kontakt CTA -->
          <section class="text-center mt-5 pt-4" style="border-top: 2px solid var(--gray-200);">
            <h3 class="mb-3">Máte otázky?</h3>
            <p class="mb-4">Radi vám pomôžeme s čímkoľvek ohľadom aplikácie.</p>
            <router-link to="/contact" class="btn btn-primary">
              Kontaktujte nás
            </router-link>
          </section>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
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

/* Features grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-box {
  padding: 1.5rem;
  background-color: var(--gray-100);
  border-radius: 0.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.feature-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--gold);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-box h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--brown-medium);
}

.feature-box p {
  font-size: 0.95rem;
  margin: 0;
  color: var(--gray-600);
}
</style>