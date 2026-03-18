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

// ── PDF FILE MAPPING ──
const pdfFiles = {
    // PULSE
    'chargepulse': '39000216_ChargePulse_Ind F_FR.pdf',
    'pulse-ac-22-gl': '39000218_Pulse AC 22 GL_Ind N_FR.pdf',
    'pulse-ac-22-wl': '39000243_Pulse AC 22 WL_Ind_I_FR.pdf',
    'pulse-ac-wb': '39000245_Pulse AC-WB_Ind J_FR.pdf',
    'pulse-7-wl': '39000301_Pulse 7 WL_Ind B_FR.pdf',
    'pulse-25': '39000333_Pulse 25_Ind D_FR.pdf',
    'pulse-dc-20-80': '39000334_Pulse DC 20-80_Ind G_FR.pdf',
    'pulse-dc-100-400': '39000335_Pulse DC 100-400_Ind E_FR.pdf',
    'pulse-power-unit-720': '39000342_Pulse power unit 720 sat 350_Ind_A_FR.pdf',
    'pulse-43-ac': '39000346_Pulse 43 kW AC_Ind A_FR.pdf',
    'pulse-dc-36': '39000352_Pulse DC 36_Ind A_FR.pdf',
    // Automation Privatif
    'easyonline': '39000157_logiciel easyonline_ind C_FR.pdf',
    'boxter-20vs': '39000165_Boxter-20VS_Ind H_FR.pdf',
    'ready-v2': '39000173_Ready_V2_Ind J_FR.pdf',
    'minicarb': '39000194_minicarb_Ind E_FR.pdf',
    'boxter-10vs': '39000200_Boxter-10VS_Ind J_FR.pdf',
    'satellite-adblue': '39000208_Satellite_Adblue_Ind B.pdf',
    'abipass-v2': '39000221_Abipass-V2_Ind F FR.pdf',
    'container-adblue': '39000221_Container-AdBlue_Ind F_FR.pdf',
    'magfleet70': '39000338_MagFleet70_Ind A_FR.pdf',
    // Automation Public
    'pupitre-elys': '39000050_Pupitre Elys_Ind I_FR.pdf',
    'clipro': '39000052_Clipro_Ind F_FR.pdf',
    'sk700': '39000054_sk700_Ind G.pdf',
    'boxter-20vp': '39000161_Boxter_20VP_Ind L_FR.pdf',
    'mg-pay-101': '39000183_MG PAY 101_Ind Q_FR.pdf',
    'boxter-10vp': '39000209_Boxter_10VP_Ind I_FR.pdf',
    'elys-oil': '39000228_Elys-oil_Ind B_FR.pdf',
    'helix': '39000230_helix_Ind A_FR_Format A4.pdf',
    'ocean-euro-gpl': '39000234_Ocean Euro GPL_Ind E_FR.pdf',
    'ocean-euro': '39000235_Ocean Euro_Ind E_FR.pdf',
    'container-adblue-public': '39000248_Container-AdBlue-public_Ind A_FR.pdf',
    'ocean-tower': '39000303_Ocean TOWER_Ind G_FR.pdf',
    'shark-adblue': '39000304_Shark ADBLUE_Ind E_FR.pdf',
    'shark-adblue-lvs1': '39000306_Shark ADBLUE LVS1_Ind C_FR.pdf',
    'shark-lvs1': '39000308_Shark LVS1_Ind B_FR.pdf',
    'shark-gpl': '39000311_Shark GPL_Ind C FR.pdf',
    'borne-ticket-code': '39000328_Borne_ticket_code_Ind B_FR.pdf',
    'shark-vp': '39000331_Shark VP_Ind F_FR.pdf',
    'magview': '39000343_MagView_Ind A_FR.pdf'
};

