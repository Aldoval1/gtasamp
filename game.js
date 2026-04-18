const GEMINI_API_KEY = "AIzaSyBjWrzmvercTNk-GwvteLmNi_gUR8LbK-o";
const ADMIN_PASSWORD = "Lemon1429!";

// --- Global State ---
let state = {
    health: 50,
    economy: 50,
    hope: 50,
    security: 50,
    milestones: { work: false, court: false, greencard: false, citizen: false },
    aiEnabled: true
};

// Database structure for cards
let db = {
    cards: []
};

// Default fallback cards if AI is disabled or fails
const defaultCards = [
    {
        title: "Medical Bill",
        desc: "You received a high hospital bill. Pay it or ignore it?",
        svg: `<svg viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="none" stroke="black" stroke-width="4"/><path d="M50 30 L50 70 M30 50 L70 50" stroke="black" stroke-width="4"/></svg>`,
        left: { effect: { health: -20, economy: 0 } }, // Ignore: lose health
        right: { effect: { health: 0, economy: -20 } } // Pay: lose money
    },
    {
        title: "Job Offer",
        desc: "An unofficial job offer with high pay but risks.",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke="black" stroke-width="4"/><path d="M40 50 L50 60 L60 40" stroke="black" stroke-width="4"/></svg>`,
        left: { effect: { economy: -10, security: 10 } }, // Reject
        right: { effect: { economy: 20, security: -20 } } // Accept
    }
];

// Load from localStorage
function initDB() {
    const savedDB = localStorage.getItem('limboDB');
    if (savedDB) {
        db = JSON.parse(savedDB);
    }
    if (db.cards.length === 0) {
        db.cards = [...defaultCards];
        saveDB();
    }
}

function saveDB() {
    localStorage.setItem('limboDB', JSON.stringify(db));
}

// --- Status Management ---
function updateUI() {
    document.getElementById('bar-health').style.width = `${state.health}%`;
    document.getElementById('bar-economy').style.width = `${state.economy}%`;
    document.getElementById('bar-hope').style.width = `${state.hope}%`;
    document.getElementById('bar-security').style.width = `${state.security}%`;

    if (state.milestones.work) document.getElementById('ms-work').classList.add('achieved');
    if (state.milestones.court) document.getElementById('ms-court').classList.add('achieved');
    if (state.milestones.greencard) document.getElementById('ms-greencard').classList.add('achieved');
    if (state.milestones.citizen) document.getElementById('ms-citizen').classList.add('achieved');

    checkGameOver();
}

function applyEffect(effect) {
    if (effect.health) state.health = Math.max(0, Math.min(100, state.health + effect.health));
    if (effect.economy) state.economy = Math.max(0, Math.min(100, state.economy + effect.economy));
    if (effect.hope) state.hope = Math.max(0, Math.min(100, state.hope + effect.hope));
    if (effect.security) state.security = Math.max(0, Math.min(100, state.security + effect.security));
    updateUI();
}

function checkGameOver() {
    if (state.health <= 0 || state.economy <= 0 || state.hope <= 0 || state.security <= 0) {
        document.getElementById('modal-gameover').classList.add('mostrar');
    } else if (state.milestones.work && state.milestones.court && state.milestones.greencard && state.milestones.citizen) {
        document.getElementById('modal-victory').classList.add('mostrar');
    }
}

// --- Card Logic & Swipe ---
const cardEl = document.getElementById('active-card');
const swipeLeftInd = document.getElementById('swipe-left');
const swipeRightInd = document.getElementById('swipe-right');
let currentCard = null;

let isDragging = false;
let startX = 0;
let currentX = 0;
const SWIPE_THRESHOLD = 100;

cardEl.addEventListener('mousedown', dragStart);
cardEl.addEventListener('touchstart', dragStart, {passive: true});

window.addEventListener('mousemove', dragMove);
window.addEventListener('touchmove', dragMove, {passive: false});

window.addEventListener('mouseup', dragEnd);
window.addEventListener('touchend', dragEnd);

function dragStart(e) {
    if (e.target.closest('#admin-overlay')) return; // Ignore admin clicks
    isDragging = true;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    cardEl.style.transition = 'none';
}

function dragMove(e) {
    if (!isDragging) return;
    const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    currentX = x - startX;

    // Rotate and translate
    const rotate = currentX * 0.05;
    cardEl.style.transform = `translate(${currentX}px, 0) rotate(${rotate}deg)`;

    // Show indicators
    if (currentX > 50) {
        swipeRightInd.style.opacity = 1;
        swipeLeftInd.style.opacity = 0;
    } else if (currentX < -50) {
        swipeLeftInd.style.opacity = 1;
        swipeRightInd.style.opacity = 0;
    } else {
        swipeLeftInd.style.opacity = 0;
        swipeRightInd.style.opacity = 0;
    }
}

function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    cardEl.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    swipeLeftInd.style.opacity = 0;
    swipeRightInd.style.opacity = 0;

    if (currentX > SWIPE_THRESHOLD) {
        handleSwipe('right');
    } else if (currentX < -SWIPE_THRESHOLD) {
        handleSwipe('left');
    } else {
        cardEl.style.transform = 'translate(0, 0) rotate(0deg)';
    }
    currentX = 0;
}

function handleSwipe(dir) {
    // Animate out
    cardEl.style.transform = `translate(${dir === 'right' ? '100vw' : '-100vw'}, 0) rotate(${dir === 'right' ? '30deg' : '-30deg'})`;

    // Apply effects
    if (currentCard) {
        if (dir === 'right') applyEffect(currentCard.right.effect);
        else applyEffect(currentCard.left.effect);
    }

    // Load next after animation
    setTimeout(() => {
        cardEl.style.transition = 'none';
        cardEl.style.transform = 'translate(0, -100vh) rotate(0deg)';
        loadNextCard();
    }, 300);
}

async function loadNextCard() {
    if (state.aiEnabled) {
        document.getElementById('card-title').textContent = "Generando...";
        document.getElementById('card-desc').textContent = "Esperando al sistema...";
        document.getElementById('card-image').innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="none" stroke="black" stroke-width="4" stroke-dasharray="31.4 31.4"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite"/></circle></svg>`;

        cardEl.style.transition = 'transform 0.5s ease';
        cardEl.style.transform = 'translate(0, 0) rotate(0deg)';

        const newCard = await generateCardWithAI();
        if (newCard) {
            db.cards.push(newCard);
            saveDB();
            currentCard = newCard;
        } else {
            // Fallback
            currentCard = db.cards[Math.floor(Math.random() * db.cards.length)];
        }
    } else {
        currentCard = db.cards[Math.floor(Math.random() * db.cards.length)];
    }

    renderCard(currentCard);

    // Animate in if not already done
    cardEl.style.transition = 'transform 0.5s ease';
    cardEl.style.transform = 'translate(0, 0) rotate(0deg)';
}

