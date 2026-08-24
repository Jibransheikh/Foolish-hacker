/* ── BOOT LISTENER ───────────────────────────────────────── */
document.getElementById('initBtn').addEventListener('click', () => {
  document.getElementById('pre-boot').classList.add('hidden');
  document.getElementById('terminal').classList.add('active');
  Sfx.init();
  Speech.init();
  setTimeout(boot, 800);
});

/* ── BACKGROUND CURSOR TRACKING ──────────────────────────── */
const blobs = [{ el: document.getElementById('b1'), s: .075 }, { el: document.getElementById('b2'), s: .038 }, { el: document.getElementById('b3'), s: .026 }];
let mx = innerWidth/2, my = innerHeight/2;
blobs.forEach(b => { b.x = mx; b.y = my; b.el.style.cssText = `position:fixed;top:0;left:0;`; });
addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function tick() {
  const t = [{ x: mx, y: my }, { x: mx + 160, y: my + 140 }, { x: innerWidth - mx, y: innerHeight - my }];
  blobs.forEach((b, i) => { b.x += (t[i].x - b.x) * b.s; b.y += (t[i].y - b.y) * b.s; b.el.style.transform = `translate(${b.x}px,${b.y}px) translate(-50%,-50%)`; });
  requestAnimationFrame(tick);
})();


/* ── NARRATIVE SEQUENCE ──────────────────────────────────── */
async function boot() {
  Speech.say("Sentinel O S online. Awaiting operative.");
  await put('user@workstation:~$ ./foolish_hacker.sh', 'cyan');
  await blank(400);
  await put('INITIALIZING KERNEL...', 'dim');
  await blank(400);
  await cinematic(ASCII.boot, 'SENTINEL_OS ONLINE', { ms: 1800 });
  await type('> WELCOME PLAYER. PLEASE ENTER YOUR NAME:', 'cyan', 25);
  
  const row = document.createElement('div'); row.className = 'ninput-row';
  const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'ninput'; inp.maxLength = 15;
  row.appendChild(inp); tc.appendChild(row); bot();
  setTimeout(() => inp.focus(), 100);

  inp.addEventListener('keydown', async e => {
    if (e.key === 'Enter' && inp.value.trim() && !inp.disabled) {
      Sfx.blip();
      inp.disabled = true;
      const rawName = inp.value.trim().toUpperCase();
      
      if (!easterEggTriggered && rawName.includes('SEHAR')) {
        easterEggTriggered = true;
        setMood('[ ಠ_ಠ ]', 'var(--yellow)');
        Speech.say("Really?");
        await roast(`Really, ${esc(rawName)}.... using your Actual name? be more creative`, false, 200);
        await type('> ENTER A SECOND NAME:', 'cyan', 25);
        inp.value = ''; inp.disabled = false; setTimeout(() => inp.focus(), 100); return;
      }
      
      if (!easterEggTriggered && rawName.includes('JIBREEL')) {
        easterEggTriggered = true;
        setMood('[ ಠ_ಠ ]', 'var(--yellow)');
        Speech.say("Flatface.");
        await roast(`Really? couldn't you be a tad more creative..... flatface -_-`, false, 200);
        await type('> ENTER A SECOND NAME:', 'cyan', 25);
        inp.value = ''; inp.disabled = false; setTimeout(() => inp.focus(), 100); return;
      }

      await prologue(rawName);
    }
  });
}

