/* ═══════════════════════════════════════════════════════════════
   MADIC TOUCHSCREEN — APPLICATION
   Navigation, carousel, animations, product modal, theme toggle
   ═══════════════════════════════════════════════════════════════ */

// ── STATE ──
let currentScreen = 'screen-home';
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 120000; // 2 minutes

// ── THEME TOGGLE ──
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('madic-theme', isLight ? 'light' : 'dark');
    resetInactivityTimer();
}

// Restore saved theme on load
(function restoreTheme() {
    const saved = localStorage.getItem('madic-theme');
    if (saved === 'light') {
        document.body.classList.add('light-theme');
    }
})();

// ── NAVIGATION ──
function navigateTo(targetId) {
    if (targetId === currentScreen) return;

    const current = document.getElementById(currentScreen);
    const target = document.getElementById(targetId);

    if (!current || !target) return;

    current.classList.add('exit-left');
    current.classList.remove('active');

    target.scrollTop = 0;
    target.classList.add('active');

    setTimeout(() => {
        current.classList.remove('exit-left');
    }, 500);

    currentScreen = targetId;
    resetInactivityTimer();

    if (targetId === 'screen-home') {
        animateCounters();
    }
}

// ── CAROUSEL ──
function carouselNext(carouselId) {
    const container = document.querySelector(`#${carouselId} .carousel-track`);
    if (!container) return;
    const cardWidth = container.querySelector('.carousel-card')?.offsetWidth || 280;
    container.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
    resetInactivityTimer();
}

function carouselPrev(carouselId) {
    const container = document.querySelector(`#${carouselId} .carousel-track`);
    if (!container) return;
    const cardWidth = container.querySelector('.carousel-card')?.offsetWidth || 280;
    container.scrollBy({ left: -(cardWidth + 20), behavior: 'smooth' });
    resetInactivityTimer();
}

// Enable touch swipe on carousels
document.querySelectorAll('.carousel-track').forEach(track => {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    track.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
    }, { passive: true });

    track.addEventListener('touchend', () => { isDown = false; });
});

// ── FILTER CARDS (Automation) ──
function filterAutomation(category, btn) {
    const nav = btn.closest('.sub-nav');
    nav.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('#automation-carousel .carousel-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hidden-card');
            card.style.display = '';
        } else {
            card.classList.add('hidden-card');
            card.style.display = 'none';
        }
    });
    resetInactivityTimer();
}

// ── FILTER CARDS (Fueling) ──
function filterFueling(category, btn) {
    const nav = btn.closest('.sub-nav');
    nav.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('#fueling-carousel .carousel-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hidden-card');
            card.style.display = '';
        } else {
            card.classList.add('hidden-card');
            card.style.display = 'none';
        }
    });
    resetInactivityTimer();
}

