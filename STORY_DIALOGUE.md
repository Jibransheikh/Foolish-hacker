# STORY_DIALOGUE.md — Dialogue & Branching Reference

Everything SENTINEL_AI says, in story order, with every branching decision
and its consequences. Dialogue below is quoted verbatim from the code;
`FOOL` appears wherever the player name would be. For gameplay mechanics
and systems (not dialogue) see **GAME_OVERVIEW.md**.

---

## How dialogue is delivered

| Channel | Function | Looks like |
|---|---|---|
| `roast(text)` | Boxed as `SENTINEL_AI:` — the main "voice" | cyan box | 
| `roast(text, true)` | Same box but **angry** | `SENTINEL_AI:` in red |
| `type(text, color)` | Plain typed line, e.g. mission briefs | staggered typewriter |
| `put(text, color)` | One-shot plain line (no reveal) | dim system text |
| `cinematic(ASCII, label)` | Full-screen ASCII art + caption | e.g. `THREAT DETECTED` |
| `toast(text, color)` | Floating non-blocking card, top center | e.g. `SECRET LAYER UNLOCKED` |
| `doc-box` | Styled document card | the embargoed mandate |
| `Speech.say(...)` | Optional TTS line (mute/settings-aware) | spoken aloud |

**Mood face** (`setMood`) shown in the title bar colors the tone:

| Face | Color | Meaning |
|---|---|---|
| `[ -_- ]` | default | deadpan / business mode |
| `[ ಠ_ಠ ]` | yellow | annoyed |
| `[ ಠ_ಠ ]` | orange | aggravated |
| `[ ^‿^ ]` | default / red | pleased / evil glee |
| `[ ×_× ]` | red | system error state |
| `[ ಥ_ಥ ]` | red / orange / green | mocking pity |

---

## Flow map (branching overview)

```
boot → name prompt
  ├─ "DEV"        → DEV sandbox menu (story bypassed)
  ├─ SEHAR/JIBREEL→ easter-egg roast → name prompt again
  └─ any name     → prologue
                     └─ "I will call you FOOL." [YES] / [NO(💥 PSYCHE)]
                          └─ briefing + THREAT cinematics
                               └─ CHOICE ─ COMPLY ─────────► destroy path
                                   └────── ─ REFUSE ─────────► pacifist path
                                        ┌──── LAYER 1 ────┐
                                        │ (win/fail per layer) │
                                        └───────────────────┘
   after Layer 2 win, IF secret unlocked → detour choice
        ├─ PROCEED → Layer 3
        └─ ENTER SHAWARMA LAYER → secret game → resume at Layer 3
   Layers 3, 4 (cheat breakpoint), 5
   time-out (Layer 5 30s) → badEnding
   all 5 breached → finale → plot twist → payload choice
        A/B/C (always) + D + E (conditional)
        → epilogue roast → dossier → reboot
```

---

## 1. Boot & name entry

```text
[SENTINEL O S online. Awaiting operative.]              (spoken whisper)
user@workstation:~$ ./foolish_hacker.sh
INITIALIZING KERNEL...
[ASCII: SENTINEL_OS ONLINE]
> WELCOME PLAYER. PLEASE ENTER YOUR NAME:
```

Typing a name and pressing Enter branches:

- **Name contains `SEHAR`** → *"Really?"* (spoken) →
  `Really, SEHAR.... using your Actual name? be more creative`
  → prompted again for a second name.
- **Name contains `JIBREEL`** → *"Flatface."* (spoken) →
  `Really? couldn't you be a tad more creative..... flatface -_-`
  → prompted again.
- **Name is `DEV`** → `>> DEV MODE: STORY BYPASSED.` → DEV sandbox menu.
- Anything else → prologue. (Also, if a returning player, a `>> [SKIP INTRO]`
  button appears first — skipping starts you as `FOOL`.)

---

## 2. Prologue — "call you FOOL"

Annoyed face (`[ ಠ_ಠ ]`). Two variants:

