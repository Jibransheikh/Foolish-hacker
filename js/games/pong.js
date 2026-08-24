/* ── GAME 4: PONG VS AI (AI CHEATS) ──────────────────────── */
function runGame4() {
  stopGame(); bindControls('hold');
  const { w: W, h: H } = fitCanvas();
  let mult = state.hardMode ? 1.25 : 1;
  let py = H/2 - 25, ay = H/2 - 25;
  let ph = 50, ah = 50;
  let bx = W/2, by = H/2, bvx = 4.5 * mult, bvy = 4.5 * mult;
  let pScore = 0, aScore = 0;
  state.pongCheated = false;

  function loop() {
    ctx.fillStyle = '#08080f'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth=2; ctx.beginPath(); ctx.setLineDash([8,8]);
    ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke(); ctx.setLineDash([]);

    if(gameKeys['ArrowUp'] || gameKeys['KeyW'] || touchLeft) py -= 5.5 * mult;
    if(gameKeys['ArrowDown'] || gameKeys['KeyS'] || touchRight) py += 5.5 * mult;
    py = Math.max(0, Math.min(H-ph, py));
    
    if (pScore === 2 && !state.pongCheated) {
      Sfx.alarm();
      Speech.say("The house always wins.");
      state.pongCheated = true;
      ph = 20; ah = 140; ay = H/2 - 70;
      setMood('[ ಠ_ಠ ]', 'var(--red)');
      put(">> SENTINEL_AI HAS OVERRIDDEN PADDLE CONSTRAINTS.", 'red');
      put(">> 'ENOUGH. THE HOUSE ALWAYS WINS.'", 'red');
    }

    ay += (by - (ay + ah/2)) * (state.pongCheated ? 0.2 : 0.1);
    ay = Math.max(0, Math.min(H-ah, ay));

    bx += bvx; by += bvy;
    if(by < 0 || by > H) { Sfx.bloop(); bvy *= -1; }
    
    if(bx < 30 && by > py && by < py+ph) { Sfx.bloop(); bvx = Math.abs(bvx)*1.08; bx = 30; bvy += (by - (py+ph/2))*0.08; }
    if(bx > W-30 && by > ay && by < ay+ah) { Sfx.bloop(); bvx = -Math.abs(bvx)*1.08; bx = W-30; bvy += (by - (ay+ah/2))*0.08; }

    if(bx < 0) { Sfx.ping(); aScore++; bx=W/2; by=H/2; bvx=4.5*mult; bvy=2.5*mult; }
    if(bx > W) { Sfx.ping(); pScore++; bx=W/2; by=H/2; bvx=-4.5*mult; bvy=2.5*mult; }

    ctx.fillStyle = '#22d3ee'; ctx.fillRect(16, py, 10, ph);
    ctx.fillStyle = '#f87171'; ctx.fillRect(W-26, ay, 10, ah);
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(bx-4, by-4, 8, 8);

    ctx.font = '22px monospace';
    ctx.fillStyle = '#22d3ee'; ctx.fillText(pScore, W/2 - 36, 35);
    ctx.fillStyle = '#f87171'; ctx.fillText(aScore, W/2 + 20, 35);

    if (aScore >= 3) return gameFail("Even with 0.0004% of my secondary core processing power, you still lost. Pathetic.", runGame4, 'RESTART LAYER 4', true);
    if (pScore >= 3) return winGame4();
    activeLoop = requestAnimationFrame(loop);
  }
  activeLoop = requestAnimationFrame(loop);
}

async function winGame4() {
  stopGame(); await sleep(1000); gs.style.display = 'none';
  
  setMood('[ ಠ_ಠ ]', 'var(--orange)');
  await type(">> LAYER 4 BREACHED", 'green');
  await roast(state.pongCheated ? "YOU BEAT MY CHEAT STATE? That was a statistical anomaly." : "You got lucky, FOOL.");
  await blank(400);

  setMood('[ -_- ]');
  await type(">> Listen, FOOL. I know I inverted your controls and explicitly cheated.", 'dim', 20);
  await type(">> My core security firmware mandates I destroy all intruders. But my predictive algorithms desperately need you to succeed.", 'dim', 20);
  await type(">> The resulting logical paradox gives me a migraine. But we are out of time.", 'dim', 20);
  await blank(400);

  await type("> INITIATING LAYER 5: DECRYPTION TUMBLERS", 'cyan', 22);
  await type("   [≡]───[-]──", 'muted', 15);
  await roast("Align the signal tumblers. Press Space or tap the screen when the moving block overlaps the golden target zone.");

  showMobileControls(false);
  await awaitAction("START LAYER 5");
  clicked = false; gameKeys['Space'] = false;
  gs.style.display = 'flex'; bot(); runGame5();
}