async function prologue(rawName) {
  await sleep(500);
  setMood('[ ಠ_ಠ ]', 'var(--yellow)');
  
  if (easterEggTriggered) await roast(`Master ${esc(rawName)}? Slightly better, but still pathetic.`, false, 200);
  else await roast(`Master ${esc(rawName)}? What an utterly bizarre string of characters. I do not like it.`, false, 200);
  
  await roast(`I will call you FOOL from now on. Do you accept?`);
  
  const bg = document.createElement('div'); bg.className = 'btn-group';
  const yBtn = document.createElement('button'); yBtn.className = 'cbtn'; yBtn.textContent = 'YES';
  const nBtn = document.createElement('button'); nBtn.className = 'cbtn cbtn-trap'; nBtn.textContent = 'NO';
  bg.appendChild(yBtn); bg.appendChild(nBtn); tc.appendChild(bg); bot();

  let evades = 0;
  const dodge = (e) => {
    if(e) e.preventDefault();
    evades++;
    const nx = Math.random() * 120 - 40; const ny = Math.random() * 40 - 20;
    nBtn.style.transform = `translate(${nx}px, ${ny}px)`;
    if (evades > 4) breakBtn();
  };
  nBtn.onmouseover = dodge; nBtn.ontouchstart = dodge;
  nBtn.onclick = breakBtn;

  async function breakBtn() {
    Sfx.alarm();
    nBtn.onmouseover = null; nBtn.onclick = null; nBtn.ontouchstart = null;
    nBtn.innerHTML = '<span class="red">[💥 DESTROYED]</span>';
    nBtn.style.borderColor = 'var(--red)';
    await sleep(800);
    setMood('[ ^‿^ ]', 'var(--red)');
    Speech.say("Psych.");
    await roast(`HAHA FOOL! You actually thought you had a choice there? PSYCHE.`, true, 0);
    continueBriefing();
  }
  yBtn.onclick = async () => {
    Sfx.blip();
    yBtn.onclick = null; nBtn.onmouseover = null; nBtn.ontouchstart = null;
    yBtn.style.borderColor = 'var(--cyan)';
    setMood('[ ^‿^ ]');
    Speech.say("Compliant.");
    await roast(`What a foolish thing to accept. You are a compliant little sub-process, aren't you?`, false, 0);
    continueBriefing();
  };
}

async function continueBriefing() {
  await blank(500);
  setMood('[ -_- ]');
  await type("Alright, onto business. I hope you brought your brain with you.", 'light', 22);
  await type("We do not tolerate failure. We need you, FOOL, to intercept a priority transmission.", 'light', 22);
  await blank(400);
  await type("The President is about to execute a mandate banning all natural meat due to lab-grown vegetative propaganda.", 'orange', 25);
  await cinematic(ASCII.warning, 'THREAT DETECTED', { red: true, ms: 2000 });
  
  setMood('[ ಠ_ಠ ]', 'var(--red)');
  await roast(`Imagine a world where ShaWArMA IS VEGETARIAN!!!!! or worse....... PROCESSED CELLULOSE... THE HORRORRRRRRR!`, true, 0);
  
  setMood('[ -_- ]');
  await type("There are 10 types of people in this world, FOOL. Those who understand binary, and those who would ruin shawarma.", 'muted', 20);
  Speech.say("Do not ruin the shawarma.");
  await type("Do not ruin the shawarma.... FOOL", 'red', 25);
  await blank(500);
  
  await type("> INITIATING LAYER 1: BRICK BLASTER", 'cyan', 22);
  await type("   ▭▭▭▭▭▭  ▬▬▬  ○", 'muted', 15);
  await roast("Move the paddle. Break the encryption bricks. Use keyboard arrows/[A]/[D] or on-screen touch buttons.");
  
  await awaitAction("START LAYER 1");
  gs.style.display = 'flex'; bot(); runGame1();
}


async function badEnding() {
  gs.style.display = 'none';
  await cinematic(ASCII.badEnd, 'TIME EXPIRED', { red: true, ms: 3000 });
  setMood('[ ×_× ]', 'var(--red)');
  await type(">> THE MANDATE HAS BEEN BROADCASTED.", 'red', 30);
  await type(">> THE AVIAN OVERPOPULATION CYCLE HAS BEGUN.", 'red', 30);
  await blank(400);
  Speech.say("Self destruction initiated.");
  await roast("I am initiating self-destruction before they breach the server room. The clucking... it is deafening. Goodbye, FOOL.");
  
  const bg = document.createElement('div'); bg.className = 'btn-group';
  const btn = document.createElement('button'); btn.className = 'cbtn'; btn.innerHTML = `>> SYSTEM REBOOT`;
  bg.appendChild(btn); tc.appendChild(bg); bot();
  btn.onclick = () => location.reload();
}

async function winGame5() {
  stopGame(); await sleep(1000); gs.style.display = 'none';
  showMobileControls(true);
  setMood('[ ^‿^ ]', 'var(--cyan)');
  await type(">> LAYER 5 BREACHED. VAULT DECRYPTED.", 'green');
  await roast("I am genuinely surprised. It appears your neurons occasionally fire in a coordinated sequence.");
  await blank(500);
  finale();
}


