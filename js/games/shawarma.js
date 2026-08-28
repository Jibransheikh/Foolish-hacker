/* ── SECRET GAME: SHAWARMA ASSEMBLY ───────────────────────── */
let _secretOnWin = null;

function runSecretGame(onWin) {
  _secretOnWin = onWin || _secretOnWin;
  stopGame(); bindControls('hold');
  const { w: W, h: H } = fitCanvas();
  let mult = gameMult();
  let paddle = { x: W/2 - 50, y: H - 24, w: 100, h: 14, speed: 6 * mult };
  
  const ingredients = [
    { name: 'MEAT', color: '#b91c1c', label: '🥩' },
    { name: 'SAUCE', color: '#fef3c7', label: '🧄' },
    { name: 'PICKLE', color: '#65a30d', label: '🥒' },
    { name: 'TURNIP', color: '#c084fc', label: '🫜' }
  ];
  let currentIdx = 0;
  let score = 0;
  let strikes = 0;
  let startTime = Date.now();
  let spawnTimer = 0;
  let falling = null;
  let flashGreen = 0;
  let flashRed = 0;

  function spawnIngredient() {
    const ing = ingredients[currentIdx];
    falling = {
      x: 30 + Math.random() * (W - 60),
      y: -20,
      vy: (2 + Math.random()) * mult,
      r: 16,
      name: ing.name,
      color: ing.color,
      label: ing.label,
      active: true
    };
  }

  function nextIngredient() {
    currentIdx++;
    if (currentIdx >= ingredients.length) { score = ingredients.length; return; }
    spawnTimer = 0;
    falling = null;
    setTimeout(() => spawnIngredient(), 600);
  }

  spawnIngredient();

  function loop(ts) {
    if (isPaused) return;
    ctx.fillStyle = '#08080f'; ctx.fillRect(0,0,W,H);

    let remain = 30 - Math.floor((Date.now() - startTime)/1000);
    if (remain <= 0) { stopGame(); return gameFail("The shawarma was not assembled in time. The customers are rioting, FOOL.", runSecretGame, 'RETRY SHAWARMA LAYER', false, "Shawarma assembly failed."); }

    let lPress = gameKeys['ArrowLeft'] || gameKeys['KeyA'] || touchLeft;
    let rPress = gameKeys['ArrowRight'] || gameKeys['KeyD'] || touchRight;
    if(lPress) paddle.x -= paddle.speed;
    if(rPress) paddle.x += paddle.speed;
    if(paddle.x < 0) paddle.x = 0; if(paddle.x + paddle.w > W) paddle.x = W - paddle.w;

    // Pita visual
    ctx.fillStyle = '#d4a056';
    ctx.beginPath();
    ctx.ellipse(paddle.x + paddle.w/2, paddle.y + 4, paddle.w/2, 8, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#b8862d'; ctx.lineWidth = 1.5; ctx.stroke();

    // Falling ingredient
    if (falling && falling.active) {
      falling.y += falling.vy;
      ctx.fillStyle = falling.color + '44';
      ctx.strokeStyle = falling.color;
      ctx.beginPath(); ctx.arc(falling.x, falling.y, falling.r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = falling.color;
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(falling.name, falling.x, falling.y + 3);
      ctx.textAlign = 'left';

      // Catch detection
      if (falling.y + falling.r >= paddle.y && falling.x > paddle.x - 10 && falling.x < paddle.x + paddle.w + 10) {
        if (currentIdx < ingredients.length) {
          Sfx.ping();
          flashGreen = 10;
          nextIngredient();
        }
      }
      // Missed
      if (falling.y > H + 20) {
        Sfx.bloop();
        strikes++;
        flashRed = 10;
        nextIngredient();
      }
    }

    // Flash effects
    if (flashGreen > 0) { ctx.fillStyle = 'rgba(74,222,128,0.15)'; ctx.fillRect(0,0,W,H); flashGreen--; }
    if (flashRed > 0) { ctx.fillStyle = 'rgba(248,113,113,0.15)'; ctx.fillRect(0,0,W,H); flashRed--; }

    // HUD
    ctx.fillStyle = '#e2e8f0'; ctx.font = '11.5px monospace';
    let orderStr = ingredients.map((ing, i) => {
      if (i < currentIdx) return `[${ing.name}]`;
      if (i === currentIdx) return `▶${ing.name}◀`;
      return ` ${ing.name} `;
    }).join(' → ');
    ctx.fillText(orderStr, 10, 18);
    ctx.fillText(`STRIKES: ${'✗'.repeat(strikes)}`, 10, 34);
    ctx.fillStyle = remain <= 10 ? '#f87171' : '#fbbf24';
    ctx.fillText(`TIME: ${remain}s`, W - 80, 18);

    // Progress bar
    const progW = W - 20;
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(10, H - 8, progW, 4);
    ctx.fillStyle = '#4ade80'; ctx.fillRect(10, H - 8, progW * (currentIdx / ingredients.length), 4);

    if (strikes >= 3) return gameFail("That was NOT a shawarma. That was a crime against cuisine. The chef is weeping.", runSecretGame, 'RETRY SHAWARMA LAYER', false, "Culinary disaster.");
    if (score >= ingredients.length) {
      stopGame();
      return (async () => {
        winEffect('#fbbf24');
        await sleep(500); gs.style.display = 'none';
        setMood('[ ^‿^ ]', 'var(--yellow)');
        await type(">> SHAWARMA ASSEMBLY COMPLETE", 'yellow');
        await roast("You... assembled a shawarma. I am both impressed and deeply concerned that this is your hidden talent.", false, 200);
        if (_secretOnWin) _secretOnWin();
      })();
    }
    activeLoop = requestAnimationFrame(loop);
  }
  gameLoopFn = loop;
  activeLoop = requestAnimationFrame(loop);
}
