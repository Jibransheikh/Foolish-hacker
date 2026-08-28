/* ── DEV SHORTCUT: index.html?game=<name|1-5> SKIPS INTRO, JUMPS INTO A LAYER ── */
(function () {
  const q = new URLSearchParams(location.search).get('game');
  if (!q) return;
  const games = {
    bricks: 'runGame1', 1: 'runGame1',
    duckhunt: 'runGame2', 2: 'runGame2',
    snake: 'runGame3', 3: 'runGame3',
    pong: 'runGame4', 4: 'runGame4',
    tumblers: 'runGame5', 5: 'runGame5'
  };
  const fn = window[games[q]];
  if (!fn) return;
  isDevSession = true;
  document.getElementById('pre-boot').classList.add('hidden');
  document.getElementById('terminal').classList.add('active');
  gs.style.display = 'flex';
  fn();
})();

/* ── DEV SANDBOX: BENTO LAUNCHER (type "DEV" at the name prompt) ── */
let devMode = 'normal';
let devMenuEl = null;

function showDevMenu() {
  setMood('[ ▓▒░ ]', 'var(--green)');
  setLayer(null);

  const wrap = document.createElement('div');
  wrap.className = 'dev-menu';
  wrap.innerHTML = `
    <div style="font-size:10px;font-weight:700;letter-spacing:.2em;color:var(--green);">// DEV SANDBOX</div>
    <div style="font-size:11px;color:var(--muted);margin-top:4px;">Launch any layer instantly. Story bypassed.</div>
    <div class="dev-mode">
      <button class="cbtn dev-mode-btn" data-mode="normal">NORMAL</button>
      <button class="cbtn dev-mode-btn" data-mode="pacifist">PACIFIST</button>
    </div>
    <div class="dev-grid"></div>
  `;
  const grid = wrap.querySelector('.dev-grid');

  const games = [
    { id: 'bricks',   n: '1', label: 'BRICK BLASTER',       icon: '▭' },
    { id: 'duckhunt', n: '2', label: 'DAEMON TARGET HUNT',  icon: '◎' },
    { id: 'snake',    n: '3', label: 'ROUTING WORM',        icon: '●' },
    { id: 'pong',     n: '4', label: 'KERNEL DEFLECTION',   icon: '▌' },
    { id: 'tumblers', n: '5', label: 'DECRYPTION TUMBLERS', icon: '≡' },
    { id: 'shawarma', n: '?', label: 'SHAWARMA LAYER',      icon: '🥙' }
  ];
  games.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'dev-card';
    btn.innerHTML = `<span class="dev-icon">${g.icon}</span><span class="dev-title">L${g.n} · ${g.label}</span>`;
    btn.onclick = () => devLaunch(g.id);
    grid.appendChild(btn);
  });

  const modeBtns = wrap.querySelectorAll('.dev-mode-btn');
  function paintMode() {
    modeBtns.forEach(mb => {
      const active = mb.dataset.mode === devMode;
      mb.style.borderColor = active ? 'var(--green)' : '';
      mb.style.color = active ? 'var(--green)' : '';
    });
  }
  modeBtns.forEach(mb => mb.onclick = () => { devMode = mb.dataset.mode; paintMode(); });
  paintMode();

  tc.appendChild(wrap); bot();
  devMenuEl = wrap;
}

function devLaunch(id) {
  if (devMenuEl) { devMenuEl.remove(); devMenuEl = null; }
  isDevSession = true;
  state.pacifist = devMode === 'pacifist';
  state.fails = 0; state.hardMode = false; state.easyMode = false;
  state.name = 'FOOL';
  toast(`DEV SANDBOX: ${devMode.toUpperCase()}`, 'var(--green)');
  gs.style.display = 'flex'; bot();
  mLeft.textContent = '◀ LEFT'; mRight.textContent = 'RIGHT ▶';
  showMobileControls(true);

  switch (id) {
    case 'bricks':
      setLayer(1); runGame1(); break;
    case 'duckhunt':
      setLayer(2); bindControls('hold'); runGame2(); break;
    case 'snake':
      setLayer(3); mLeft.textContent = '◀ TURN'; mRight.textContent = 'TURN ▶'; runGame3(); break;
    case 'pong':
      setLayer(4); mLeft.textContent = '▲ UP'; mRight.textContent = '▼ DOWN'; runGame4(); break;
    case 'tumblers':
      setLayer(5); bindControls('hold'); showMobileControls(false); runGame5(); break;
    case 'shawarma':
      setLayer('secret'); showMobileControls(true); runSecretGame(); break;
  }
}
