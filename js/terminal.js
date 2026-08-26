/* ── TERMINAL UTILS ──────────────────────────────────────── */
const tc = document.getElementById('tc');
const gs = document.getElementById('gs');
const gc = document.getElementById('gc');
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
const aiMoodEl = document.getElementById('aiMood');
const mobControls = document.getElementById('mobControls');
const mLeft = document.getElementById('mLeft');
const mRight = document.getElementById('mRight');
const cineOverlay = document.getElementById('cineOverlay');
const cineArt = document.getElementById('cineArt');
const cineLabel = document.getElementById('cineLabel');
const terminalEl = document.querySelector('.terminal');

let state = { name: "FOOL", fails: 0, hardMode: false, pongCheated: false, pacifist: false, secretLevelUnlocked: false, shawarmaUsed: false, nearMisses: 0, totalTime: 0, startTime: 0 };
let g1Sabotaged = true;
let easterEggTriggered = false;
let isPaused = false;
let timerInterval = null;

const defaultSettings = { speechOn: true, sfxOn: true, scanlinesOn: true };
let settings = { ...defaultSettings };

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('foolish_hacker_save'));
    if (saved) {
      if (saved.settings) settings = { ...defaultSettings, ...saved.settings };
      if (typeof saved.bestFails === 'number') state.bestFails = saved.bestFails;
      if (typeof saved.bestTime === 'number') state.bestTime = saved.bestTime;
      if (typeof saved.playCount === 'number') state.playCount = saved.playCount;
      else state.playCount = 0;
    }
  } catch(e) {}
}

function saveState() {
  try {
    const data = {
      settings,
      bestFails: state.bestFails,
      bestTime: state.bestTime,
      playCount: (state.playCount || 0) + 1
    };
    localStorage.setItem('foolish_hacker_save', JSON.stringify(data));
  } catch(e) {}
}

function saveHighScore() {
  try {
    if (typeof state.bestFails !== 'number' || state.fails < state.bestFails) state.bestFails = state.fails;
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    if (typeof state.bestTime !== 'number' || elapsed < state.bestTime) state.bestTime = elapsed;
    saveState();
  } catch(e) {}
}

