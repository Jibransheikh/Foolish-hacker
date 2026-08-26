/* ── GAME 1: BRICK BREAKER ───────────────────────────────── */
function runGame1Pacifist() {
  stopGame(); bindControls('hold');
  const { w: W, h: H } = fitCanvas();
  let mult = state.hardMode ? 1.25 : 1;
  let paddle = { x: W/2 - 40, y: H - 20, w: 80, h: 10, speed: 5.5 * mult };
  let lives = 3;
  let bricks = [];
  const rows = 3, cols = 5, bw = (W - 40)/cols, bh = 14;
  for(let r=0; r<rows; r++) for(let c=0; c<cols; c++) {
    bricks.push({ x: 20 + c*bw, y: -20 - r*22, w: bw-2, h: bh, active: true, vy: 1.2 * mult + Math.random()*0.8 });
  }
  let spawnTimer = 0;
  const totalBricks = rows * cols;
  let caught = 0;

  function loop(ts) {
    if (isPaused) return;
    ctx.fillStyle = '#08080f'; ctx.fillRect(0,0,W,H);
    backgroundTaunt(ts);

    let lPress = gameKeys['ArrowLeft'] || gameKeys['KeyA'] || touchLeft;
    let rPress = gameKeys['ArrowRight'] || gameKeys['KeyD'] || touchRight;
    if(lPress) paddle.x -= paddle.speed;
    if(rPress) paddle.x += paddle.speed;
    if(paddle.x < 0) paddle.x = 0; if(paddle.x + paddle.w > W) paddle.x = W - paddle.w;

    // Draw server core
    ctx.fillStyle = 'rgba(74,222,128,0.15)'; ctx.fillRect(0, H - 6, W, 6);
    ctx.fillStyle = '#4ade80'; ctx.font = '9px monospace'; ctx.fillText('SERVER CORE', 10, H - 10);

    let activeBricks = 0;
    bricks.forEach(b => {
      if (!b.active) return;
      b.y += b.vy;
      activeBricks++;

      ctx.fillStyle = 'rgba(34,211,238,0.3)'; ctx.strokeStyle = '#22d3ee';
      ctx.fillRect(b.x, b.y, b.w, b.h); ctx.strokeRect(b.x, b.y, b.w, b.h);

      // Caught by paddle
      if (b.y + b.h >= paddle.y && b.y + b.h <= paddle.y + paddle.h + 8 && b.x + b.w > paddle.x && b.x < paddle.x + paddle.w) {
        Sfx.ping(); b.active = false; caught++;
      }
      // Hit the bottom
      if (b.y > H) {
        b.active = false; lives--; Sfx.alarm();
      }
    });

    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#fbbf24'; ctx.font = '11.5px monospace';
    ctx.fillText(`CAUGHT: ${caught}/${totalBricks}  LIVES: ${'♥'.repeat(lives)}`, 10, 20);

    if (lives <= 0) return gameFail("The server has been breached. So much for the pacifist approach, FOOL.", runGame1, 'RESTART LAYER 1', true);
    if (caught >= totalBricks) return winGame1();
    activeLoop = requestAnimationFrame(loop);
  }
  gameLoopFn = loop;
  activeLoop = requestAnimationFrame(loop);
}