// ── PRODUCT DATA ──
const productData = {
    // ── PULSE / IRVE ──
    'pulse-ac-wb': {
        title: 'PULSE AC-WB',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge murale intelligente, abordable et évolutive. Facile à installer avec Smart Charging et gestion de grappe pour un réseau de recharge intelligent.',
        specs: [
            { label: 'Puissance', value: '3 à 22 kW' },
            { label: 'Type', value: 'AC — Courant alternatif' },
            { label: 'Installation', value: 'Murale — Facile' },
            { label: 'Connectivité', value: 'Smart Charging' }
        ],
        features: ['Recharge normale', 'Gestion de grappe', 'Évolutive', 'Abordable', 'Résidentiel & Tertiaire']
    },
    'pulse-22gl': {
        title: 'PULSE 22 GL',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de charge accélérée conçue pour le milieu urbain, parkings publics et privés. Universelle, compacte et connectée.',
        specs: [
            { label: 'Puissance', value: '22 kW' },
            { label: 'Type', value: 'AC — Accélérée' },
            { label: 'Usage', value: 'Urbain / Parking' },
            { label: 'Design', value: 'Compacte & connectée' }
        ],
        features: ['Recharge accélérée', 'Universelle', 'Milieu urbain', 'Parking public/privé', 'Connectée']
    },
    'pulse-25': {
        title: 'PULSE 25',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge en courant continu DC 25 kW. Conforme aux dernières normes de communication et aux exigences métrologiques.',
        specs: [
            { label: 'Puissance', value: '25 kW' },
            { label: 'Type', value: 'DC — Courant continu' },
            { label: 'Normes', value: 'Dernière génération' },
            { label: 'Métrologie', value: 'Certifiée' }
        ],
        features: ['Recharge rapide DC', 'Normes métrologie', 'Communication avancée', 'Certifiée']
    },
    'pulse-100-400': {
        title: 'PULSE 100-400',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge haute puissance modulaire. Charge simultanée de 80 à 200 kW par point. Jusqu\'à 3 véhicules simultanés (2×DC + 1×AC). Compatible ISO 15118 Plug&Charge et SmartCharging.',
        specs: [
            { label: 'Puissance', value: '100 à 400 kW' },
            { label: 'Points de charge', value: '2×DC + 1×AC' },
            { label: 'Norme', value: 'ISO 15118 Plug&Charge' },
            { label: 'Architecture', value: 'Modulaire' }
        ],
        features: ['Ultra-rapide', 'Modulaire', 'Plug&Charge', 'SmartCharging', '3 véhicules simultanés']
    },
    'pulse-hpc': {
        title: 'PULSE HPC Station',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Station de recharge très haute puissance avec satellite PULSE DC SAT 350. De 720 kW à 1,4 MW pour les hubs de recharge autoroutiers et urbains.',
        specs: [
            { label: 'Puissance', value: '720 kW à 1,4 MW' },
            { label: 'Satellite', value: 'PULSE DC SAT 350' },
            { label: 'Usage', value: 'Hubs / Autoroutes' },
            { label: 'Capacité', value: 'Multi-véhicules' }
        ],
        features: ['Très haute puissance', 'Hub de recharge', 'Autoroute', 'Satellite DC SAT 350']
    },
    'chargepulse': {
        title: 'ChargePulse',
        badge: 'Supervision',
        badgeColor: '#4ecdc4',
        subtitle: 'Solution de supervision privative ChargePulse. Contrôle et pilotage à distance de l\'ensemble de votre parc de bornes de recharge électrique via une plateforme cloud.',
        specs: [
            { label: 'Type', value: 'Plateforme Cloud' },
            { label: 'Fonction', value: 'Supervision privative' },
            { label: 'Accès', value: 'À distance' },
            { label: 'Compatibilité', value: 'Gamme PULSE' }
        ],
        features: ['Cloud', 'Pilotage à distance', 'Supervision', 'Monitoring', 'Rapports']
    },

    // ── AUTOMATION — PUBLIC ──
    'boxter': {
        title: 'BOXTER',
        badge: 'Distributeur',
        badgeColor: '#e63946',
        subtitle: 'Distributeur de carburant multi-produits, marque LAFON (MADIC Industries). Conçu pour une utilisation intensive avec maintenance facilitée. Référence pour les stations GMS et réseaux pétroliers.',
        specs: [
            { label: 'Marque', value: 'LAFON / MADIC Industries' },
            { label: 'Type', value: 'Multi-produits' },
            { label: 'Usage', value: 'Intensif' },
            { label: 'Maintenance', value: 'Facilitée' }
        ],
        features: ['Multi-produits', 'Usage intensif', 'GMS', 'Réseaux pétroliers', 'Made in France']
    },
    'pupitre': {
        title: 'Pupitre ELYS',
        badge: 'Pupitre',
        badgeColor: '#e63946',
        subtitle: 'Console ELYS composée d\'un FCC (ForeCourt Controller) et d\'un logiciel de caisse. Centre névralgique de la station permettant la communication avec les distributeurs, automates, jauges, panneaux de prix et back offices.',
        specs: [
            { label: 'Composants', value: 'FCC + Logiciel caisse' },
            { label: 'Communication', value: 'Distributeurs & automates' },
            { label: 'Interfaces', value: 'Jauges, panneaux, back office' },
            { label: 'Association', value: 'CLIPRO / ELYS ONLINE' }
        ],
        features: ['ForeCourt Controller', 'Logiciel de caisse', 'Communication multi-équipements', 'Back office']
    },
    'apl3': {
        title: 'APL3 — Macpay',
        badge: 'Automate de paiement',
        badgeColor: '#e63946',
        subtitle: 'Automate de paiement sans surveillance APL3. Fonctionnalités innovantes, ergonomie soignée, intégration optimale. Paiement plus sûr, plus simple, plus rapide. Référence chez les grands pétroliers et retailers. Anti-fraude : protection contre fishing et skimming.',
        specs: [
            { label: 'Mode', value: 'Sans surveillance — 24/7' },
            { label: 'Paiements', value: 'CB, badges, sans-contact, QR' },
            { label: 'Sécurité', value: 'Anti-fishing & skimming' },
            { label: 'Services', value: 'Carburant & Lavage' }
        ],
        features: ['Sans surveillance', '24/7', 'Anti-fraude', 'Multi-paiement', 'Carburant', 'Lavage auto']
    },
    'panneaux-prix': {
        title: 'Panneaux de prix',
        badge: 'Affichage',
        badgeColor: '#e63946',
        subtitle: 'Panneaux d\'affichage de prix LED pour stations-service. Gestion à distance intégrée au système ELYS. Conformité réglementaire garantie.',
        specs: [
            { label: 'Technologie', value: 'LED' },
            { label: 'Gestion', value: 'À distance via ELYS' },
            { label: 'Conformité', value: 'Réglementaire' },
            { label: 'Visibilité', value: 'Jour & Nuit' }
        ],
        features: ['LED', 'Gestion à distance', 'ELYS compatible', 'Conformité', 'Haute visibilité']
    },
    'elys-online': {
        title: 'ELYS ONLINE',
        badge: 'Supervision',
        badgeColor: '#e63946',
        subtitle: 'Système de supervision mono et multi-sites. Hypervision, interaction et gestion à distance de l\'ensemble de vos stations. Back office complet avec tableaux de bord et rapports.',
        specs: [
            { label: 'Mode', value: 'Mono / Multi-sites' },
            { label: 'Fonction', value: 'Hypervision' },
            { label: 'Accès', value: 'À distance' },
            { label: 'Rapports', value: 'Back office complet' }
        ],
        features: ['Multi-sites', 'Hypervision', 'Gestion à distance', 'Back office', 'Tableaux de bord']
    },

    // ── AUTOMATION — PRIVATIF ──
    'clipro': {
        title: 'Module CLIPRO',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Système de gestion de comptes clients pour indépendants et flottes. Identification des conducteurs par badges et cartes. Associable à la console ELYS pour une gestion complète de la station.',
        specs: [
            { label: 'Type', value: 'Gestion de comptes' },
            { label: 'Cible', value: 'Indépendants & Flottes' },
            { label: 'Identification', value: 'Badges & Cartes' },
            { label: 'Association', value: 'Console ELYS' }
        ],
        features: ['Comptes clients', 'Badges', 'Flottes', 'Indépendants', 'Compatible ELYS']
    },
    'easycarb': {
        title: 'EASYCARB',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Terminal pour le contrôle de la consommation des flottes privées. Identification des conducteurs et véhicules. Édition de rapports personnalisés et statistiques détaillées sur les prises de carburant.',
        specs: [
            { label: 'Type', value: 'Terminal de contrôle' },
            { label: 'Cible', value: 'Flottes privées' },
            { label: 'Identification', value: 'Conducteurs & Véhicules' },
            { label: 'Données', value: 'Rapports & Statistiques' }
        ],
        features: ['Contrôle consommations', 'Identification', 'Rapports', 'Statistiques', 'Flottes privées']
    },
    'easyconnect': {
        title: 'EASYCONNECT',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Outil de supervision en ligne permettant aux clients de suivre leur consommation et de gérer leur flotte de véhicules. Tableaux de bord et analytics en temps réel.',
        specs: [
            { label: 'Type', value: 'Supervision en ligne' },
            { label: 'Fonction', value: 'Suivi consommation' },
            { label: 'Gestion', value: 'Flotte véhicules' },
            { label: 'Données', value: 'Temps réel' }
        ],
        features: ['Supervision online', 'Suivi consommation', 'Gestion de flotte', 'Temps réel', 'Analytics']
    },

    // ── FUELING — AVIATION ──
    'avitank': {
        title: 'AVITANK',
        badge: 'Aviation',
        badgeColor: '#ff6b35',
        subtitle: 'Station mobile de stockage et distribution de carburant aviation (kérosène). Conçue pour les aéroports, aérodromes et héliports. Expertise mondiale reconnue de MADIC Industries.',
        specs: [
            { label: 'Type', value: 'Station mobile aviation' },
            { label: 'Carburant', value: 'Kérosène aviation' },
            { label: 'Usage', value: 'Aéroports & Héliports' },
            { label: 'Expertise', value: 'Mondiale' }
        ],
        features: ['Aviation', 'Station mobile', 'Kérosène', 'Aéroports', 'Héliports', 'Expertise mondiale']
    },
    'boxter-aviation': {
        title: 'BOXTER Aviation',
        badge: 'Aviation',
        badgeColor: '#ff6b35',
        subtitle: 'Distributeur de carburant dédié aux applications aéronautiques. Robuste, certifié et conçu pour les contraintes spécifiques de l\'aviation.',
        specs: [
            { label: 'Type', value: 'Distributeur aviation' },
            { label: 'Marque', value: 'BOXTER / LAFON' },
            { label: 'Qualité', value: 'Certifié aviation' },
            { label: 'Robustesse', value: 'Usage intensif' }
        ],
        features: ['Aviation', 'Distributeur', 'Certifié', 'Robuste', 'Made in France']
    },
    'avidys-aero': {
        title: 'AVIDYS 540 Aéroportuaire',
        badge: 'Aviation',
        badgeColor: '#ff6b35',
        subtitle: 'Distributeur spécialisé aéroportuaire AVIDYS 540. Conformité aux normes strictes de l\'aviation civile.',
        specs: [
            { label: 'Modèle', value: 'AVIDYS 540' },
            { label: 'Spécialisation', value: 'Aéroportuaire' },
            { label: 'Normes', value: 'Aviation civile' },
            { label: 'Fabrication', value: '100% France' }
        ],
        features: ['AVIDYS 540', 'Aéroportuaire', 'Normes aviation', 'Certifié', 'France']
    },

    // ── FUELING — PÉTROLE ÉQUIPEMENT ──
    'boxter-std': {
        title: 'BOXTER Standard',
        badge: 'Pétrole Équipement',
        badgeColor: '#ff6b35',
        subtitle: 'Distributeur multi-produits pour stations-service publiques. Conçu pour une utilisation intensive avec maintenance facilitée. Compatible avec les systèmes de gestion ELYS et l\'automate APL3.',
        specs: [
            { label: 'Type', value: 'Distributeur multi-produits' },
            { label: 'Usage', value: 'Intensif — GMS & réseaux' },
            { label: 'Compatibilité', value: 'ELYS + APL3' },
            { label: 'Maintenance', value: 'Facilitée' }
        ],
        features: ['Multi-produits', 'Usage intensif', 'GMS', 'Compatible ELYS', 'Compatible APL3']
    },
    'jauges': {
        title: 'Jauges électroniques',
        badge: 'Pétrole Équipement',
        badgeColor: '#ff6b35',
        subtitle: 'Jauges électroniques pour la mesure des niveaux de cuve en temps réel. Détection de fuites et suivi continu.',
        specs: [
            { label: 'Type', value: 'Jauge électronique' },
            { label: 'Mesure', value: 'Niveaux de cuve' },
            { label: 'Sécurité', value: 'Détection de fuite' },
            { label: 'Suivi', value: 'Temps réel' }
        ],
        features: ['Niveaux de cuve', 'Détection fuite', 'Temps réel', 'Gestion stock']
    },

    // ── FUELING — PORTUAIRE ──
    'avidys-port': {
        title: 'AVIDYS 540 Portuaire',
        badge: 'Portuaire',
        badgeColor: '#ff6b35',
        subtitle: 'Distributeur dédié aux ports de pêche et marinas. Adapté aux contraintes spécifiques d\'avitaillement en milieu portuaire.',
        specs: [
            { label: 'Modèle', value: 'AVIDYS 540' },
            { label: 'Spécialisation', value: 'Portuaire' },
            { label: 'Usage', value: 'Ports de pêche & Marinas' },
            { label: 'Conception', value: 'Anti-corrosion marine' }
        ],
        features: ['Portuaire', 'Ports de pêche', 'Marinas', 'Anti-corrosion', 'Avitaillement']
    },

    // ── FUELING — RÉSERVOIRS ──
    'reservoirs-aeriens': {
        title: 'Réservoirs aériens',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Cuves de stockage aériennes conçues et fabriquées en France. Conformes aux normes européennes avec certification ISO 9001-2015.',
        specs: [
            { label: 'Type', value: 'Aérien' },
            { label: 'Normes', value: 'Européennes' },
            { label: 'Certification', value: 'ISO 9001-2015' },
            { label: 'Fabrication', value: '100% France' }
        ],
        features: ['Aérien', 'Normes EU', 'ISO 9001', 'Made in France', '60+ ans savoir-faire']
    },
    'reservoirs-enterres': {
        title: 'Réservoirs enterrés',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Cuves souterraines à double paroi pour le stockage de carburant. Conformité environnementale garantie. Plus de 60 ans de savoir-faire.',
        specs: [
            { label: 'Type', value: 'Enterré — Double paroi' },
            { label: 'Sécurité', value: 'Environnementale' },
            { label: 'Certification', value: 'ISO 9001-2015' },
            { label: 'Expérience', value: '60+ ans' }
        ],
        features: ['Enterré', 'Double paroi', 'Environnemental', 'ISO 9001', '60+ ans']
    },

    // ── FUELING — STATION MOBILE ──
    'ecotank': {
        title: 'ECOTANK',
        badge: 'Station mobile',
        badgeColor: '#ff6b35',
        subtitle: 'Point de distribution mobile privatif composé d\'une cuve et d\'une pompe ou d\'un distributeur. Personnalisable selon les besoins.',
        specs: [
            { label: 'Type', value: 'Distribution mobile' },
            { label: 'Usage', value: 'Privatif' },
            { label: 'Composants', value: 'Cuve + Pompe/Distributeur' },
            { label: 'Config', value: 'Personnalisable' }
        ],
        features: ['Mobile', 'Privatif', 'Personnalisable', 'Cuve + Pompe', 'Économique']
    },
    'isotank': {
        title: 'ISOTANK',
        badge: 'Station mobile',
        badgeColor: '#ff6b35',
        subtitle: 'Station-service ou dépôt mobile intégré dans un conteneur ISO 10, 20 ou 40 pieds. Comprend cuve, distributeur et système de gestion. Options : générateur, bras de chargement.',
        specs: [
            { label: 'Format', value: 'Conteneur ISO 10/20/40 pieds' },
            { label: 'Composants', value: 'Cuve + Distributeur + Gestion' },
            { label: 'Options', value: 'Générateur, bras de chargement' },
            { label: 'Déploiement', value: 'Rapide — Plug & Play' }
        ],
        features: ['Conteneur ISO', 'Station complète', 'Plug & Play', 'Générateur option', 'Bras de chargement']
    },
    'mobiltank': {
        title: 'MOBILTANK',
        badge: 'Station mobile',
        badgeColor: '#ff6b35',
        subtitle: 'Station nomade Plug & Play, concept historique inventé par LAFON. Solution économique et rapidement déployable.',
        specs: [
            { label: 'Type', value: 'Station nomade' },
            { label: 'Concept', value: 'Invention LAFON' },
            { label: 'Déploiement', value: 'Plug & Play' },
            { label: 'Coût', value: 'Économique' }
        ],
        features: ['Nomade', 'Plug & Play', 'Invention LAFON', 'Économique', 'Déploiement rapide']
    }
};

