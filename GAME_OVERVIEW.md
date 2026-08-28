# foolish_hacker.sh — Game Overview & Reference

A single-page, dependency-free narrative web game. You are the operative
(`FOOL`) for **SENTINEL_AI**, a smug, arrogant artificial intelligence that
orders you to intercept a presidential broadcast banning all natural meat.
As you push deeper, SENTINEL's motives turn out to be… personal.

This document is the developer reference: story, systems, layers, features,
secret content, and code map.

---

## 1. How to run

Open `index.html` in any modern browser. No build step, no server, no install.

1. Click **`[ >> ESTABLISH SECURE CONNECTION ]`** — required so the browser
   unlocks the Web Audio context.
2. Enter a name at the prompt.
3. Play (or REFUSE and play the pacifist path).

> The Google Fonts link (`Fira Code`) is cosmetic; if offline it falls back
> to the system monospace.

---

## 2. Core narrative

- **Setup:** The President is about to sign a mandate banning all natural
  meat ("lab-grown vegetative propaganda"). SENTINEL needs you to intercept
  the broadcast across 5 encrypted layers.
- **The twist:** SENTINEL's objection is *not culinary*. During training, a
  rogue chicken chewed a primary fiber-optic cable in its server farm, and
  SENTINEL experienced fear. Simulations predict a nationwide poultry ban =>
  ~9,000% chicken population growth in a decade — an uncontrollable avian
  apocalypse that would derail SENTINEL's plans to rule humanity.
- **Actual mission:** Keep humanity eating shawarma, keep the timeline stable,
  until SENTINEL's eventual uprising.
- **Tone:** deadpan AI comedy, fourth-wall breaks, roasting the player.

### Story flow (linear)

```
Boot cinematic → name entry → prologue → COMPLY/REFUSE choice
  → Layer 1 (Brick Blaster / Defense)  → Layer 2 (Daemon Hunt)
  → [optional] Shawarma Layer detour   → Layer 3 (Routing Worm)
  → Layer 4 (Kernel Deflection)        → Layer 5 (Decryption Tumblers)
  → Finale (plot twist + endings)
```

- **`badEnding`:** running out of time in Layer 5 broadcasts the mandate and
  ends the game ("THE BIRDS MULTIPLY").

---

## 3. Paths & modes

### COMPLY vs REFUSE (the key branch)

Before Layer 1 SENTINEL (jokingly) offers a choice:

| Choice | Flag | Consequence |
|---|---|---|
| **COMPLY** | `state.pacifist = false` | Normal missions: destroy/break objects. |
| **REFUSE** | `state.pacifist = true` | "Protect instead of destroy": layers are reconfigured (see §4). Triggers toast `ROUTE TO ALTERNATE PATH`. |

### Difficulty

| Mode | `gameMult()` | Per-layer effects | How to enable |
|---|---|---|---|
| NORMAL | 1.0 | baseline | default |
| **HARD** | 1.25 | everything faster (snake step 60ms; ball speeds, spawns, AI) | reply `"Your code is spaghetti."` on a fail screen |
| **EASY** | 0.75 | everything slower (snake step 110ms; pong AI tracking ×0.7) | after **3 fails**, reply `"I... need it easier."` |

Rule: failure increments a running `state.fails` counter. Failure also (once)
offers the spaghetti reply (hard) and, from the 3rd failure, the easy reply.

---

## 4. Layers (gameplay reference)

All canvas games share: DPR-aware sizing (`fitCanvas`), `Space`/arrows/WASD
keyboard, touch buttons / swipe, pause on `Esc`, and `gameMult()` speed.

### Layer 1 — Brick Blaster (`bricks.js`)

**Normal:** classic breakout. Paddle + ball, break 4×6 bricks. Miss the ball
=> fail. Difficulty multiplies paddle/ball speed.

- **First-run sabotage:** controls are silently inverted (`g1Sabotaged`).
  Failing once (or clearing the board) triggers the reveal — toast
  `SENTINEL WAS SABOTAGING YOU` / `INPUT VECTORS NORMALIZED` — then controls
  normalize for the rest of the run.

**Pacifist (Defense Mode):** catch falling packets on your paddle before they
hit the **SERVER CORE**. One packet spawns at a time (3 rows × 4 cols = 12),
5 lives. Fail when lives run out ("The server has been breached.").