function runGame1() {
  if (state.pacifist) return runGame1Pacifist();
  stopGame(); bindControls('hold');
  const { w: W, h: H } = fitCanvas();
  let mult = state.hardMode ? 1.25 : 1;
  let paddle = { x: W/2 - 40, y: H - 20, w: 80, h: 10, speed: 5.5 * mult };
  let ball = { x: W/2, y: H - 40, r: 4, vx: 4 * mult * (Math.random()>0.5?1:-1), vy: -4 * mult };
  let bricks = [];
  const rows = 4, cols = 6, bw = (W - 30)/cols, bh = 14;
  for(let r=0; r<rows; r++) for(let c=0; c<cols; c++) bricks.push({ x: 15 + c*bw, y: 25 + r*(bh+4), w: bw-2, h: bh, active: true });
  
  function loop(ts) {
    if (isPaused) return;
    ctx.fillStyle = '#08080f'; ctx.fillRect(0,0,W,H);
    backgroundTaunt(ts);
    
    let lPress = gameKeys['ArrowLeft'] || gameKeys['KeyA'] || touchLeft;
    let rPress = gameKeys['ArrowRight'] || gameKeys['KeyD'] || touchRight;

    if (g1Sabotaged) { let temp = lPress; lPress = rPress; rPress = temp; }

    if(lPress) paddle.x -= paddle.speed;
    if(rPress) paddle.x += paddle.speed;
    if(paddle.x < 0) paddle.x = 0; if(paddle.x + paddle.w > W) paddle.x = W - paddle.w;

    ball.x += ball.vx; ball.y += ball.vy;
    if(ball.x - ball.r < 0 || ball.x + ball.r > W) ball.vx *= -1;
    if(ball.y - ball.r < 0) ball.vy *= -1;
    if(ball.y + ball.r >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
      Sfx.bloop();
      ball.vy = -Math.abs(ball.vy);
      ball.vx = ((ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2)) * 4.5 * mult;
    }

    let activeBricks = 0;
    bricks.forEach(b => {
      if(!b.active) return;
      activeBricks++;
      ctx.fillStyle = 'rgba(34,211,238,0.3)'; ctx.strokeStyle = '#22d3ee';
      ctx.fillRect(b.x, b.y, b.w, b.h); ctx.strokeRect(b.x, b.y, b.w, b.h);
      if(ball.x > b.x && ball.x < b.x+b.w && ball.y > b.y - ball.r && ball.y < b.y+b.h + ball.r) {
        Sfx.ping();
        b.active = false; ball.vy *= -1;
      }
    });

    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

    if (ball.y > H) {
      if (g1Sabotaged) {
        g1Sabotaged = false; stopGame();
        return (async () => {
          await sleep(800); gs.style.display = 'none';
          setMood('[ ^‿^ ]', 'var(--cyan)');
          await roast("HAHAHA FOOL! Did you really think I'd make it that easy? I inverted your controls. Okay, okay, I'm done sabotaging, please proceed...", false, 200);
          Speech.say("Normalizing input vectors.");
          await type(">> NORMALIZING INPUT VECTORS...", 'dim', 15);
          await awaitAction('RESTART LAYER 1');
          setMood('[ -_- ]'); touchLeft = false; touchRight = false; gs.style.display = 'flex'; bot(); runGame1();
        })();
      } else {
        return gameFail("You let the packet drop. A rect and a dot, FOOL. That is all it is.", runGame1, 'RESTART LAYER 1', true);
      }
    }
    
    if (activeBricks === 0) {
      if (g1Sabotaged) {
        g1Sabotaged = false; stopGame(); 
        return (async () => {
          await sleep(1000); gs.style.display = 'none'; setMood('[ ^‿^ ]', 'var(--cyan)');
          await roast("HAHAHA FOOL! Controls were inverted that entire run and you still cleared it. Fine — normalizing input vectors for the rest of this.", false, 200);
          await winGame1();
        })();
      }
      return winGame1();
    }
    activeLoop = requestAnimationFrame(loop);
  }
  gameLoopFn = loop;
  activeLoop = requestAnimationFrame(loop);
}

async function winGame1() {
  stopTimer();
  stopGame(); 
  if (gs.style.display !== 'none') { await sleep(1000); gs.style.display = 'none'; }
  setMood('[ -_- ]');
  if (state.pacifist) {
    await type(">> LAYER 1 CLEARED [DEFENSE MODE]", 'green');
    await roast("You caught them all. How... nurturing. I suppose protecting data is technically a valid strategy. Barely.");
  } else {
    await type(">> LAYER 1 BREACHED", 'green');
    await roast("Acceptable. Though I've seen sorting algorithms with more elegance.");
  }
  const elapsed1 = Math.floor((Date.now() - state.startTime) / 1000);
  if (elapsed1 < 30) { await roast("That was suspiciously fast. Are you sure you're not a kernel module?", false, 0); }
  else if (elapsed1 > 90) { await roast("I've seen batch files with more urgency.", false, 0); }
  await blank(400);
  await type("> INITIATING LAYER 2: DAEMON TARGET HUNT", 'cyan', 22);
  await type("   ◎  ◎  ◎   →   ✕", 'muted', 15);
  await roast("Tap or click on the erratic daemons. Watch out for the golden packets—do not destroy the Meat Supply.");
  
  startCmdListening();
  setLayer(2);
  await awaitAction("START LAYER 2");
  clicked = false; gs.style.display = 'flex'; bot(); runGame2();
}