// ── PRODUCT MODAL ──
function openProductModal(productId) {
    const product = productData[productId];
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-image');
    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalSpecs = document.getElementById('modal-specs');
    const modalFeatures = document.getElementById('modal-features');

    modalBadge.textContent = product.badge;
    modalBadge.style.background = product.badgeColor || '#e63946';

    // Set image background based on category
    const isLight = document.body.classList.contains('light-theme');
    if (product.badgeColor === '#4ecdc4') {
        modalImage.style.background = isLight
            ? 'linear-gradient(135deg, #e0f5f3, #c5e8e4)'
            : 'linear-gradient(135deg, #0a1a1a, #162e2e)';
    } else if (product.badgeColor === '#ff6b35') {
        modalImage.style.background = isLight
            ? 'linear-gradient(135deg, #f5ece0, #e8dcc5)'
            : 'linear-gradient(135deg, #1a1408, #2e2010)';
    } else {
        modalImage.style.background = isLight
            ? 'linear-gradient(135deg, #e8e8f0, #d8d8e8)'
            : 'linear-gradient(135deg, #1a1a2e, #262640)';
    }

    modalTitle.textContent = product.title;
    modalSubtitle.textContent = product.subtitle;

    modalSpecs.innerHTML = product.specs.map(spec => `
        <div class="spec-item">
            <div class="spec-label">${spec.label}</div>
            <div class="spec-value">${spec.value}</div>
        </div>
    `).join('');

    modalFeatures.innerHTML = product.features.map(f => `
        <span class="feature-tag" style="color: ${product.badgeColor}; background: ${product.badgeColor}15">${f}</span>
    `).join('');

    modal.classList.remove('hidden');
    resetInactivityTimer();
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    resetInactivityTimer();
}