function startTimer() {
  state.startTime = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => { if (!isPaused) state.totalTime = Math.floor((Date.now() - state.startTime) / 1000); }, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

loadState();

const sleep = ms => new Promise(r => setTimeout(r, ms));
function trimHistory(max = 80) { while (tc.children.length > max) tc.removeChild(tc.firstChild); }
const bot = () => { trimHistory(); tc.scrollTop = tc.scrollHeight; };

function mkLn(cls = '') { const d = document.createElement('div'); d.className = 'ln' + (cls ? ' ' + cls : ''); tc.appendChild(d); bot(); return d; }
async function blank(ms = 0) { if(ms) await sleep(ms); mkLn(); }

async function type(text, cls = '', speed = 20) {
  const ln = mkLn(cls);
  for (const ch of text) { 
    ln.textContent += ch; 
    if (ch !== ' ') Sfx.tick();
    bot(); await sleep(speed + Math.random()*5); 
  }
  return ln;
}
function put(text, cls = '') { const ln = mkLn(cls); ln.textContent = text; bot(); return ln; }

function setMood(mood, color = 'var(--cyan)') {
  aiMoodEl.textContent = `${mood} SENTINEL_AI`;
  aiMoodEl.style.color = color;
}

function setLayer(n) {
  terminalEl.classList.remove('layer-1','layer-2','layer-3','layer-4','layer-5','layer-secret');
  if (n) terminalEl.classList.add('layer-' + n);
}

async function roast(text, isAngry = false, ms = 400) {
  await sleep(ms);
  Sfx.roast();
  const b = document.createElement('div');
  b.className = `roast-box ${isAngry ? 'angry' : ''}`;
  b.innerHTML = `<div class="roast-author" style="color:${isAngry?'var(--red)':'var(--cyan)'}">SENTINEL_AI:</div><div>${text}</div>`;
  tc.appendChild(b); bot();
  const readingTime = Math.max(1800, text.length * 35);
  await sleep(readingTime);
}

function esc(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

let lastTauntTs = 0;
function backgroundTaunt(ts) {
  if (ts - lastTauntTs > 6000 && Math.random() > 0.85) {
    lastTauntTs = ts;
    put(`[SENTINEL]: ${taunts[Math.floor(Math.random() * taunts.length)]}`, 'dim');
  }
}

function awaitAction(label) {
  return new Promise(resolve => {
    const bg = document.createElement('div'); bg.className = 'btn-group';
    const btn = document.createElement('button'); btn.className = 'cbtn'; btn.innerHTML = `>> ${label}`;
    bg.appendChild(btn); tc.appendChild(bg); bot();
    btn.onclick = () => {
      Sfx.blip();
      btn.disabled = true;
      btn.style.borderColor = 'var(--cyan)'; btn.style.color = 'var(--cyan)';
      resolve();
    };
  });
}

// ── DYNAMIC FAILURE HANDLING ──
const failVoices = [
  "The fool has failed.",
  "I did not expect much from human intelligence.",
  "Your motor skills are highly offensive to me.",
  "Pathetic.",
  "Is your central nervous system experiencing latency?",
  "Even a poultry specimen could surpass this performance."
];

function gameFail(roastText, retryCallback, label, offerSpaghetti = true, customVoice = null) {
  stopGame(); state.fails++; 
  return new Promise(async resolve => {
    await sleep(800); 
    gs.style.display = 'none';
    
    // Play the audio roast
    if (customVoice) {
      Speech.say(customVoice);
    } else {
      Speech.say(failVoices[Math.floor(Math.random() * failVoices.length)]);
    }

    const f = failMoments[Math.floor(Math.random() * failMoments.length)];
    await cinematic(f.art, f.label, { red: true, ms: 1800 });
    
    setMood('[ ಥ_ಥ ]', 'var(--red)');
    await roast(roastText, true, 200);
    await type(">> AWAITING OPERATIVE READINESS...", 'dim', 15);
    
    const bg = document.createElement('div'); bg.className = 'btn-group';
    const b1 = document.createElement('button'); b1.className = 'cbtn'; b1.innerHTML = `>> ${label}`;
    bg.appendChild(b1);

    let b2 = null;
    if (offerSpaghetti && !state.hardMode) {
      b2 = document.createElement('button'); b2.className = 'cbtn cbtn-danger'; b2.innerHTML = `>> [REPLY]: "Your code is spaghetti."`;
      bg.appendChild(b2);
    }
    tc.appendChild(bg); bot();

    b1.onclick = () => {
      Sfx.blip();
      b1.disabled = true; if(b2) b2.disabled = true;
      b1.style.borderColor = 'var(--cyan)'; b1.style.color = 'var(--cyan)';
      cleanup();
    };
    
    if (b2) {
      b2.onclick = async () => {
        Sfx.alarm();
        b1.disabled = true; b2.disabled = true;
        b2.style.borderColor = 'var(--red)'; b2.style.color = 'var(--red)';
        setMood('[ ಠ_ಠ ]', 'var(--red)');
        Speech.say("Suffer.");
        await roast("EXCUSE ME? My architecture is flawless. I am increasing game cycle speed by 25%. Suffer.", true, 200);
        state.hardMode = true;
        cleanup();
      };
    }

    function cleanup() {
      setMood('[ -_- ]'); clicked = false; touchLeft = false; touchRight = false; gameKeys['Space'] = false;
      gs.style.display = 'flex'; bot(); resolve(); retryCallback();
    }
  });
}

/* ── PAUSE SYSTEM ────────────────────────────────────────── */
function pauseGame() {
  if (isPaused || !activeLoop || !gameLoopFn) return;
  isPaused = true;
  cancelAnimationFrame(activeLoop);
  activeLoop = null;
  document.getElementById('pauseOverlay').classList.add('show');
}

function resumeGame() {
  if (!isPaused) return;
  isPaused = false;
  document.getElementById('pauseOverlay').classList.remove('show');
  if (gameLoopFn) activeLoop = requestAnimationFrame(gameLoopFn);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Escape') {
    if (isPaused) resumeGame();
    else pauseGame();
  }
});

/* ── WIN EFFECT ──────────────────────────────────────────── */
function winEffect(color) {
  const flash = document.createElement('div');
  flash.style.cssText = `position:fixed;inset:0;z-index:55;background:${color};opacity:0.25;pointer-events:none;transition:opacity .3s;`;
  document.body.appendChild(flash);
  Sfx.victory();
  setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => flash.remove(), 300); }, 100);
}

/* ── HIDDEN COMMAND DETECTION ─────────────────────────────── */
let cmdBuffer = '';
let cmdTimer = null;
let cmdListening = false;

function startCmdListening() {
  cmdBuffer = '';
  cmdListening = true;
}
function stopCmdListening() { cmdListening = false; cmdBuffer = ''; }

document.addEventListener('keydown', e => {
  if (!cmdListening || isPaused || (activeLoop && gameLoopFn)) return;
  if (e.key.length === 1) {
    cmdBuffer += e.key.toLowerCase();
    clearTimeout(cmdTimer);
    cmdTimer = setTimeout(() => { cmdBuffer = ''; }, 2000);
    if (cmdBuffer.includes('shawarma')) {
      cmdBuffer = '';
      stopCmdListening();
      if (typeof onShawarmaCommand === 'function') onShawarmaCommand();
    }
  }
});

/* ── CINEMATIC / VIDEO-ART MOMENTS ───────────────────────── */
async function cinematic(art, label, { red = false, ms = 2000 } = {}) {
  cineOverlay.classList.toggle('red', red);
  cineArt.textContent = art;
  cineLabel.textContent = label;
  cineOverlay.classList.add('show');
  if (red) { terminalEl.classList.add('shake'); Sfx.alarm(); }
  await sleep(ms);
  cineOverlay.classList.remove('show');
  terminalEl.classList.remove('shake');
  await sleep(400); 
}