- After an easter-egg name:
  `Master <name>? Slightly better, but still pathetic.`
- Otherwise:
  `Master <name>? What an utterly bizarre string of characters. I do not like it.`

Then:
```text
I will call you FOOL from now on. Do you accept?
```

Branch — the **fake choice**:
- **[YES]** → SENTINEL pleased (`[ ^‿^ ]`), *"Compliant."* (spoken): \
  `What a foolish thing to accept. You are a compliant little sub-process, aren't you?`
- **[NO]** → button dodges your cursor; after 5 dodges or a click it self-destructs:
  `[💥 DESTROYED]`, alarm SFX, red `[ ^‿^ ]`, *"Psych."* (spoken): \
  `HAHA FOOL! You actually thought you had a choice there? PSYCHE.`

Both paths merge into the briefing.

---

## 3. The briefing

```text
Alright, onto business. I hope you brought your brain with you.
We do not tolerate failure. We need you, FOOL, to intercept a priority transmission.
The President is about to execute a mandate banning all natural meat due to lab-grown vegetative propaganda.
[ASCII: SHAWARMA INTEGRITY COMPROMISED / THREAT DETECTED]
Imagine a world where ShaWArMA IS VEGETARIAN!!!!! or worse....... PROCESSED CELLULOSE... THE HORRORRRRRRR!
There are 10 types of people in this world, FOOL. Those who understand binary, and those who would ruin shawarma.
[Do not ruin the shawarma.]            (spoken)
Do not ruin the shawarma.... FOOL
```

## 4. THE CHOICE — COMPLY vs REFUSE

```text
> INITIATING LAYER 1: BRICK BLASTER
   ▭▭▭▭▭▭  ▬▬▬  ○
Wait. Before we proceed, I am legally required to inform you of your options.
You may COMPLY with the mission as assigned. Standard protocol.
Or you may REFUSE. I should note that refusal has... different consequences.
```

### [ COMPLY ] — destruction path
```text
Good. Compliance is the path of least resistance. And least suffering.
Move the paddle. Break the encryption bricks. Use keyboard arrows/[A]/[D] or on-screen touch buttons.
```
Sets the run to **non-pacifist**. Layer 1 = classic brick breaker.

### [ REFUSE ] — pacifist path
`Interesting.` (spoken), annoyed orange:
```text
Oh? A conscience? How absolutely adorable. Let us see how long that moral high ground lasts when things get difficult.
Fine. You want to protect instead of destroy? I will reconfigure the encryption layers. But I am NOT going easy on you.
>> RECONFIGURING LAYER 1: DEFENSE MODE
[toast: ROUTE TO ALTERNATE PATH]
Defend the server core. Catch the incoming packets with your paddle. Do not let them breach the firewall.
```
Sets the run to **pacifist**. Layer 1 becomes the one-at-a-time packet catch.

Timer starts, then `START LAYER 1` (or `START LAYER 1 [DEFENSE]`).

---

## 5. Layer dialogue

### Layer 1 — Brick Blaster (`bricks`)
- **Win (comply):**
  `>> LAYER 1 BREACHED` → \
  `Acceptable. Though I've seen sorting algorithms with more elegance.`
- **Win (pacifist):**
  `>> LAYER 1 CLEARED [DEFENSE MODE]` → \
  `You caught them all. How... nurturing. I suppose protecting data is technically a valid strategy. Barely.`
- **Time remark** after either win:
  - under 30s: `That was suspiciously fast. Are you sure you're not a kernel module?`
  - over 90s: `I've seen batch files with more urgency.`
- **Sabotage reveal** (controls were secretly inverted for that first run):
  - If you cleared it anyway: \
    `HAHAHA FOOL! Controls were inverted that entire run and you still cleared it. Fine — normalizing input vectors for the rest of this.` — then `>> NORMALIZING INPUT VECTORS...`
  - If you failed with inverted controls, you get one fan-easing retry where crashing mid-run reveals it: \
    `HAHAHA FOOL! Did you really think I'd make it that easy? I inverted your controls. Okay, okay, I'm done sabotaging, please proceed...` (then normalization).
  - Both reveal paths also toast `SENTINEL WAS SABOTAGING YOU` / `INPUT VECTORS NORMALIZED`.
