/* ── GAME 5: DECRYPTION TUMBLERS (WITH TIMER) ─────────────── */
function runGame5() {
  stopGame();
  const { w: W, h: H } = fitCanvas();
  let startTime = Date.now();
  
  let mult = gameMult();
  let tumblers = [
    { y: 80, speed: 4 * mult, tw: 80, tx: 0, cx: 50, dir: 1, locked: false, w: W-100, ox: 50 },
    { y: 140, speed: 6.5 * mult, tw: 50, tx: 0, cx: 50, dir: 1, locked: false, w: W-100, ox: 50 },
    { y: 200, speed: 9 * mult, tw: 30, tx: 0, cx: 50, dir: 1, locked: false, w: W-100, ox: 50 }
  ];
  
  tumblers.forEach(t => { t.tx = t.ox + 20 + Math.random() * (t.w - t.tw - 40); });

  let activeT = 0;
  clicked = false; gameKeys['Space'] = false;
  let flashRed = 0;
  let warned = false;

  function loop() {
    if (isPaused) return;
    ctx.fillStyle = '#08080f'; ctx.fillRect(0,0,W,H);
    
    let remain = 30 - Math.floor((Date.now() - startTime)/1000);
    if (remain === 10 && !warned) { warned = true; Speech.say("Avian overrun imminent."); }
    if (remain <= 0) { stopGame(); return badEnding(); }

    let tryLock = false;
    if (clicked || gameKeys['Space']) {
      tryLock = true; clicked = false; gameKeys['Space'] = false;
    }

    if (tryLock && activeT < 3) {
      let t = tumblers[activeT];
      let center = t.cx + 10; 
      if (center >= t.tx && center <= t.tx + t.tw) {
        Sfx.ping(); t.locked = true; activeT++;
      } else {
        Sfx.bloop(); flashRed = 12; 
      }
    }

    if (flashRed > 0) { ctx.fillStyle = 'rgba(248,113,113,0.15)'; ctx.fillRect(0,0,W,H); flashRed--; }

    for(let i=0; i<3; i++) {
      let t = tumblers[i];
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(t.ox, t.y, t.w, 20);
      ctx.strokeStyle = i === activeT ? '#22d3ee' : '#374151'; ctx.lineWidth = i === activeT ? 2 : 1; ctx.strokeRect(t.ox, t.y, t.w, 20);
      
      ctx.fillStyle = t.locked ? 'rgba(74,222,128,0.3)' : 'rgba(251,191,36,0.3)'; ctx.fillRect(t.tx, t.y, t.tw, 20);
      ctx.strokeStyle = t.locked ? '#4ade80' : '#fbbf24'; ctx.strokeRect(t.tx, t.y, t.tw, 20);

      if (!t.locked && i === activeT) {
        t.cx += t.speed * t.dir;
        if (t.cx > t.ox + t.w - 20 || t.cx < t.ox) t.dir *= -1;
      }
      ctx.fillStyle = t.locked ? '#4ade80' : (i === activeT ? '#22d3ee' : '#6b7280');
      ctx.fillRect(t.cx, t.y-4, 20, 28);
    }

    ctx.fillStyle = remain <= 10 ? '#f87171' : '#fbbf24';
    ctx.font = '14px monospace'; ctx.textAlign = 'center';
    ctx.fillText(`BROADCAST IN: ${remain}s`, W/2, 40);

    if (activeT >= 3) return winGame5();
    activeLoop = requestAnimationFrame(loop);
  }
  gameLoopFn = loop;
  activeLoop = requestAnimationFrame(loop);
}

