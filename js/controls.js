/* ── GAME ENGINE HELPERS & CONTROLS ─────────────────────── */
let activeLoop = null;
let gameKeys = {};
let touchLeft = false, touchRight = false;
const IS_TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;

window.addEventListener('keydown', e => {
  gameKeys[e.code] = true;
  const tag = (e.target && e.target.tagName) || '';
  if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code) && tag !== 'INPUT' && tag !== 'TEXTAREA') e.preventDefault();
});
window.addEventListener('keyup', e => gameKeys[e.code] = false);

function fitCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = gc.clientWidth, h = gc.clientHeight;
  cvs.width = Math.round(w * dpr);
  cvs.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}
window.addEventListener('resize', () => { if (cvs.width) fitCanvas(); });

function bindControls(mode, tapTurnFn) {
  [mLeft, mRight].forEach(b => {
    b.onpointerdown = null; b.onpointerup = null; b.onpointercancel = null; b.onpointerleave = null;
    b.onclick = null; b.onmousedown = null; b.onmouseup = null; b.ontouchstart = null; b.ontouchend = null;
  });
  touchLeft = touchRight = false;
  mLeft.oncontextmenu = mRight.oncontextmenu = e => e.preventDefault();
  if (mode === 'hold') {
    mLeft.onpointerdown = () => { touchLeft = true; };
    mLeft.onpointerup = mLeft.onpointercancel = mLeft.onpointerleave = () => { touchLeft = false; };
    mRight.onpointerdown = () => { touchRight = true; };
    mRight.onpointerup = mRight.onpointercancel = mRight.onpointerleave = () => { touchRight = false; };
  } else if (mode === 'tap-turn') {
    mLeft.onpointerdown = () => tapTurnFn(-1);
    mRight.onpointerdown = () => tapTurnFn(1);
  }
}

function showMobileControls(show) {
  if (!IS_TOUCH) return;
  mobControls.style.display = show ? 'flex' : 'none';
}
if (!IS_TOUCH) mobControls.style.display = 'none';

const SWIPE_MIN = 24;
let swipeHandler = null, swipeOrigin = null;
cvs.addEventListener('pointerdown', e => { swipeOrigin = { x: e.clientX, y: e.clientY }; });
cvs.addEventListener('pointermove', e => {
  if (!swipeOrigin || !swipeHandler) return;
  const dx = e.clientX - swipeOrigin.x, dy = e.clientY - swipeOrigin.y;
  if (Math.hypot(dx, dy) < SWIPE_MIN) return;
  swipeOrigin = null;
  swipeHandler(dx, dy);
});
cvs.addEventListener('pointerup', () => swipeOrigin = null);
cvs.addEventListener('pointercancel', () => swipeOrigin = null);

let mouseX = 0, mouseY = 0, clicked = false;
cvs.addEventListener('mousemove', e => { const r = cvs.getBoundingClientRect(); mouseX = e.clientX - r.left; mouseY = e.clientY - r.top; });
cvs.addEventListener('mousedown', () => clicked = true);
cvs.addEventListener('touchstart', e => { const r = cvs.getBoundingClientRect(); mouseX = e.touches[0].clientX - r.left; mouseY = e.touches[0].clientY - r.top; clicked = true; });

function stopGame() {
  if (activeLoop) cancelAnimationFrame(activeLoop);
  gameKeys = {};
  touchLeft = touchRight = false;
  clicked = false;
  swipeHandler = null;
  swipeOrigin = null;
}