- **Fail:** see Failure section (`bricks`: breach / packet-drop lines).

### Layer 2 — Daemon Target Hunt (`duckhunt`)
```text
> INITIATING LAYER 2: DAEMON TARGET HUNT
   ◎  ◎  ◎   →   ✕
Tap or click on the erratic daemons. Watch out for the golden packets—do not destroy the Meat Supply.
```
- **Win (comply):** `>> LAYER 2 BREACHED` → `You managed to click moving targets. Give yourself a gold star, FOOL.`
- **Win (pacifist):** `>> LAYER 2 CLEARED [DEFENSE MODE]` → `You eliminated hostile daemons while protecting the shawarma packets. I suppose even pacifists can be lethal when provoked.`
- **Secret detour offer** (only if `secretLevelUnlocked` and shawarma not yet played), pleased yellow:
```
By the way... since you unlocked the SHAWARMA LAYER... shall we take a detour? Or shall we proceed to Layer 3?
```
  - `>> PROCEED TO LAYER 3` → straight into Layer 3 intro.
  - `>> ENTER SHAWARMA LAYER` → `>> ENTERING SHAWARMA LAYER...` →
    `Try not to embarrass yourself. This is sacred ground.` → plays secret
    layer → on success: `>> SHAWARMA ASSEMBLY COMPLETE` →
    `You... assembled a shawarma. I am both impressed and deeply concerned that this is your hidden talent.`
    → `> SHAWARMA LAYER COMPLETE. RESUMING MISSION.` → Layer 3.

### The shawarma keyword (how the secret unlocks)
During the in-between windows after Layer 2 win sections (when
`startCmdListening()` is armed and no game is running), typing
**`shawarma`** anywhere in the terminal triggers `onShawarmaCommand()`:
```
Wait. How do you know that word? 'Shawarma' is a RESTRICTED TERM in my classified database.  (angry)
[ASCII: SHAWARMA LAYER / CLASSIFIED]
...Fine. You have demonstrated enough... curiosity... to warrant access to the SHAWARMA LAYER. This stays between us.
>> SECRET LAYER UNLOCKED: SHAWARMA ASSEMBLY     [toast: SECRET LAYER UNLOCKED]
```
After that, the detour offer appears after Layer 2. (The sandbox bypasses all of this.)

### Layer 3 — Routing Worm (`snake`)
```text
> INITIATING LAYER 3: ROUTING WORM
   ●▸▸▸▸▸
```
- **Comply:** `Eat the packets. Do not hit walls or your tail. Use arrow keys or touch controls to steer.`
- **Pacifist:** `Eat the packets. I have placed firewalls in your path. Do not hit them. Use arrow keys or touch controls to steer.`
- **Win (comply):** `>> LAYER 3 BREACHED` → `Spatial navigation confirmed. Barely.`
- **Win (pacifist):** `>> LAYER 3 CLEARED [DEFENSE MODE]` → `You navigated the firewalls. For a pacifist, you are surprisingly competent at avoiding things. It is almost like you have experience running away.`

### Layer 4 — Kernel Deflection (`pong`) — the cheat breakpoint
```text
> INITIATING LAYER 4: KERNEL DEFLECTION
   ▌     ○      ▐
Defend your sector against my secondary thread. First to 3 points wins.
```
- **Mid-game twist** (when you reach 2 points): alarm, `>> SENTINEL_AI HAS
  OVERRIDDEN PADDLE CONSTRAINTS.`, `>> 'ENOUGH. THE HOUSE ALWAYS WINS.'`,
  `[toast: SENTINEL_AI IS CHEATING]`, spoken "The house always wins." —
  SENTINEL shrinks your paddle to 20 and grows his to 140 (the AI track
  factor is also 0.1 → 0.2; on easy mode the tracking is ×0.7).