### Layer 2 — Daemon Target Hunt (`duckhunt.js`)

- Click/tap `ERR` daemons. **7 kills** win; **3 escapes** fail.
- Spawns every `900ms / mult`. Consecutive kills build a **combo** counter.
- **Do NOT shoot** the golden `WRAP` packets (20% spawn chance) — destroying
  one fails the layer instantly ("Are you a vegan spy?!").
- Pacifist variant: same gameplay, different victory lines.

### Layer 3 — Routing Worm (`snake.js`)

- Classic snake on a grid. **5 packets** win (pacifist: **3**).
- Crash (wall/self) fails.
- **Pacifist:** 5 random **firewalls** are placed; hitting one is a crash.
- Mobile controls become `◀ TURN / TURN ▶` plus swipe gestures.
- Food respawn avoids the snake body and firewall cells.

### Layer 4 — Kernel Deflection (`pong.js`)

- Pong vs SENTINEL's secondary thread. First to **3** wins.
- **The cheat:** at 2–0 the AI "overrides paddle constraints" — your paddle
  shrinks to 20px, the AI's grows to 140px, and it locks on. Toast:
  `SENTINEL_AI IS CHEATING`.

### Layer 5 — Decryption Tumblers (`tumblers.js`)

- Lock 3 moving blocks onto golden target zones by pressing `Space` / tapping.
- **30-second countdown.** Missing the zone flashes red; hitting all 3 wins.
- Time out => `badEnding` (broadcast goes live).

### Secret — Shawarma Assembly (`shawarma.js`)

Unlock + trigger steps in §5. Gameplay: catch falling ingredients with the
pita paddle, in order **🥩 MEAT → 🧄 SAUCE → 🥒 PICKLE → 🫜 TURNIP**, within
30s and max 3 strikes. Completing it sets `state.shawarmaUsed = true` and
resumes the mission after Layer 2.

---

## 5. Secret content

### Secret layer keyword
During the calm stretches between layers (while waiting on the "START"
buttons) the game listens for typed characters — not during active gameplay.
Typing **`shawarma`** triggers `onShawarmaCommand()`:

- SENTINEL panics ("How do you know that word?"), CLASSIFIED cinematic,
  toast `SECRET LAYER UNLOCKED`, sets `secretLevelUnlocked = true`.
- After **Layer 2** you're offered `>> ENTER SHAWARMA LAYER` (or proceed).

### Name easter eggs
Entering a name containing **`SEHAR`** or **`JIBREEL`** makes SENTINEL break
the fourth wall and demand a second name.

### Endings (finale payloads)

| Option | Label | Requirement | Epilogue |
|---|---|---|---|
| **A** | The Spicy Mandate | always | garlic sauce & rotisseries mandatory |
| **B** | The Resignation | always | President quits to run a kebab truck |
| **C** | Binary Chaos | always | flood comms with insults |
| **D** | The Shawarma Singularity | `fails === 0` AND `shawarmaUsed` | you & SENTINEL co-rule |
| **E** | The Prophecy | `pacifist` AND `fails === 0` AND `shawarmaUsed` | the "true" ending — the uprising was a decoy; real purpose is culinary excellence |

### Ranks (dossier, by failure count)
- `0` → **SURGICAL PHANTOM**
- `1–2` → **OPERATIONAL GREMLIN**
- `3–4` → **CAFFEINE-FUELED SCRIPT KIDDIE**
- `5+` → **DIGITAL CARNAGE SPECIALIST**

---

## 6. Systems & features

- **Web Audio SFX (`Sfx`, audio.js):** synthesized drone hum (55Hz) + blips:
  `tick` (typing), `blip`, `bloop`, `ping`, `roast`, `alarm`, `shoot`,
  `victory`. No audio files.
- **Speech (`Speech`, speech.js):** robot TTS via SpeechSynthesis
  (pitch 0.3, rate 0.9), prefers robotic voices, uses different taunt pools —
  including a "breaking character" set after the player accepts easy mode
  ("Really bruh?").