// ── PRODUCT DATA ──
const productData = {

    // ═══════════════════════════════════════
    // ÉNERGIES ALTERNATIVES — H2-GNC
    // ═══════════════════════════════════════
    'ocean-smart-gnc': {
        title: 'Ocean Smart GNC',
        badge: 'H2-GNC',
        badgeColor: '#3a86ff',
        subtitle: 'Distributeur Ocean Smart dédié au Gaz Naturel Comprimé (GNC). Solution complète pour la distribution de GNC en station.',
        specs: [
            { label: 'Type', value: 'Distributeur GNC' },
            { label: 'Énergie', value: 'Gaz Naturel Comprimé' },
            { label: 'Gamme', value: 'Ocean Smart' },
            { label: 'Fabrication', value: 'France' }
        ],
        features: ['GNC', 'Ocean Smart', 'Distribution gaz', 'Station multi-énergies']
    },
    'station-h2': {
        title: 'Station H2',
        badge: 'H2-GNC',
        badgeColor: '#3a86ff',
        subtitle: 'Station de distribution d\'hydrogène complète. Infrastructure H2 pour tout type de véhicules, du véhicule léger au poids lourd.',
        specs: [
            { label: 'Type', value: 'Station hydrogène' },
            { label: 'Véhicules', value: 'Légers à Poids lourds' },
            { label: 'Capacité', value: 'Variable selon projet' },
            { label: 'Source H2', value: 'Multi-sources' }
        ],
        features: ['Hydrogène', 'Station complète', 'Multi-véhicules', 'Clé en main']
    },
    'station-h2-compacte': {
        title: 'Station H2 compacte et déplaçable',
        badge: 'H2-GNC',
        badgeColor: '#3a86ff',
        subtitle: 'Station hydrogène compacte et déplaçable. Solution modulaire et transportable pour le déploiement rapide d\'infrastructures H2.',
        specs: [
            { label: 'Type', value: 'Station H2 compacte' },
            { label: 'Mobilité', value: 'Déplaçable' },
            { label: 'Installation', value: 'Rapide' },
            { label: 'Format', value: 'Compact et modulaire' }
        ],
        features: ['Hydrogène', 'Compacte', 'Déplaçable', 'Modulaire', 'Déploiement rapide']
    },

    // ═══════════════════════════════════════
    // ÉNERGIES ALTERNATIVES — PULSE / IRVE
    // ═══════════════════════════════════════
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
    'pulse-ac-22-gl': {
        title: 'Pulse AC 22 GL',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge accélérée AC 22 kW sur pied (Ground Level). Conçue pour le milieu urbain, parkings publics et privés. Compacte et connectée.',
        specs: [
            { label: 'Puissance', value: '22 kW' },
            { label: 'Type', value: 'AC — Sur pied' },
            { label: 'Usage', value: 'Urbain / Parking' },
            { label: 'Design', value: 'Compacte & connectée' }
        ],
        features: ['Recharge accélérée', '22 kW', 'Sur pied', 'Milieu urbain', 'Connectée']
    },
    'pulse-ac-22-wl': {
        title: 'Pulse AC 22 WL',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge accélérée AC 22 kW en version murale (Wall Level). Idéale pour les parkings couverts et les installations en intérieur.',
        specs: [
            { label: 'Puissance', value: '22 kW' },
            { label: 'Type', value: 'AC — Murale' },
            { label: 'Usage', value: 'Parking couvert' },
            { label: 'Installation', value: 'Murale' }
        ],
        features: ['Recharge accélérée', '22 kW', 'Murale', 'Parking couvert', 'Compacte']
    },
    'pulse-ac-wb': {
        title: 'Pulse AC-WB',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge murale intelligente Wallbox, abordable et évolutive. Facile à installer avec Smart Charging et gestion de grappe.',
        specs: [
            { label: 'Puissance', value: '3 à 22 kW' },
            { label: 'Type', value: 'AC — Wallbox' },
            { label: 'Installation', value: 'Murale — Facile' },
            { label: 'Connectivité', value: 'Smart Charging' }
        ],
        features: ['Wallbox', 'Gestion de grappe', 'Évolutive', 'Abordable', 'Résidentiel & Tertiaire']
    },
    'pulse-7-wl': {
        title: 'Pulse 7 WL',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge murale 7 kW. Solution d\'entrée de gamme pour la recharge normale, idéale pour le résidentiel et le tertiaire.',
        specs: [
            { label: 'Puissance', value: '7 kW' },
            { label: 'Type', value: 'AC — Murale' },
            { label: 'Usage', value: 'Résidentiel / Tertiaire' },
            { label: 'Gamme', value: 'Entrée de gamme' }
        ],
        features: ['Recharge normale', '7 kW', 'Murale', 'Résidentiel', 'Économique']
    },
    'pulse-25': {
        title: 'Pulse 25',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge en courant continu DC 25 kW. Conforme aux dernières normes de communication et aux exigences métrologiques.',
        specs: [
            { label: 'Puissance', value: '25 kW' },
            { label: 'Type', value: 'DC — Courant continu' },
            { label: 'Normes', value: 'Dernière génération' },
            { label: 'Métrologie', value: 'Certifiée' }
        ],
        features: ['Recharge rapide DC', '25 kW', 'Normes métrologie', 'Communication avancée']
    },
    'pulse-dc-20-80': {
        title: 'Pulse DC 20-80',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge DC de 20 à 80 kW. Puissance modulable adaptée aux besoins de recharge rapide en milieu urbain et péri-urbain.',
        specs: [
            { label: 'Puissance', value: '20 à 80 kW' },
            { label: 'Type', value: 'DC — Courant continu' },
            { label: 'Architecture', value: 'Modulable' },
            { label: 'Usage', value: 'Urbain / Péri-urbain' }
        ],
        features: ['Recharge rapide DC', '20-80 kW', 'Modulable', 'Urbain', 'Péri-urbain']
    },
    'pulse-dc-100-400': {
        title: 'Pulse DC 100-400',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge haute puissance DC modulaire. Charge simultanée de 2×DC + 1×AC. Compatible ISO 15118 Plug&Charge et SmartCharging.',
        specs: [
            { label: 'Puissance', value: '100 à 400 kW' },
            { label: 'Points de charge', value: '2×DC + 1×AC' },
            { label: 'Norme', value: 'ISO 15118 Plug&Charge' },
            { label: 'Architecture', value: 'Modulaire' }
        ],
        features: ['Ultra-rapide', 'Modulaire', 'Plug&Charge', 'SmartCharging', '3 véhicules simultanés']
    },
    'pulse-power-unit-720': {
        title: 'Pulse Power Unit 720 SAT 350',
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
    'pulse-43-ac': {
        title: 'Pulse 43 kW AC',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge AC haute puissance 43 kW. Recharge accélérée pour les véhicules compatibles en courant alternatif triphasé.',
        specs: [
            { label: 'Puissance', value: '43 kW' },
            { label: 'Type', value: 'AC — Triphasé' },
            { label: 'Recharge', value: 'Accélérée haute puissance' },
            { label: 'Compatibilité', value: 'Véhicules AC 43 kW' }
        ],
        features: ['AC haute puissance', '43 kW', 'Triphasé', 'Recharge accélérée']
    },
    'pulse-dc-36': {
        title: 'Pulse DC 36',
        badge: 'IRVE',
        badgeColor: '#4ecdc4',
        subtitle: 'Borne de recharge DC 36 kW. Solution de recharge rapide compacte en courant continu pour les emplacements à espace limité.',
        specs: [
            { label: 'Puissance', value: '36 kW' },
            { label: 'Type', value: 'DC — Courant continu' },
            { label: 'Format', value: 'Compact' },
            { label: 'Usage', value: 'Espaces restreints' }
        ],
        features: ['Recharge rapide DC', '36 kW', 'Compact', 'Courant continu']
    },

    // ═══════════════════════════════════════
    // AUTOMATION — PRIVATIF
    // ═══════════════════════════════════════
    'easyconnect': {
        title: 'Easyconnect',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Outil de supervision en ligne permettant aux clients de suivre leur consommation et de gérer leur flotte de véhicules. Tableaux de bord et analytics en temps réel.',
        specs: [
            { label: 'Type', value: 'Supervision en ligne' },
            { label: 'Fonction', value: 'Suivi consommation' },
            { label: 'Gestion', value: 'Flotte véhicules' },
            { label: 'Données', value: 'Temps réel' }
        ],
        features: ['Supervision online', 'Suivi consommation', 'Gestion de flotte', 'Temps réel']
    },
    'easycarb': {
        title: 'Easycarb',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Terminal pour le contrôle de la consommation des flottes privées. Identification des conducteurs et véhicules. Rapports et statistiques détaillés.',
        specs: [
            { label: 'Type', value: 'Terminal de contrôle' },
            { label: 'Cible', value: 'Flottes privées' },
            { label: 'Identification', value: 'Conducteurs & Véhicules' },
            { label: 'Données', value: 'Rapports & Statistiques' }
        ],
        features: ['Contrôle consommations', 'Identification', 'Rapports', 'Statistiques', 'Flottes privées']
    },
    'easyonline': {
        title: 'Logiciel Easyonline',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Logiciel de gestion et supervision à distance des installations privatives. Interface intuitive pour le pilotage des équipements.',
        specs: [
            { label: 'Type', value: 'Logiciel de gestion' },
            { label: 'Mode', value: 'Supervision à distance' },
            { label: 'Interface', value: 'Intuitive' },
            { label: 'Cible', value: 'Installations privatives' }
        ],
        features: ['Logiciel', 'Supervision', 'Gestion à distance', 'Interface intuitive']
    },
    'boxter-20vs': {
        title: 'Boxter 20VS',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Distributeur de carburant Boxter 20 en version Vente Simple (VS). Conçu pour les installations privatives avec gestion simplifiée.',
        specs: [
            { label: 'Modèle', value: 'Boxter 20' },
            { label: 'Version', value: 'VS — Vente Simple' },
            { label: 'Usage', value: 'Privatif' },
            { label: 'Marque', value: 'LAFON / MADIC' }
        ],
        features: ['Distributeur', 'Vente Simple', 'Privatif', 'Boxter 20', 'LAFON']
    },
    'ready-v2': {
        title: 'Ready V2',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Terminal de gestion prêt à l\'emploi, version V2. Solution clé en main pour la distribution privative de carburant.',
        specs: [
            { label: 'Type', value: 'Terminal clé en main' },
            { label: 'Version', value: 'V2' },
            { label: 'Installation', value: 'Prêt à l\'emploi' },
            { label: 'Usage', value: 'Distribution privative' }
        ],
        features: ['Clé en main', 'Prêt à l\'emploi', 'Version V2', 'Privatif']
    },
    'minicarb': {
        title: 'Minicarb',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Terminal compact de gestion des consommations de carburant. Format réduit idéal pour les petites installations privatives.',
        specs: [
            { label: 'Type', value: 'Terminal compact' },
            { label: 'Format', value: 'Mini / Réduit' },
            { label: 'Fonction', value: 'Gestion consommations' },
            { label: 'Usage', value: 'Petites installations' }
        ],
        features: ['Compact', 'Terminal mini', 'Gestion consommation', 'Privatif']
    },
    'boxter-10vs': {
        title: 'Boxter 10VS',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Distributeur de carburant Boxter 10 en version Vente Simple (VS). Version compacte pour les dépôts privatifs et flottes réduites.',
        specs: [
            { label: 'Modèle', value: 'Boxter 10' },
            { label: 'Version', value: 'VS — Vente Simple' },
            { label: 'Usage', value: 'Dépôts privatifs' },
            { label: 'Format', value: 'Compact' }
        ],
        features: ['Distributeur', 'Compact', 'Vente Simple', 'Boxter 10', 'Privatif']
    },
    'satellite-adblue': {
        title: 'Satellite AdBlue',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Module satellite dédié à la distribution d\'AdBlue. Complément idéal pour les installations de distribution de carburant privatif.',
        specs: [
            { label: 'Type', value: 'Module satellite' },
            { label: 'Produit', value: 'AdBlue' },
            { label: 'Fonction', value: 'Distribution AdBlue' },
            { label: 'Association', value: 'Complément installation' }
        ],
        features: ['AdBlue', 'Satellite', 'Module complémentaire', 'Privatif']
    },
    'abipass-v2': {
        title: 'Abipass V2',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Système de gestion automatisé Abipass, version V2. Identification et contrôle d\'accès pour la distribution privative.',
        specs: [
            { label: 'Type', value: 'Gestion automatisée' },
            { label: 'Version', value: 'V2' },
            { label: 'Fonction', value: 'Identification & Accès' },
            { label: 'Usage', value: 'Distribution privative' }
        ],
        features: ['Automatisé', 'Identification', 'Contrôle d\'accès', 'Version V2']
    },
    'container-adblue': {
        title: 'Container AdBlue',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Container de distribution AdBlue pour installations privatives. Solution complète de stockage et distribution d\'AdBlue en conteneur.',
        specs: [
            { label: 'Type', value: 'Container distribution' },
            { label: 'Produit', value: 'AdBlue' },
            { label: 'Format', value: 'Conteneur' },
            { label: 'Usage', value: 'Privatif' }
        ],
        features: ['AdBlue', 'Container', 'Distribution', 'Stockage', 'Privatif']
    },
    'magfleet70': {
        title: 'MagFleet70',
        badge: 'Privatif',
        badgeColor: '#4ecdc4',
        subtitle: 'Système de gestion de flotte MagFleet70. Suivi et contrôle des consommations de carburant pour les flottes privatives.',
        specs: [
            { label: 'Type', value: 'Gestion de flotte' },
            { label: 'Gamme', value: 'MagFleet' },
            { label: 'Fonction', value: 'Suivi consommations' },
            { label: 'Capacité', value: 'Flottes privatives' }
        ],
        features: ['Gestion flotte', 'MagFleet', 'Consommations', 'Suivi', 'Privatif']
    },

    // ═══════════════════════════════════════
    // AUTOMATION — PUBLIC
    // ═══════════════════════════════════════
    'pupitre-elys': {
        title: 'Pupitre Elys',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Console ELYS composée d\'un FCC (ForeCourt Controller) et d\'un logiciel de caisse. Centre névralgique de la station permettant la communication avec les distributeurs, automates, jauges et panneaux de prix.',
        specs: [
            { label: 'Composants', value: 'FCC + Logiciel caisse' },
            { label: 'Communication', value: 'Distributeurs & automates' },
            { label: 'Interfaces', value: 'Jauges, panneaux, back office' },
            { label: 'Association', value: 'CLIPRO / ELYS ONLINE' }
        ],
        features: ['ForeCourt Controller', 'Logiciel de caisse', 'Multi-équipements', 'Back office']
    },
    'clipro': {
        title: 'Clipro',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Système de gestion de comptes clients pour indépendants et flottes. Identification des conducteurs par badges et cartes. Associable à la console ELYS.',
        specs: [
            { label: 'Type', value: 'Gestion de comptes' },
            { label: 'Cible', value: 'Indépendants & Flottes' },
            { label: 'Identification', value: 'Badges & Cartes' },
            { label: 'Association', value: 'Console ELYS' }
        ],
        features: ['Comptes clients', 'Badges', 'Flottes', 'Indépendants', 'Compatible ELYS']
    },
    'sk700': {
        title: 'SK700',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Terminal de paiement SK700. Solution de paiement intégrée pour les stations-service publiques.',
        specs: [
            { label: 'Type', value: 'Terminal de paiement' },
            { label: 'Modèle', value: 'SK700' },
            { label: 'Usage', value: 'Station-service publique' },
            { label: 'Paiement', value: 'Multi-modes' }
        ],
        features: ['Terminal paiement', 'SK700', 'Station publique', 'Multi-paiement']
    },
    'global-star': {
        title: 'Global Star',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Système de gestion globale Global Star. Solution complète de pilotage et supervision pour les réseaux de stations-service.',
        specs: [
            { label: 'Type', value: 'Système de gestion' },
            { label: 'Gamme', value: 'Global Star' },
            { label: 'Fonction', value: 'Pilotage & Supervision' },
            { label: 'Cible', value: 'Réseaux de stations' }
        ],
        features: ['Gestion globale', 'Supervision', 'Réseau stations', 'Pilotage']
    },
    'boxter-20vp': {
        title: 'Boxter 20VP',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur de carburant Boxter 20 en version Vente Publique (VP). Conçu pour une utilisation intensive en station-service publique.',
        specs: [
            { label: 'Modèle', value: 'Boxter 20' },
            { label: 'Version', value: 'VP — Vente Publique' },
            { label: 'Usage', value: 'Intensif — Station publique' },
            { label: 'Marque', value: 'LAFON / MADIC' }
        ],
        features: ['Distributeur', 'Multi-produits', 'Usage intensif', 'Boxter 20', 'LAFON']
    },
    'mg-pay-101': {
        title: 'MG PAY 101',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Automate de paiement MG PAY 101. Paiement sans surveillance, CB, badges, sans-contact. Anti-fraude : protection contre fishing et skimming. Fonctionnement 24/7.',
        specs: [
            { label: 'Mode', value: 'Sans surveillance — 24/7' },
            { label: 'Paiements', value: 'CB, badges, sans-contact' },
            { label: 'Sécurité', value: 'Anti-fishing & skimming' },
            { label: 'Services', value: 'Carburant & Lavage' }
        ],
        features: ['Sans surveillance', '24/7', 'Anti-fraude', 'Multi-paiement', 'MG PAY']
    },
    'boxter-10vp': {
        title: 'Boxter 10VP',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur de carburant Boxter 10 en version Vente Publique (VP). Format compact pour les stations à espace limité.',
        specs: [
            { label: 'Modèle', value: 'Boxter 10' },
            { label: 'Version', value: 'VP — Vente Publique' },
            { label: 'Format', value: 'Compact' },
            { label: 'Marque', value: 'LAFON / MADIC' }
        ],
        features: ['Distributeur', 'Compact', 'Vente Publique', 'Boxter 10', 'LAFON']
    },
    'elys-oil': {
        title: 'Elys-oil',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Système de gestion ELYS dédié aux produits pétroliers et huiles. Pilotage et suivi de la distribution d\'huiles en station.',
        specs: [
            { label: 'Type', value: 'Système de gestion' },
            { label: 'Gamme', value: 'ELYS' },
            { label: 'Spécialité', value: 'Huiles & Produits pétroliers' },
            { label: 'Fonction', value: 'Pilotage distribution' }
        ],
        features: ['ELYS', 'Huiles', 'Gestion', 'Distribution', 'Station publique']
    },
    'helix': {
        title: 'Helix',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur Helix. Solution de distribution de carburant au design moderne et aux performances élevées.',
        specs: [
            { label: 'Type', value: 'Distributeur' },
            { label: 'Gamme', value: 'Helix' },
            { label: 'Design', value: 'Moderne' },
            { label: 'Performance', value: 'Élevée' }
        ],
        features: ['Distributeur', 'Helix', 'Design moderne', 'Haute performance']
    },
    'ocean-euro-gpl': {
        title: 'Ocean Euro GPL',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur Ocean Euro dédié au GPL (Gaz de Pétrole Liquéfié). Distribution sécurisée de GPL en station-service.',
        specs: [
            { label: 'Type', value: 'Distributeur GPL' },
            { label: 'Gamme', value: 'Ocean Euro' },
            { label: 'Produit', value: 'GPL' },
            { label: 'Sécurité', value: 'Normes GPL' }
        ],
        features: ['GPL', 'Ocean Euro', 'Distribution sécurisée', 'Station publique']
    },
    'ocean-euro': {
        title: 'Ocean Euro',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur Ocean Euro multi-produits. Solution polyvalente pour la distribution de carburants en station-service publique.',
        specs: [
            { label: 'Type', value: 'Distributeur multi-produits' },
            { label: 'Gamme', value: 'Ocean Euro' },
            { label: 'Usage', value: 'Station publique' },
            { label: 'Polyvalence', value: 'Multi-carburants' }
        ],
        features: ['Ocean Euro', 'Multi-produits', 'Polyvalent', 'Station publique']
    },
    'container-adblue-public': {
        title: 'Container AdBlue Public',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Container de distribution AdBlue pour stations-service publiques. Solution complète de stockage et distribution d\'AdBlue accessible au public.',
        specs: [
            { label: 'Type', value: 'Container distribution' },
            { label: 'Produit', value: 'AdBlue' },
            { label: 'Format', value: 'Conteneur' },
            { label: 'Usage', value: 'Station publique' }
        ],
        features: ['AdBlue', 'Container', 'Public', 'Distribution', 'Stockage']
    },
    'ocean-tower': {
        title: 'Ocean TOWER',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur Ocean TOWER au format tour. Design vertical optimisant l\'espace au sol en station-service.',
        specs: [
            { label: 'Type', value: 'Distributeur tour' },
            { label: 'Gamme', value: 'Ocean' },
            { label: 'Design', value: 'Vertical / Tour' },
            { label: 'Avantage', value: 'Gain d\'espace' }
        ],
        features: ['Ocean TOWER', 'Format tour', 'Gain d\'espace', 'Design vertical']
    },
    'shark-adblue': {
        title: 'Shark ADBLUE',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur Shark dédié à la distribution d\'AdBlue. Solution robuste et fiable pour l\'avitaillement en AdBlue en station publique.',
        specs: [
            { label: 'Type', value: 'Distributeur AdBlue' },
            { label: 'Gamme', value: 'Shark' },
            { label: 'Produit', value: 'AdBlue' },
            { label: 'Fiabilité', value: 'Robuste' }
        ],
        features: ['Shark', 'AdBlue', 'Robuste', 'Station publique']
    },
    'shark-adblue-lvs1': {
        title: 'Shark ADBLUE LVS1',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur Shark AdBlue en version LVS1 (Low Volume Side). Version compacte pour les installations à faible débit.',
        specs: [
            { label: 'Type', value: 'Distributeur AdBlue' },
            { label: 'Version', value: 'LVS1 — Low Volume' },
            { label: 'Format', value: 'Compact' },
            { label: 'Gamme', value: 'Shark' }
        ],
        features: ['Shark', 'AdBlue', 'LVS1', 'Compact', 'Faible débit']
    },
    'shark-lvs1': {
        title: 'Shark LVS1',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur Shark en version LVS1 (Low Volume Side). Distributeur compact pour les besoins de distribution à volume réduit.',
        specs: [
            { label: 'Type', value: 'Distributeur' },
            { label: 'Version', value: 'LVS1 — Low Volume' },
            { label: 'Format', value: 'Compact' },
            { label: 'Gamme', value: 'Shark' }
        ],
        features: ['Shark', 'LVS1', 'Compact', 'Low Volume']
    },
    'shark-gpl': {
        title: 'Shark GPL',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur Shark dédié au GPL. Distribution sécurisée de Gaz de Pétrole Liquéfié conforme aux normes en vigueur.',
        specs: [
            { label: 'Type', value: 'Distributeur GPL' },
            { label: 'Gamme', value: 'Shark' },
            { label: 'Produit', value: 'GPL' },
            { label: 'Sécurité', value: 'Conforme normes GPL' }
        ],
        features: ['Shark', 'GPL', 'Distribution sécurisée', 'Conforme']
    },
    'borne-ticket-code': {
        title: 'Borne ticket code',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Borne d\'émission de tickets à code. Permet l\'identification et le contrôle d\'accès par ticket ou code en station-service.',
        specs: [
            { label: 'Type', value: 'Borne ticket / code' },
            { label: 'Fonction', value: 'Identification & Accès' },
            { label: 'Mode', value: 'Ticket ou Code' },
            { label: 'Usage', value: 'Station publique' }
        ],
        features: ['Borne', 'Ticket', 'Code', 'Identification', 'Accès']
    },
    'shark-vp': {
        title: 'Shark VP',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Distributeur Shark en version Vente Publique (VP). Distributeur multi-produits robuste pour les stations-service publiques.',
        specs: [
            { label: 'Type', value: 'Distributeur multi-produits' },
            { label: 'Version', value: 'VP — Vente Publique' },
            { label: 'Gamme', value: 'Shark' },
            { label: 'Robustesse', value: 'Usage intensif' }
        ],
        features: ['Shark', 'Vente Publique', 'Multi-produits', 'Robuste', 'Usage intensif']
    },
    'magview': {
        title: 'MagView',
        badge: 'Public',
        badgeColor: '#e63946',
        subtitle: 'Système de supervision MagView. Visualisation et monitoring en temps réel de l\'activité de la station-service.',
        specs: [
            { label: 'Type', value: 'Supervision' },
            { label: 'Gamme', value: 'MagView' },
            { label: 'Fonction', value: 'Monitoring temps réel' },
            { label: 'Visualisation', value: 'Tableau de bord' }
        ],
        features: ['Supervision', 'MagView', 'Temps réel', 'Monitoring', 'Dashboard']
    },

    // ═══════════════════════════════════════
    // FUELING — AVIATION
    // ═══════════════════════════════════════
    'avidys-540-aero': {
        title: 'Avidys 540 Aéroportuaire',
        badge: 'Aviation',
        badgeColor: '#ff6b35',
        subtitle: 'Distributeur spécialisé aéroportuaire AVIDYS 540. Conformité aux normes strictes de l\'aviation civile. Distribution de kérosène en aéroports et aérodromes.',
        specs: [
            { label: 'Modèle', value: 'AVIDYS 540' },
            { label: 'Spécialisation', value: 'Aéroportuaire' },
            { label: 'Normes', value: 'Aviation civile' },
            { label: 'Fabrication', value: '100% France' }
        ],
        features: ['AVIDYS 540', 'Aéroportuaire', 'Normes aviation', 'Kérosène', 'France']
    },
    'boxter-avia': {
        title: 'Boxter Aviation',
        badge: 'Aviation',
        badgeColor: '#ff6b35',
        subtitle: 'Distributeur de carburant Boxter dédié aux applications aéronautiques. Robuste, certifié et conçu pour les contraintes spécifiques de l\'aviation.',
        specs: [
            { label: 'Type', value: 'Distributeur aviation' },
            { label: 'Marque', value: 'BOXTER / LAFON' },
            { label: 'Qualité', value: 'Certifié aviation' },
            { label: 'Robustesse', value: 'Usage intensif' }
        ],
        features: ['Aviation', 'Distributeur', 'Certifié', 'Robuste', 'LAFON']
    },

    // ═══════════════════════════════════════
    // FUELING — PORT & MARINA
    // ═══════════════════════════════════════
    'avidys-540-port': {
        title: 'Avidys 540 Portuaire et mine',
        badge: 'Port & Marina',
        badgeColor: '#ff6b35',
        subtitle: 'Distributeur dédié aux ports de pêche, marinas et exploitations minières. Adapté aux contraintes spécifiques d\'avitaillement en milieu portuaire et minier.',
        specs: [
            { label: 'Modèle', value: 'AVIDYS 540' },
            { label: 'Spécialisation', value: 'Portuaire & Mine' },
            { label: 'Usage', value: 'Ports de pêche, Marinas, Mines' },
            { label: 'Conception', value: 'Anti-corrosion' }
        ],
        features: ['Portuaire', 'Ports de pêche', 'Marinas', 'Mines', 'Anti-corrosion']
    },

    // ═══════════════════════════════════════
    // FUELING — PÉTRO-ÉQUIPEMENTS (Limiteurs de remplissage)
    // ═══════════════════════════════════════
    'cleanfill-2': {
        title: 'Cleanfill-2',
        badge: 'Limiteurs',
        badgeColor: '#ff6b35',
        subtitle: 'Limiteur de remplissage Cleanfill-2. Dispositif de sécurité pour le contrôle du remplissage des cuves de stockage de carburant.',
        specs: [
            { label: 'Type', value: 'Limiteur de remplissage' },
            { label: 'Gamme', value: 'Cleanfill' },
            { label: 'Modèle', value: 'Cleanfill-2' },
            { label: 'Sécurité', value: 'Anti-débordement' }
        ],
        features: ['Limiteur remplissage', 'Cleanfill', 'Sécurité', 'Anti-débordement']
    },
    'posiquick-premium': {
        title: 'Posiquick Premium',
        badge: 'Limiteurs',
        badgeColor: '#ff6b35',
        subtitle: 'Limiteur de remplissage Posiquick Premium. Raccord rapide de sécurité pour le remplissage des cuves de stockage.',
        specs: [
            { label: 'Type', value: 'Limiteur / Raccord rapide' },
            { label: 'Gamme', value: 'Posiquick' },
            { label: 'Version', value: 'Premium' },
            { label: 'Fonction', value: 'Remplissage sécurisé' }
        ],
        features: ['Posiquick', 'Premium', 'Raccord rapide', 'Sécurité remplissage']
    },
    'cleanfill-4gvf': {
        title: 'Cleanfill-4GVF',
        badge: 'Limiteurs',
        badgeColor: '#ff6b35',
        subtitle: 'Limiteur de remplissage Cleanfill-4GVF. Version à 4 entrées avec filtration intégrée pour les grandes installations de stockage.',
        specs: [
            { label: 'Type', value: 'Limiteur de remplissage' },
            { label: 'Modèle', value: 'Cleanfill-4GVF' },
            { label: 'Entrées', value: '4 entrées' },
            { label: 'Filtration', value: 'Intégrée' }
        ],
        features: ['Limiteur', 'Cleanfill', '4 entrées', 'Filtration', 'Grandes installations']
    },
    'solo-limiteur': {
        title: 'SOLO 3"-4" Limiteur',
        badge: 'Limiteurs',
        badgeColor: '#ff6b35',
        subtitle: 'Limiteur de remplissage SOLO en tailles 3" et 4". Conforme EN 13616. Dispositif universel de protection contre le débordement.',
        specs: [
            { label: 'Type', value: 'Limiteur de remplissage' },
            { label: 'Tailles', value: '3" et 4"' },
            { label: 'Norme', value: 'EN 13616' },
            { label: 'Compatibilité', value: 'Universelle' }
        ],
        features: ['SOLO', 'EN 13616', '3" et 4"', 'Universel', 'Anti-débordement']
    },
    'cleanfill-2p-adblue': {
        title: 'Cleanfill-2P AdBlue',
        badge: 'Limiteurs',
        badgeColor: '#ff6b35',
        subtitle: 'Limiteur de remplissage Cleanfill-2P dédié aux cuves AdBlue. Matériaux compatibles avec l\'urée pour une utilisation durable.',
        specs: [
            { label: 'Type', value: 'Limiteur de remplissage' },
            { label: 'Modèle', value: 'Cleanfill-2P' },
            { label: 'Produit', value: 'AdBlue / Urée' },
            { label: 'Matériaux', value: 'Compatibles urée' }
        ],
        features: ['Cleanfill', 'AdBlue', 'Compatible urée', 'Limiteur', 'Durable']
    },
    'cleanfill-2-biodiesel': {
        title: 'Cleanfill-2 Biodiesel',
        badge: 'Limiteurs',
        badgeColor: '#ff6b35',
        subtitle: 'Limiteur de remplissage Cleanfill-2 dédié au biodiesel. Matériaux et joints compatibles avec les biocarburants.',
        specs: [
            { label: 'Type', value: 'Limiteur de remplissage' },
            { label: 'Modèle', value: 'Cleanfill-2' },
            { label: 'Produit', value: 'Biodiesel' },
            { label: 'Compatibilité', value: 'Biocarburants' }
        ],
        features: ['Cleanfill', 'Biodiesel', 'Biocarburants', 'Limiteur', 'Compatible']
    },

    // ═══════════════════════════════════════
    // FUELING — RÉSERVOIRS DE STOCKAGE
    // ═══════════════════════════════════════
    'chassis-dalle': {
        title: 'Châssis-dalle de pose rapide',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Châssis-dalle pour la pose rapide de réservoirs. Fondation préfabriquée permettant une installation accélérée des cuves de stockage.',
        specs: [
            { label: 'Type', value: 'Châssis-dalle' },
            { label: 'Fonction', value: 'Pose rapide' },
            { label: 'Format', value: 'Préfabriqué' },
            { label: 'Usage', value: 'Support de réservoir' }
        ],
        features: ['Châssis-dalle', 'Pose rapide', 'Préfabriqué', 'Installation accélérée']
    },
    'reservoir-cyl-dp': {
        title: 'Réservoir cylindrique à double paroi',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Réservoir cylindrique à double paroi pour le stockage de carburant. Sécurité environnementale avec détection de fuite interstitielle.',
        specs: [
            { label: 'Type', value: 'Cylindrique enterré' },
            { label: 'Paroi', value: 'Double paroi' },
            { label: 'Sécurité', value: 'Détection fuite' },
            { label: 'Certification', value: 'Normes européennes' }
        ],
        features: ['Double paroi', 'Cylindrique', 'Détection fuite', 'Enterré', 'Sécurité']
    },
    'mobiltank-maxi': {
        title: 'Mobiltank (maxi)',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Station nomade Mobiltank en version maxi. Grand format Plug & Play pour la distribution mobile de carburant. Concept historique LAFON.',
        specs: [
            { label: 'Type', value: 'Station nomade' },
            { label: 'Version', value: 'Maxi' },
            { label: 'Concept', value: 'Plug & Play' },
            { label: 'Origine', value: 'Invention LAFON' }
        ],
        features: ['Mobiltank', 'Maxi', 'Nomade', 'Plug & Play', 'LAFON']
    },
    'mobiltank-mini': {
        title: 'Mobiltank (mini)',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Station nomade Mobiltank en version mini. Format compact et économique pour les petites installations de distribution mobile.',
        specs: [
            { label: 'Type', value: 'Station nomade' },
            { label: 'Version', value: 'Mini' },
            { label: 'Format', value: 'Compact' },
            { label: 'Coût', value: 'Économique' }
        ],
        features: ['Mobiltank', 'Mini', 'Compact', 'Économique', 'Nomade']
    },
    'reservoir-cyl-aerien-sp': {
        title: 'Réservoir cylindrique aérien SP',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Réservoir cylindrique aérien simple paroi. Cuve de stockage aérienne pour carburants, conforme aux normes en vigueur.',
        specs: [
            { label: 'Type', value: 'Cylindrique aérien' },
            { label: 'Paroi', value: 'Simple paroi' },
            { label: 'Installation', value: 'Aérienne' },
            { label: 'Normes', value: 'Conformes' }
        ],
        features: ['Aérien', 'Simple paroi', 'Cylindrique', 'Stockage carburant']
    },
    'reservoir-cyl-dp-mixte': {
        title: 'Réservoir cylindrique DP acier mixte',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Réservoir cylindrique à double paroi en acier mixte. Construction combinant acier et autres matériaux pour une durabilité optimale.',
        specs: [
            { label: 'Type', value: 'Cylindrique' },
            { label: 'Paroi', value: 'Double paroi mixte' },
            { label: 'Matériaux', value: 'Acier mixte' },
            { label: 'Durabilité', value: 'Optimale' }
        ],
        features: ['Double paroi', 'Acier mixte', 'Cylindrique', 'Durable']
    },
    'reservoir-cyl-aerien-d': {
        title: 'Réservoir cylindrique aérien D',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Réservoir cylindrique aérien type D. Cuve de stockage aérienne de grande capacité pour installations industrielles.',
        specs: [
            { label: 'Type', value: 'Cylindrique aérien' },
            { label: 'Version', value: 'Type D' },
            { label: 'Capacité', value: 'Grande' },
            { label: 'Usage', value: 'Industriel' }
        ],
        features: ['Aérien', 'Type D', 'Grande capacité', 'Industriel']
    },
    'mobiltank-iso': {
        title: 'Mobiltank ISO',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Station mobile Mobiltank en conteneur ISO. Format standardisé 10, 20 ou 40 pieds pour un transport et déploiement facilités.',
        specs: [
            { label: 'Type', value: 'Station mobile ISO' },
            { label: 'Format', value: 'Conteneur ISO 10/20/40 pi' },
            { label: 'Déploiement', value: 'Rapide — Plug & Play' },
            { label: 'Transport', value: 'Standardisé' }
        ],
        features: ['Mobiltank', 'ISO', 'Conteneur', 'Plug & Play', 'Transport standard']
    },
    'reservoir-enterre-inox': {
        title: 'Réservoir cylindrique enterré INOX DP acier',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Réservoir cylindrique enterré en INOX avec double paroi acier. Haute résistance à la corrosion pour un stockage durable et sécurisé.',
        specs: [
            { label: 'Type', value: 'Cylindrique enterré' },
            { label: 'Matériau', value: 'INOX + Double paroi acier' },
            { label: 'Résistance', value: 'Anti-corrosion' },
            { label: 'Sécurité', value: 'Stockage durable' }
        ],
        features: ['Enterré', 'INOX', 'Double paroi', 'Anti-corrosion', 'Durable']
    },
    'echelle-crinoline': {
        title: 'Échelle avec crinoline',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Échelle d\'accès avec crinoline de sécurité pour les réservoirs de stockage. Accès sécurisé en hauteur conforme aux normes de sécurité.',
        specs: [
            { label: 'Type', value: 'Échelle d\'accès' },
            { label: 'Sécurité', value: 'Crinoline intégrée' },
            { label: 'Usage', value: 'Accès réservoirs' },
            { label: 'Normes', value: 'Sécurité en hauteur' }
        ],
        features: ['Échelle', 'Crinoline', 'Sécurité', 'Accès en hauteur', 'Normes']
    },
    'cuves-vert-en12285': {
        title: 'Cuves verticales EN 12285-2',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Cuves verticales conformes à la norme européenne EN 12285-2. Simple enveloppe en acier pour le stockage aérien de carburant.',
        specs: [
            { label: 'Type', value: 'Cuve verticale' },
            { label: 'Norme', value: 'EN 12285-2' },
            { label: 'Enveloppe', value: 'Simple — Acier' },
            { label: 'Installation', value: 'Aérienne' }
        ],
        features: ['Verticale', 'EN 12285-2', 'Simple enveloppe', 'Acier', 'Aérienne']
    },
    'cuves-vert-nf86257': {
        title: 'Cuves verticales NF 86-257',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Cuves verticales cylindriques conformes à la norme NF 86-257. Fabrication acier pour le stockage de produits pétroliers.',
        specs: [
            { label: 'Type', value: 'Cuve verticale cylindrique' },
            { label: 'Norme', value: 'NF 86-257' },
            { label: 'Matériau', value: 'Acier' },
            { label: 'Contenu', value: 'Produits pétroliers' }
        ],
        features: ['Verticale', 'NF 86-257', 'Cylindrique', 'Acier', 'Produits pétroliers']
    },
    'ecotank': {
        title: 'Ecotank EN12285-2',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Ecotank conforme à la norme européenne EN12285-2. Point de distribution mobile privatif avec cuve intégrée.',
        specs: [
            { label: 'Type', value: 'Station mobile' },
            { label: 'Norme', value: 'EN 12285-2' },
            { label: 'Format', value: 'Ecotank' },
            { label: 'Usage', value: 'Distribution mobile' }
        ],
        features: ['Ecotank', 'EN 12285-2', 'Mobile', 'Privatif', 'Norme européenne']
    },
    'coffre-galva': {
        title: 'Coffre galva',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Coffre galvanisé pour la protection des équipements de distribution. Protection contre les intempéries et le vandalisme.',
        specs: [
            { label: 'Type', value: 'Coffre de protection' },
            { label: 'Matériau', value: 'Acier galvanisé' },
            { label: 'Protection', value: 'Intempéries & Vandalisme' },
            { label: 'Usage', value: 'Équipements distribution' }
        ],
        features: ['Coffre', 'Galvanisé', 'Protection', 'Intempéries', 'Vandalisme']
    },
    'reservoir-vert-12m3': {
        title: 'Réservoir vertical 12m³ + distribution',
        badge: 'Réservoirs',
        badgeColor: '#ff6b35',
        subtitle: 'Réservoir vertical de 12 m³ avec ensemble de distribution intégré. Solution clé en main combinant stockage et distribution.',
        specs: [
            { label: 'Type', value: 'Réservoir vertical' },
            { label: 'Capacité', value: '12 m³' },
            { label: 'Distribution', value: 'Ensemble intégré' },
            { label: 'Installation', value: 'Clé en main' }
        ],
        features: ['Vertical', '12 m³', 'Distribution intégrée', 'Clé en main']
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
    const modalPdfBtn = document.getElementById('modal-pdf-btn');

    modalBadge.textContent = product.badge;
    modalBadge.style.background = product.badgeColor || '#e63946';

    // Set image background based on category color
    const isLight = document.body.classList.contains('light-theme');
    if (product.badgeColor === '#4ecdc4') {
        modalImage.style.background = isLight
            ? 'linear-gradient(135deg, #e0f5f3, #c5e8e4)'
            : 'linear-gradient(135deg, #0a1a1a, #162e2e)';
    } else if (product.badgeColor === '#ff6b35') {
        modalImage.style.background = isLight
            ? 'linear-gradient(135deg, #f5ece0, #e8dcc5)'
            : 'linear-gradient(135deg, #1a1408, #2e2010)';
    } else if (product.badgeColor === '#3a86ff') {
        modalImage.style.background = isLight
            ? 'linear-gradient(135deg, #e0e8f5, #c5d5e8)'
            : 'linear-gradient(135deg, #0a1028, #16213e)';
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

    // PDF button
    const pdfFile = pdfFiles[productId];
    if (pdfFile && modalPdfBtn) {
        modalPdfBtn.style.display = 'inline-flex';
        modalPdfBtn.onclick = () => window.open(encodeURI(pdfFile), '_blank');
    } else if (modalPdfBtn) {
        modalPdfBtn.style.display = 'none';
    }

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
