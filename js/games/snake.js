/* ── GAME 3: SNAKE ───────────────────────────────────────── */
function runGame3() {
  stopGame();
  const { w: W, h: H } = fitCanvas();
  const gsz = 16;
  const gw = Math.floor(W/gsz), gh = Math.floor(H/gsz);
  let snake = [{x: 5, y: 5},{x: 4, y: 5},{x: 3, y: 5}];
  let dir = {x:1, y:0}, nextDir = {x:1, y:0};
  let food = {x: 12, y: 8}, score = 0;
  let lastT = 0;
  let stepDelay = state.hardMode ? 60 : (state.easyMode ? 110 : 85);
  const targetScore = state.pacifist ? 3 : 5;

  let firewalls = [];
  if (state.pacifist) {
    for (let i = 0; i < 5; i++) {
      const fx = Math.floor(Math.random() * (gw - 4)) + 2;
      const fy = Math.floor(Math.random() * (gh - 4)) + 2;
      if (fx !== 5 && fy !== 5) firewalls.push({ x: fx, y: fy });
    }
  }

  function turn(x, y) {
    if (dir.x === -x && dir.y === -y) return;
    if (nextDir.x === x && nextDir.y === y) return;
    nextDir = { x, y };
  }

  function spawnFood() {
    for (let i = 0; i < 200; i++) {
      const x = Math.floor(Math.random() * (gw - 2)) + 1;
      const y = Math.floor(Math.random() * (gh - 2)) + 1;
      const onSnake = snake.some(s => s.x === x && s.y === y);
      const onWall = firewalls.some(f => f.x === x && f.y === y);
      if (!onSnake && !onWall) return { x, y };
    }
    return { x: 12, y: 8 };
  }

  bindControls('tap-turn', s => {
    if (dir.x === 1) turn(0, s);
    else if (dir.y === -1) turn(s, 0);
    else if (dir.x === -1) turn(0, -s);
    else turn(-s, 0);
  });
  swipeHandler = (dx, dy) => {
    if (Math.abs(dx) > Math.abs(dy)) turn(Math.sign(dx), 0);
    else turn(0, Math.sign(dy));
  };

  function loop(ts) {
    if (isPaused) return;
    backgroundTaunt(ts);
    if (gameKeys['ArrowUp'] || gameKeys['KeyW']) turn(0, -1);
    if (gameKeys['ArrowDown'] || gameKeys['KeyS']) turn(0, 1);
    if (gameKeys['ArrowLeft'] || gameKeys['KeyA']) turn(-1, 0);
    if (gameKeys['ArrowRight'] || gameKeys['KeyD']) turn(1, 0);

    if (ts - lastT > stepDelay) {
      lastT = ts; dir = nextDir;
      const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      
      if(h.x < 0 || h.x >= gw || h.y < 0 || h.y >= gh || snake.some(s => s.x === h.x && s.y === h.y) || firewalls.some(f => f.x === h.x && f.y === h.y)) {
        return gameFail(state.pacifist ? "You hit a firewall. Even with a shortcut, you still crashed." : "You crashed into a static object. It literally has zero velocity. How is that computationally possible?", runGame3, 'RESTART LAYER 3', true);
      }
      snake.unshift(h);
      if(h.x === food.x && h.y === food.y) {
        Sfx.blip();
        score++; food = spawnFood();
      } else { snake.pop(); }
    }

    ctx.fillStyle = '#08080f'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(food.x*gsz+2, food.y*gsz+2, gsz-4, gsz-4);
    firewalls.forEach(f => { ctx.fillStyle = 'rgba(248,113,113,0.4)'; ctx.fillRect(f.x*gsz, f.y*gsz, gsz, gsz); });
    snake.forEach((s,i) => { ctx.fillStyle = i===0 ? '#4ade80' : 'rgba(74,222,128,0.7)'; ctx.fillRect(s.x*gsz+1, s.y*gsz+1, gsz-2, gsz-2); });
    ctx.fillStyle = '#e2e8f0'; ctx.font = '11.5px monospace';
    ctx.fillText(`PACKETS: ${score}/${targetScore}`, 10, 20);

    if(score >= targetScore) return winGame3();
    activeLoop = requestAnimationFrame(loop);
  }
  gameLoopFn = loop;
  activeLoop = requestAnimationFrame(loop);
}

async function winGame3() {
  stopTimer();
  stopGame(); await sleep(1000); gs.style.display = 'none';
  setMood('[ -_- ]');
  if (state.pacifist) {
    await type(">> LAYER 3 CLEARED [DEFENSE MODE]", 'green');
    await roast("You navigated the firewalls. For a pacifist, you are surprisingly competent at avoiding things. It is almost like you have experience running away.");
  } else {
    await type(">> LAYER 3 BREACHED", 'green');
    await roast("Spatial navigation confirmed. Barely.");
  }
  await blank(400);
  await type("> INITIATING LAYER 4: KERNEL DEFLECTION", 'cyan', 22);
  await type("   ▌     ○      ▐", 'muted', 15);
  await roast("Defend your sector against my secondary thread. First to 3 points wins.");
  
  mLeft.textContent = '▲ UP'; mRight.textContent = '▼ DOWN';
  setLayer(4);
  startCmdListening();
  await awaitAction("START LAYER 4");
  gs.style.display = 'flex'; bot(); runGame4();
}

