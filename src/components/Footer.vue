<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-brand">
                <h3>📚 BookReader</h3>
                <p>Vaša digitálna knižnica pre pohodlné čítanie kníh online.</p>
            </div>
            
            <div class="footer-links">
                <div class="footer-section">
                    <h4>Podpora</h4>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Nápoveda</a></li>
                        <li><a href="#">Podmienky používania</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Kontakt</h4>
                    <ul>
                        <li>📧 info@bookreader.sk</li>
                        <li>📞 +421 123 456 789</li>
                    </ul>
                </div>
            </div>

            <div class="footer-copyright">
                <p>© 2077 BookReader</p>
                <p>Všetky práva vyhradené</p>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style scoped>
.footer {
    background-color: var(--brown-dark);
    color: white;
    padding: 1.5rem 0;
    width: 100%;
    margin: 0;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
}

.footer-brand {
    flex: 0 0 auto;
    max-width: 300px;
}

.footer-brand h3 {
    color: var(--gold);
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
}

.footer-brand p {
    color: var(--gray-300);
    font-size: 0.85rem;
    line-height: 1.4;
}

.footer-links {
    flex: 1;
    display: flex;
    gap: 3rem;
    justify-content: center;
}

.footer-section h4 {
    color: var(--gold);
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
}

.footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-section li {
    margin-bottom: 0.4rem;
    color: var(--gray-300);
    font-size: 0.85rem;
}

.footer-section a {
    color: var(--gray-300);
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-section a:hover {
    color: var(--gold);
}

.footer-copyright {
    flex: 0 0 auto;
    text-align: right;
    color: var(--gray-300);
    font-size: 0.8rem;
}

.footer-copyright p {
    margin: 0;
    line-height: 1.5;
}

@media (max-width: 992px) {
    .footer-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 2rem;
    }

    .footer-brand {
        max-width: 100%;
    }

    .footer-links {
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
    }

    .footer-copyright {
        text-align: center;
    }
}

@media (max-width: 576px) {
    .footer {
        padding: 1rem 0;
    }

    .footer-content {
        gap: 1.5rem;
    }

    .footer-brand h3 {
        font-size: 1.1rem;
    }

    .footer-links {
        width: 100%;
        gap: 1rem;
    }
}
</style>