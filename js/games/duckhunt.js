/* ── GAME 2: DUCK HUNT / TARGETS (FRIENDLY FIRE) ─────────── */
function runGame2() {
  stopGame();
  const { w: W, h: H } = fitCanvas();
  let mult = state.hardMode ? 1.25 : 1;
  let targets = [];
  let kills = 0, escaped = 0; const targetKills = 7, maxEscapes = 3;
  let lastSpawn = 0; clicked = false;

  function loop(ts) {
    ctx.fillStyle = '#08080f'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 1;
    for(let i=0; i<W; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }
    
    if (ts - lastSpawn > (900 / mult)) {
      const isShawarma = Math.random() > 0.8;
      targets.push({ 
        x: -20, y: 30 + Math.random()*(H-70), r: 18, 
        vx: (2 + Math.random()*1.5) * mult, active: true, isShawarma 
      });
      lastSpawn = ts;
    }

    let justClicked = false;
    if (clicked) { Sfx.shoot(); justClicked = true; clicked = false; }
    let hitShawarma = false;

    targets.forEach(t => {
      if(!t.active) return;
      t.x += t.vx; t.y += Math.sin(t.x/20) * 1.8;
      
      if(justClicked && Math.hypot(t.x - mouseX, t.y - mouseY) < t.r + 14) { 
        t.active = false; 
        if (t.isShawarma) hitShawarma = true;
        else { Sfx.ping(); kills++; }
      }
      
      if(t.active) {
        ctx.fillStyle = t.isShawarma ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.2)'; 
        ctx.strokeStyle = t.isShawarma ? '#fbbf24' : '#f87171';
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = t.isShawarma ? '#fbbf24' : '#f87171'; 
        ctx.font = '10px monospace'; ctx.fillText(t.isShawarma ? 'WRAP' : 'ERR', t.x-10, t.y+3);
      }
      if(t.x > W + 20 && t.active && !t.isShawarma) { t.active = false; escaped++; Sfx.bloop(); }
    });

    ctx.strokeStyle = '#4ade80'; ctx.beginPath();
    ctx.moveTo(mouseX-10, mouseY); ctx.lineTo(mouseX+10, mouseY);
    ctx.moveTo(mouseX, mouseY-10); ctx.lineTo(mouseX, mouseY+10); ctx.stroke();
    ctx.fillStyle = '#e2e8f0'; ctx.font = '11.5px monospace';
    ctx.fillText(`KILLS: ${kills}/${targetKills}  ESCAPED: ${escaped}/${maxEscapes}`, 10, 20);

    if (hitShawarma) {
      return gameFail("YOU VAPORIZED A PRO-MEAT PACKET! We need them consumed, not laser-blasted! Are you a vegan spy?!", runGame2, 'RESTART LAYER 2', false, "Vegan spy detected.");
    }
    if (escaped >= maxEscapes) return gameFail("Tracking floating pixels shouldn't take this long. Even my cooling fan rotates faster than your reflex arcs.", runGame2, 'RESTART LAYER 2', true);
    if (kills >= targetKills) return winGame2();
    activeLoop = requestAnimationFrame(loop);
  }
  activeLoop = requestAnimationFrame(loop);
}

async function winGame2() {
  stopGame(); await sleep(1000); gs.style.display = 'none';
  setMood('[ ^‿^ ]');
  await type(">> LAYER 2 BREACHED", 'green');
  await roast("You managed to click moving targets. Give yourself a gold star, FOOL.");
  await blank(400);
  await type("> INITIATING LAYER 3: ROUTING WORM", 'cyan', 22);
  await type("   ●▸▸▸▸▸", 'muted', 15);
  await roast("Eat the packets. Do not hit walls or your tail. Use arrow keys or touch controls to steer.");
  
  mLeft.textContent = '◀ TURN'; mRight.textContent = 'TURN ▶';
  await awaitAction("START LAYER 3");
  gs.style.display = 'flex'; bot(); runGame3();
}