// ── COUNTER ANIMATION ──
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            if (target >= 1000) {
                counter.textContent = current.toLocaleString('fr-FR');
            } else {
                counter.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (target >= 1000) {
                    counter.textContent = target.toLocaleString('fr-FR');
                } else {
                    counter.textContent = target;
                }
            }
        }

        requestAnimationFrame(update);
    });
}

// ── INACTIVITY SCREENSAVER ──
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    hideScreensaver();
    inactivityTimer = setTimeout(showScreensaver, INACTIVITY_TIMEOUT);
}

function showScreensaver() {
    const screensaver = document.getElementById('screensaver');
    if (screensaver) {
        screensaver.classList.remove('hidden');
    }
}

function hideScreensaver() {
    const screensaver = document.getElementById('screensaver');
    if (screensaver && !screensaver.classList.contains('hidden')) {
        screensaver.classList.add('hidden');
        navigateTo('screen-home');
    }
}

['touchstart', 'mousedown', 'mousemove', 'keydown'].forEach(event => {
    document.addEventListener(event, () => {
        resetInactivityTimer();
    }, { passive: true });
});

document.getElementById('screensaver')?.addEventListener('click', () => {
    hideScreensaver();
    navigateTo('screen-home');
});

document.getElementById('screensaver')?.addEventListener('touchstart', () => {
    hideScreensaver();
    navigateTo('screen-home');
}, { passive: true });

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateCounters, 600);
    resetInactivityTimer();

    const homeScreen = document.getElementById('screen-home');
    if (homeScreen) {
        homeScreen.addEventListener('click', (e) => {
            if (!e.target.closest('button') && !e.target.closest('.cta-main')) {
                navigateTo('screen-menu');
            }
        });
    }

    document.addEventListener('contextmenu', (e) => e.preventDefault());

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});