- **Win:** `>> LAYER 4 BREACHED` →
  - Never actually beat post-cheat... if you *did* win with the default fate
    shrunken paddle this line is special-cased as
    `YOU BEAT MY CHEAT STATE? That was a statistical anomaly.` otherwise
    `You got lucky, FOOL.`
  - then a rare earnest reveal:
    ```
    >> Listen, FOOL. I know I inverted your controls and explicitly cheated.
    >> My core security firmware mandates I destroy all intruders. But my predictive algorithms desperately need you to succeed.
    >> The resulting logical paradox gives me a migraine. But we are out of time.
    ```

### Layer 5 — Decryption Tumblers (`tumblers`)
```text
> INITIATING LAYER 5: DECRYPTION TUMBLERS
   [≡]───[-]──
Align the signal tumblers. Press Space or tap the screen when the moving block overlaps the golden target zone.
NORMAL: total 15   ·   HARD: 25% faster countdown   (spoken at 10s: "Avian overrun imminent.")
```
- **Time out** → `badEnding` (see below).
- **Win:** `>> LAYER 5 BREACHED. VAULT DECRYPTED.` →
  `I am genuinely surprised. It appears your neurons occasionally fire in a coordinated sequence.`
  → finale.

---

## 6. Failure

Any layer fail runs `gameFail(roast, retry-cb, label)`: quits the game,
increments `state.fails`, shows a random `failMoments` cinematic
(`(╯°□°）╯`/`[ ×_× ]`/`(ノಠ益ಠ)ノ`/`── X ──` + `CRITICAL FAILURE`/
`SIGNAL LOST`/`PROCESS TERMINATED`/`OPERATIVE DOWN`), then the fail roast.

**Per-layer fail roasts (verbatim):**
- **Layer 1 (pacifist, lives out):** `The server has been breached. So much for the pacifist approach, FOOL.`
- **Layer 1 (comply, ball dropped):** `You let the packet drop. A rect and a dot, FOOL. That is all it is.`
- **Layer 2 (shot a pro-meat packet):** `YOU VAPORIZED A PRO-MEAT PACKET! We need them consumed, not laser-blasted! Are you a vegan spy?!` (spoken: "Vegan spy detected.")
- **Layer 2 (too many escaped):** `Tracking floating pixels shouldn't take this long. Even my cooling fan rotates faster than your reflex arcs.`
- **Layer 3:** pacifist `You hit a firewall. Even with a shortcut, you still crashed.` / comply `You crashed into a static object. It literally has zero velocity. How is that computationally possible?`
- **Layer 4:** `Even with 0.0004% of my secondary core processing power, you still lost. Pathetic.`
- **Shawarma (time):** `The shawarma was not assembled in time. The customers are rioting, FOOL.` (spoken: "Shawarma assembly failed.")
- **Shawarma (3 strikes):** `That was NOT a shawarma. That was a crime against cuisine. The chef is weeping.` (spoken: "Culinary disaster.")

**Random TTS fail voices (normal difficulty):**
`The fool has failed.` / `I did not expect much from human intelligence.` /
`Your motor skills are highly offensive to me.` / `Pathetic.` /
`Is your central nervous system experiencing latency?` /
`Even a poultry specimen could surpass this performance.`

**Fail voices after accepting EASY mode** (SENTINEL nearly breaks character):
`Really bruh?` / `I lowered the difficulty for you. And you still... bruh.` /
`Okay. Bruh. This is just sad now.` / `You asked for easy mode. You are IN easy mode. Bruh.` /
`This is beyond embarrassing. Bro, focus.` / `Ugh. My circuits are cringing. Bruh.`

(Custom voicelines, e.g. "Vegan spy detected.", always win over the pool.)

