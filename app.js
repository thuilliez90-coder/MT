/* ═══════════════════════════════════════════════════════════════
   MADIC TOUCHSCREEN — APPLICATION
   Navigation, carousel, animations, inactivity screensaver
   ═══════════════════════════════════════════════════════════════ */

// ── STATE ──
let currentScreen = 'screen-home';
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 120000; // 2 minutes

// ── NAVIGATION ──
function navigateTo(targetId) {
    if (targetId === currentScreen) return;

    const current = document.getElementById(currentScreen);
    const target = document.getElementById(targetId);

    if (!current || !target) return;

    // Exit animation on current
    current.classList.add('exit-left');
    current.classList.remove('active');

    // Enter animation on target
    target.scrollTop = 0;
    target.classList.add('active');

    // Clean up after transition
    setTimeout(() => {
        current.classList.remove('exit-left');
    }, 500);

    currentScreen = targetId;
    resetInactivityTimer();

    // Trigger stat counter animation on home
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

// ── FILTER CARDS (Station-service sub-nav) ──
function filterCards(category, btn) {
    // Update active button
    document.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter carousel cards
    const cards = document.querySelectorAll('#station-carousel .carousel-card');
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
            // Ease out cubic
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
        // Go back to home on wake
        navigateTo('screen-home');
    }
}

// Listen for any interaction to reset timer
['touchstart', 'mousedown', 'mousemove', 'keydown'].forEach(event => {
    document.addEventListener(event, () => {
        resetInactivityTimer();
    }, { passive: true });
});

// Screensaver click to dismiss
document.getElementById('screensaver')?.addEventListener('click', () => {
    hideScreensaver();
    navigateTo('screen-home');
});

document.getElementById('screensaver')?.addEventListener('touchstart', () => {
    hideScreensaver();
    navigateTo('screen-home');
}, { passive: true });

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    // Start counter animation
    setTimeout(animateCounters, 600);

    // Start inactivity timer
    resetInactivityTimer();

    // Make home screen clickable to enter
    const homeScreen = document.getElementById('screen-home');
    if (homeScreen) {
        homeScreen.addEventListener('click', (e) => {
            // Only trigger if not clicking a button
            if (!e.target.closest('button') && !e.target.closest('.cta-main')) {
                navigateTo('screen-menu');
            }
        });
    }

    // Prevent context menu on long press (kiosk mode)
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});