function renderCard(card) {
    document.getElementById('card-title').textContent = card.title;
    document.getElementById('card-desc').textContent = card.desc;
    document.getElementById('card-image').innerHTML = card.svg;
}

// --- Gemini AI Integration ---
async function generateCardWithAI() {
    const prompt = `Generate a JSON object for a 2D game card. The game is about the legal limbo of immigrants.
The card should present a daily life or legal challenge.
The JSON must have the following structure exactly:
{
    "title": "Short Title",
    "desc": "A short scenario description.",
    "svg": "<svg viewBox='0 0 100 100'>...</svg>", // A pure black-and-white simple SVG drawing using stroke='black' and fill='none'. Max 3 simple shapes/paths.
    "left": { "effect": { "health": -10, "economy": 0, "hope": 0, "security": 10 } }, // Rejecting
    "right": { "effect": { "health": 10, "economy": -20, "hope": 10, "security": -10 } } // Accepting
}
Do not include markdown or backticks. Return ONLY the raw JSON string. Effects must be integers between -30 and 30. Ensure it's valid JSON.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();

        if (!data || !data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
            console.error("AI API Error: Invalid response structure", data);
            logAdmin(`[AI ERROR] Invalid response structure`);
            return null;
        }

        const jsonStr = data.candidates[0].content.parts[0].text;
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("AI Generation failed:", e);
        logAdmin(`[AI ERROR] ${e.message}`);
        return null;
    }
}

// --- Admin Console ---
let adminMode = false;
let adminAuthed = false;
const adminOverlay = document.getElementById('admin-overlay');
const adminInput = document.getElementById('admin-input');
const adminLog = document.getElementById('admin-log');

window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !adminMode && document.activeElement !== adminInput) {
        e.preventDefault();
        adminMode = true;
        adminOverlay.style.display = 'flex';
        adminInput.focus();
    } else if (e.key === 'Escape' && adminMode) {
        adminMode = false;
        adminOverlay.style.display = 'none';
        adminAuthed = false;
        adminLog.innerHTML = '<div>[SYSTEM] Ingrese contraseña:</div>';
        adminInput.value = '';
    }
});

adminInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const val = adminInput.value.trim();
        adminInput.value = '';
        if (!val) return;

        if (!adminAuthed) {
            if (val === ADMIN_PASSWORD) {
                adminAuthed = true;
                logAdmin('[SYSTEM] Access Granted. Commands: enableai, disableai, deletecard');
            } else {
                logAdmin('[SYSTEM] Access Denied.');
                setTimeout(() => {
                    adminMode = false;
                    adminOverlay.style.display = 'none';
                }, 1000);
            }
        } else {
            handleAdminCommand(val);
        }
    }
});

function logAdmin(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    adminLog.appendChild(div);
    adminLog.scrollTop = adminLog.scrollHeight;
}

function handleAdminCommand(cmd) {
    logAdmin(`> ${cmd}`);
    if (cmd === 'enableai') {
        state.aiEnabled = true;
        logAdmin('[OK] AI Enabled.');
    } else if (cmd === 'disableai') {
        state.aiEnabled = false;
        logAdmin('[OK] AI Disabled.');
    } else if (cmd === 'deletecard') {
        if (db.cards.length > defaultCards.length) {
            db.cards.pop();
            saveDB();
            logAdmin('[OK] Last generated card deleted.');
        } else {
            logAdmin('[ERR] No generated cards to delete.');
        }
    } else {
        logAdmin('[ERR] Unknown command.');
    }
}

// --- Init ---
initDB();
updateUI();
loadNextCard();

// Buttons
document.getElementById('btn-restart').addEventListener('click', () => location.reload());
document.getElementById('btn-victory-restart').addEventListener('click', () => location.reload());
