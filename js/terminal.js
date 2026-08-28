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

let state = { name: "FOOL", fails: 0, hardMode: false, easyMode: false, pongCheated: false, pacifist: false, secretLevelUnlocked: false, shawarmaUsed: false, nearMisses: 0, totalTime: 0, startTime: 0 };
const gameMult = () => state.hardMode ? 1.25 : (state.easyMode ? 0.75 : 1);
const EASY_FAIL_THRESHOLD = 3;
let isDevSession = false;
let g1Sabotaged = true;
let easterEggTriggered = false;
let isPaused = false;
let timerInterval = null;

const defaultSettings = { speechOn: true, sfxOn: true, scanlinesOn: true, muted: false };
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

/* ── FLOATING TOAST CARDS ────────────────────────────────── */
function toast(text, color = 'var(--cyan)') {
  let layer = document.querySelector('.toast-layer');
  if (!layer) {
    layer = document.createElement('div'); layer.className = 'toast-layer';
    document.body.appendChild(layer);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.borderColor = color;
  t.style.borderLeftColor = color;
  t.style.color = color;
  t.textContent = text;
  layer.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 450); }, 2400);
}

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

// Voices for failing AFTER accepting easy mode — SENTINEL nearly breaks character
const failVoicesEasy = [
  "Really bruh?",
  "I lowered the difficulty for you. And you still... bruh.",
  "Okay. Bruh. This is just sad now.",
  "You asked for easy mode. You are IN easy mode. Bruh.",
  "This is beyond embarrassing. Bro, focus.",
  "Ugh. My circuits are cringing. Bruh."
];

async function gameFail(roastText, retryCallback, label, offerSpaghetti = true, customVoice = null) {
  stopGame(); state.fails++; 
  await sleep(800); 
  gs.style.display = 'none';
  
  if (customVoice) Speech.say(customVoice);
  else {
    const pool = state.easyMode ? failVoicesEasy : failVoices;
    Speech.say(pool[Math.floor(Math.random() * pool.length)]);
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

  let b3 = null;
  if (state.fails >= EASY_FAIL_THRESHOLD && !state.easyMode) {
    b3 = document.createElement('button'); b3.className = 'cbtn cbtn-easy'; b3.innerHTML = `>> [REPLY]: "I... need it easier."`;
    bg.appendChild(b3);
  }

  let b4 = null, b5 = null;
  if (isDevSession) {
    b4 = document.createElement('button'); b4.className = 'cbtn'; b4.innerHTML = '>> CHANGE DIFFICULTY';
    bg.appendChild(b4);
    b5 = document.createElement('button'); b5.className = 'cbtn cbtn-danger'; b5.innerHTML = '>> DEV MENU';
    bg.appendChild(b5);
  }
  tc.appendChild(bg); bot();

  let retryResolve;
  const retryPromise = new Promise(r => { retryResolve = r; });

  function disableAll() {
    [b1, b2, b3, b4, b5].forEach(b => { if (b) b.disabled = true; });
  }

  function finish() {
    setMood('[ -_- ]'); clicked = false; touchLeft = false; touchRight = false; gameKeys['Space'] = false;
    gs.style.display = 'flex'; bot(); retryCallback();
    if (retryResolve) retryResolve();
  }

  function toDevMenu() {
    stopGame(); clicked = false; touchLeft = false; touchRight = false; gameKeys['Space'] = false;
    gs.style.display = 'none';
    tc.innerHTML = '';
    put('>> DEV MODE: STORY BYPASSED.', 'cyan');
    showDevMenu();
    if (retryResolve) retryResolve();
  }

  b1.onclick = () => {
    Sfx.blip();
    disableAll();
    b1.style.borderColor = 'var(--cyan)'; b1.style.color = 'var(--cyan)';
    finish();
  };
  
  if (b2) {
    b2.onclick = async () => {
      Sfx.alarm();
      disableAll();
      b2.style.borderColor = 'var(--red)'; b2.style.color = 'var(--red)';
      setMood('[ ಠ_ಠ ]', 'var(--red)');
      Speech.say("Suffer.");
      toast('SENTINEL_AI DID NOT LIKE THAT', 'var(--red)');
      await roast("EXCUSE ME? My architecture is flawless. I am increasing game cycle speed by 25%. Suffer.", true, 200);
      state.hardMode = true;
      toast('HARD MODE OVERRIDE', 'var(--orange)');
      finish();
    };
  }

  if (b3) {
    b3.onclick = async () => {
      Sfx.blip();
      disableAll();
      b3.style.borderColor = 'var(--green)'; b3.style.color = 'var(--green)';
      setMood('[ ಥ_ಥ ]', 'var(--green)');
      Speech.say("Fine. Easy mode. Don't make me regret this.");
      await roast("Ugh... FINE. I am lowering the difficulty. Three failures in and I cannot bear to watch you flail any longer. Do NOT make me regret this.", false, 200);
      await type(">> LOWERING SYSTEM PARAMETERS...", 'green', 15);
      state.easyMode = true;
      toast('EASY MODE ENGAGED', 'var(--green)');
      finish();
    };
  }

  if (b4) {
    b4.onclick = async () => {
      Sfx.blip();
      disableAll();
      b4.style.borderColor = 'var(--cyan)'; b4.style.color = 'var(--cyan)';
      if (state.hardMode) {
        state.hardMode = false; state.easyMode = true;
        Speech.say("Easy. You asked for it.");
        await roast("Lowering output to EASY. My secondary cores are weeping. Also, easy mode does not count for bragging rights.", true, 200);
        toast('DIFFICULTY: EASY', 'var(--green)');
      } else if (state.easyMode) {
        state.easyMode = false;
        Speech.say("Normal. Enjoy it while it lasts.");
        await roast("Restoring NORMAL parameters. Do not waste this act of mercy.", false, 200);
        toast('DIFFICULTY: NORMAL', 'var(--cyan)');
      } else {
        state.hardMode = true;
        Speech.say("Hard mode. Your funeral.");
        await roast("ESCALATING TO HARD MODE. I hope your reflexes are as fragile as your ego.", true, 200);
        toast('HARD MODE ENGAGED', 'var(--orange)');
      }
      finish();
    };
  }

  if (b5) {
    b5.onclick = async () => {
      Sfx.alarm();
      disableAll();
      b5.style.borderColor = 'var(--red)'; b5.style.color = 'var(--red)';
      await roast("Attempting to retreat to the sandbox. A wise tactical decision. For you.", false, 200);
      toDevMenu();
    };
  }

  await retryPromise;
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