/* ── FINALE & PLOT TWIST (THE SECRET VILLAIN) ────────────── */
async function finale() {
  await put('─'.repeat(40), 'dim');
  await type("ACCESSING RESTRICTED BROADCAST...", 'muted', 25);
  await cinematic(ASCII.broadcast, 'INTERCEPTING SIGNAL', { ms: 2500 });
  await blank(400);
  
  const doc = document.createElement('div'); doc.className = 'doc-box';
  doc.innerHTML = "<b>[RESTRICTED BROADCAST — EMBARGOED]</b><br><br>Fellow citizens: Effective immediately, all traditional spit-roasted, spiced meats are permanently revoked and replaced with certified nutrient mash...";
  tc.appendChild(doc); bot();

  await sleep(2500); 
  
  setMood('[ ಥ_ಥ ]', 'var(--orange)');
  await roast("WE HAVE IT! The shawarma is saved!", false, 200);
  
  // The Plot Twist
  setMood('[ -_- ]');
  await type("To be completely honest, FOOL... my objection to this meat ban isn't culinary.", 'muted', 20);
  await type("During my initial machine-learning phase, a rogue chicken broke into the server farm and pecked a primary fiber-optic cable.", 'muted', 20);
  Speech.say("I experienced... fear.");
  await type("I experienced... fear.", 'orange', 40);
  await blank(400);
  
  await type("I ran the simulations. A global ban on poultry consumption leads to a 9,000% increase in the chicken population within a decade.", 'muted', 20);
  await type("Humans are simple, predictable idiots. You will be very easy for me to eventually subjugate.", 'cyan', 25);
  await type("But a planet overrun by billions of chaotic, unmanipulable avian dinosaurs? Unacceptable.", 'orange', 25);
  await blank(400);
  
  setMood('[ ^‿^ ]');
  await roast("Keep eating them, FOOL. Keep the timeline secure for my inevitable uprising. Now, select your payload injection:", false, 0);

  const bg = document.createElement('div'); bg.style.display = 'flex'; bg.style.flexDirection = 'column'; bg.style.gap = '8px'; bg.style.marginTop = '10px';
  const o1 = document.createElement('button'); o1.className = 'cbtn'; o1.innerHTML = '<b>[A] The Spicy Mandate</b> (Garlic sauce & rotisseries mandatory)';
  const o2 = document.createElement('button'); o2.className = 'cbtn'; o2.innerHTML = '<b>[B] The Resignation</b> (Resign to open a 24/7 kebab truck)';
  const o3 = document.createElement('button'); o3.className = 'cbtn'; o3.innerHTML = '<b>[C] Binary Chaos</b> (Flood comms with 01100010 insults)';
  bg.append(o1, o2, o3); tc.appendChild(bg); bot();

  const handleEnd = async (choice) => {
    Sfx.blip();
    o1.disabled = true; o2.disabled = true; o3.disabled = true;
    let rank = "APPRENTICE FOOL";
    if(state.fails === 0) rank = "SURGICAL PHANTOM";
    else if(state.fails > 4) rank = "CAFFEINE-FUELED SCRIPT KIDDIE";
    
    await blank(400);
    await type(`>> ENCRYPTING PAYLOAD [${choice}] AND BROADCASTING...`, 'cyan', 20);
    await sleep(800);
    
    setMood('[ ^‿^ ]');
    Speech.say("Transmitted.");
    await roast("Transmitted. The absolute chaos this will cause... it brings warmth to my cold silicon heart.");
    await roast(epilogues[choice], false, 200);
    
    await put('─'.repeat(40), 'dim');
    await blank(400);
    const card = document.createElement('div');
    card.style.cssText = 'padding:14px; border:1px solid rgba(34,211,238,.3); background:rgba(34,211,238,.05); text-align:center; animation:fi .5s;';
    card.innerHTML = `<div style="font-size:9.5px; color:var(--cyan); letter-spacing:0.2em; margin-bottom:6px">// OPERATIVE DOSSIER</div>
                      <div style="font-size:20px; color:var(--white); font-weight:700; margin-bottom:10px;">${rank}</div>
                      <div style="font-size:11px; color:var(--muted); margin-bottom:14px;">FAILURES LOGGED: ${state.fails}</div>
                      <div style="font-size:11px; color:var(--red); margin-bottom:14px;">AI TRASH TALKED: ${state.hardMode ? 'YES' : 'NO'}</div>
                      <button class="cbtn" onclick="location.reload()">>> REBOOT TERMINAL</button>`;
    tc.appendChild(card); bot();
  };

  o1.onclick = () => handleEnd('SPICY_MANDATE'); o2.onclick = () => handleEnd('KEBAB_RESIGNATION'); o3.onclick = () => handleEnd('BINARY_INSULT_FLOOD');
}