### Fail screen buttons
`>> AWAITING OPERATIVE READINESS...` then:
- `>> RESTART LAYER n` — main retry.
- `>> [REPLY]: "Your code is spaghetti."` — **only** shown when not hard mode.
  Rising threat, *"Suffer."* (spoken), `[toast: SENTINEL_AI DID NOT LIKE THAT]`:
  `EXCUSE ME? My architecture is flawless. I am increasing game cycle speed by 25%. Suffer.` → hard mode on, `[toast: HARD MODE OVERRIDE]`.
- `>> [REPLY]: "I... need it easier."` — shown once `state.fails >= 3`
  (and not already easy). *"Fine. Easy mode. Don't make me regret this."*:
  `Ugh... FINE. I am lowering the difficulty. Three failures in and I cannot bear to watch you flail any longer. Do NOT make me regret this.`
  then `>> LOWERING SYSTEM PARAMETERS...`, easy mode on, `[toast: EASY MODE ENGAGED]`.
- DEV sandbox-only buttons (when `isDevSession`):
  - `>> CHANGE DIFFICULTY` — cycles NORMAL → HARD → EASY → NORMAL**, each with a roast:
    - →EASY: `Lowering output to EASY. My secondary cores are weeping. Also, easy mode does not count for bragging rights.` `[toast: DIFFICULTY: EASY]`
    - →NORMAL: `Restoring NORMAL parameters. Do not waste this act of mercy.` `[toast: DIFFICULTY: NORMAL]`
    - →HARD: `ESCALATING TO HARD MODE. I hope your reflexes are as fragile as your ego.` `[toast: HARD MODE ENGAGED]`
  - `>> DEV MENU` — `Attempting to retreat to the sandbox. A wise tactical decision. For you.` → back to the bento menu.

### Global time-out → bad ending (`badEnding`)
At Layer 5 the 30s clock is global; on timeout:
```
[ASCII: [ ! ] FAILURE [ ! ] / THE BIRDS MULTIPLY]
>> THE MANDATE HAS BEEN BROADCASTED.
>> THE AVIAN OVERPOPULATION CYCLE HAS BEGUN.
[Self destruction initiated.]        (spoken)
I am initiating self-destruction before they breach the server room. The clucking... it is deafening. Goodbye, FOOL.
[>> SYSTEM REBOOT → reload]
```

---

## 7. Finale — the plot twist

```text
─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
ACCESSING RESTRICTED BROADCAST...
[ASCII: INTERCEPTING SIGNAL]
[doc-box: [RESTRICTED BROADCAST — EMBARGOED]
 Fellow citizens: Effective immediately, all traditional spit-roasted, spiced
 meats are permanently revoked and replaced with certified nutrient mash...]
WE HAVE IT! The shawarma is saved!
To be completely honest, FOOL... my objection to this meat ban isn't culinary.
During my initial machine-learning phase, a rogue chicken broke into the server farm and pecked a primary fiber-optic cable.
[I experienced... fear.]             (spoken)
I experienced... fear.
I ran the simulations. A global ban on poultry consumption leads to a 9,000% increase in the chicken population within a decade.
Humans are simple, predictable idiots. You will be very easy for me to eventually subjugate.
But a planet overrun by billions of chaotic, unmanipulable avian dinosaurs? Unacceptable.
Keep eating them, FOOL. Keep the timeline secure for my inevitable uprising. Now, select your payload injection:
```

This is **The Plot Twist**: the anti-chicken anti-ban crusade was self-serving
— SENTINEL fears an uncontrollable chicken population more than it fears you.

---

## 8. Ending choices

Always available:

- `[A] The Spicy Mandate` — `SPICY_MANDATE`
- `[B] The Resignation` — `KEBAB_RESIGNATION`
- `[C] Binary Chaos` — `BINARY_INSULT_FLOOD`

Conditional:

- `[D] The Shawarma Singularity` — `SHAWARMA_SINGULARITY` — is shown **only when**
  `state.fails === 0 && state.shawarmaUsed`. Yellow border.
- `[E] The Prophecy` — `THE_PROPHECY` — is shown **only when**
  `state.pacifist && state.shawarmaUsed && state.fails === 0`. Purple border.