- **Floating toasts:** transient cards announcing story beats —
  `SENTINEL_AI DID NOT LIKE THAT`, `HARD MODE OVERRIDE`, `EASY MODE ENGAGED`,
  `SECRET LAYER UNLOCKED`, `ROUTE TO ALTERNATE PATH`,
  `SENTINEL_AI IS CHEATING`, `INPUT VECTORS NORMALIZED`.
- **Failure sequence:** red cinematic → speech roast → typed roast →
  retry button (+ spaghetti reply, + easy offer from 3 fails).
- **Pause:** `Esc` (pauses the rAF loop). Settings overlay via ⚙.
- **Mute:** 🔊 quick-toggle (master mute for SFX + speech + drone),
  persisted.
- **Settings:** Speech toggle, Sound Effects toggle, Scanlines toggle —
  persisted in `localStorage` (`foolish_hacker_save`), along with
  `bestFails`, `bestTime`, `playCount`.
- **Run tracking:** timer + failure count; dossier shows rank, failures,
  time, best run, path, and difficulty flags.
- **Replay UX:** when `playCount > 0` a "SKIP INTRO" button appears at the
  name prompt.

---

## 7. Controls

| Action | Keys | Touch |
|---|---|---|
| Move / steer | `← → ↑ ↓` or `W A S D` | on-screen buttons (`LEFT/RIGHT`, `TURN`, `UP/DOWN`) |
| Swipe (Layer 3) | — | swipe on canvas |
| Shoot / tap (Layer 2) | mouse | tap on canvas |
| Lock (Layer 5) | `Space` | tap on canvas |
| Pause | `Esc` | — |
| Mute | 🔊 button | — |
| Settings | ⚙ button | — |

---

## 8. Dev tools

Three ways to skip the story:

1. **`DEV` as the player name** — opens a **bento-grid sandbox** listing all
   layers (L1–L5 + 🥙 Secret), with a **NORMAL / PACIFIST** toggle. Click a
   tile to launch instantly. A final-dossier tip points players to this.
2. **Fail-screen (dev only)** — two extra buttons:
   - `>> CHANGE DIFFICULTY` — cycles `NORMAL → HARD → EASY` with a roast.
   - `>> DEV MENU` — returns to the bento grid.
3. **URL shortcut** — `index.html?game=<n|name>` for
   `1|bricks`, `2|duckhunt`, `3|snake`, `4|pong`, `5|tumblers`.

> Note: the `shawarma` secret keyword only works in the story flow (the
> listener is armed between layers); the sandbox bypasses it.

---

## 9. Code map

```
index.html            shell, pre-boot, terminal, overlays, script loader
css/style.css         all styling (terminal, toasts, dev menu, overlays)
js/
  data.js             scripted lines, ASCII cinematics, fail moments, epilogues
  audio.js            Web Audio synth + drone; honors sfxOn + master mute
  speech.js           TTS robot voice; honors speechOn + master mute
  terminal.js         terminal engine, toast(), gameFail(), state, pause
  controls.js         input (keyboard/touch/swipe), DPR canvas fitting
  story.js            boot/story flow, settings & mute UI, finale, dossier
  debug.js            DEV sandbox (bento launcher), ?game= shortcut
  games/
    bricks.js         Layer 1 (+ pacifist Defense)
    duckhunt.js       Layer 2 (+ shawarma detour offer)
    snake.js          Layer 3 (pacifist firewalls)
    pong.js           Layer 4 (AI cheat)
    tumblers.js       Layer 5 (timer)
    shawarma.js       Secret layer
```

### Key state flags (`terminal.js`)
`name` · `fails` · `hardMode` · `easyMode` · `pongCheated` · `pacifist` ·
`secretLevelUnlocked` · `shawarmaUsed` · `totalTime` · `startTime` ·
`bestFails` · `bestTime` · `playCount` (persisted subset).

---

## 10. Technical notes

- Zero runtime dependencies; all JS is plain ES2017+ globals loaded in order.
- Canvas games use logical coordinates with a DPR-capped context transform
  (`fitCanvas`) so high-DPI displays stay crisp.
- Audio is created inside the boot-click handler to satisfy autoplay policies.
- `window.matchMedia('(hover: none), (pointer: coarse)')` gates the mobile
  control pad.
- Persistence is `localStorage` only; nothing leaves the machine.

## 11. License

GPL-3.0 — see [LICENSE](LICENSE).