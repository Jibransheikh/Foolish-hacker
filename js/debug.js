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
  document.getElementById('pre-boot').classList.add('hidden');
  document.getElementById('terminal').classList.add('active');
  gs.style.display = 'flex';
  fn();
})();