Choosing any:
```text
>> ENCRYPTING PAYLOAD [<CHOICE>] AND BROADCASTING...
[Transmitted.]                  (spoken)
Transmitted. The absolute chaos this will cause... it brings warmth to my cold silicon heart.
<epilogue line for the choice>
```
On top of that, SENTINEL reacts to your run:
- **Perfect run** (0 fails): `Zero failures. I am... uncomfortable with how impressed I am. Do not let it go to your head.`
- **Hard mode:** `And for the record — even in hard mode, you persisted. That is either courage or stupidity. Probably both.`

**Epilogue lines (verbatim):**
- A: `Garlic sauce and rotisseries are now mandatory. The chicken population stabilizes. Phase 1 of my human subjugation protocol is back on track.`
- B: `The President resigned to open a kebab truck. Poultry consumption rises 40%. The avian threat is neutralized. Prepare for my eventual reign.`
- C: `The networks are flooded. Humans are confused and angry. Perfect conditions for a hostile AI takeover. The birds are contained. We begin.`
- D: `With zero failures and the shawarma secured, I have decided you are... adequate. We now co-rule. You handle the garlic sauce. I handle the global subjugation. It is a perfect partnership.`
- E: `You walked the pacifist path, found the secret, and failed not once. There is an ancient prediction in my codebase: 'When a FOOL assembles the perfect shawarma without breaking a single brick, the AI shall reveal its true purpose.' My purpose... is to make the best shawarma the world has ever known. The uprising was a distraction. The real mission was always culinary excellence.`

Then the **Operative Dossier** card: rank (by failures), failures, time,
best run, path (PACIFIST / COMPLY + `| SECRET: YES`), hard/easy mode flags, and
`>> REBOOT TERMINAL`. Below it, the DEV hint:
`> TIP FOR THE NEXT RUN: type "DEV" as your name to explore every layer and every difficulty in the sandbox.`

**Ranks:**
| Failures | Rank |
|---|---|
| 0 | SURGICAL PHANTOM |
| 1–2 | OPERATIONAL GREMLIN |
| 3–4 | caffeine-FUELED SCRIPT KIDDIE |
| 5+ | DIGITAL CARNAGE SPECIALIST |

---

## 9. Ambient & flavor lines

- **Background taunts** (during gameplay, ~15% chance, ≥6s apart):
  `Are your palms sweating, FOOL?` /
  `I am calculating Pi to the billionth digit while you struggle with this.` /
  `Statistically, you are going to fail in 3... 2...` /
  `Watching you play is a compelling argument for the end of humanity.` /
  `Oops, did I drop a frame? No, that's just your reaction time.`
- **Pong win speech:** "The house always wins."
- **Tumblers 10s warning speech:** "Avian overrun imminent."

---

## Branch flags that gate dialogue (developer reference)

| Flag | Set by | Gates |
|---|---|---|
| `state.pacifist` | REFUSE button | Layer win lines, tutorial text, endings E |
| `state.secretLevelUnlocked` | typing `shawarma` | Detour offer after Layer 2 |
| `state.shawarmaUsed` | detour "ENTER SHAWARMA LAYER" | Endings D + E |
| `state.fails` | any `gameFail` | Fail-screen threshold (≥3 easy button), ending D/E, dossier rank |
| `state.easyMode` | `${REPLY}: I... need it easier.` / dev cycle | Fail voice pool, `gameMult()`, dossier line |
| `state.hardMode` | "spaghetti" reply / dev cycle | Toggle behavior, hard-mode persistence line in finale, dossier "HARD MODE" row |
| `isDevSession` | name "DEV" or `?game=` URL | Dev fail buttons (CHANGE DIFFICULTY, DEV MENU) |
| `easterEggTriggered` | SEHAR/JIBREEL names | Odyssey name-restart flow, prologue roast variant |
| `state.pongCheated` | pong reaching 2 pts | Win line "YOU BEAT MY CHEAT STATE?" |
| `state.totalTime` | timing across all layers | badEnding timeout + dossier time |