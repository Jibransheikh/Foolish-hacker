# foolish_hacker.sh

A terminal-style narrative game where SENTINEL_AI orders you to intercept a
broadcast that would ban all natural meat — against humanity, or for it?

## Run it

Open `index.html` in any modern browser. No build step, no dependencies. The
big glowing button unlocks audio (browser autoplay policy requires the click).

## Play

Complying vs. refusing a mission changes the game (`PACIFIST` path), failures
make SENTINEL increasingly hostile, and calling its code "spaghetti" unlocks
hard mode (+25% speed). Win with zero failures, and more paths open up.
Type `shawarma` when prompted for a hidden level.

### The 5 layers
1. **Brick Blaster** — bounce the ball, break the encryption bricks (+ a pacifist *Defense* variant)
2. **Daemon Target Hunt** — click the `ERR` daemons, never shoot the `WRAP` packets
3. **Routing Worm** — snake, but the packets are mission-critical
4. **Kernel Deflection** — pong vs. an AI that starts cheating at 2–0
5. **Decryption Tumblers** — lock the signal tumblers before the broadcast goes live

### Controls
| Action | Keys | Touch |
|---|---|---|
| Move / steer | `← → ↑ ↓` or `W A S D` | On-screen buttons, swipe on canvas |
| Fire / lock | `Space` | Tap the canvas |

## Dev shortcut

`index.html?game=1` … `index.html?game=5` (or `?game=bricks`, `duckhunt`, …)
jumps straight into a layer, skipping the intro.

## Structure

```
index.html            shell + overlays
css/style.css         all styling
js/
  data.js             scripted lines, ASCII art, failure moments
  audio.js            Web Audio synth (drone + SFX), mute-aware
  speech.js           Web Speech API robot voice, mute-aware
  terminal.js         terminal engine, fail/pause state
  controls.js         input (keyboard/touch), canvas DPR fitting
  story.js            narrative flow, settings & mute UI
  games/              bricks, duckhunt, snake, pong, tumblers, shawarma
  debug.js            ?game= shortcut
```

Progress (best time / failures), settings and mute state persist via
`localStorage`. Muting is available via the 🔊 button in the title bar or
the ⚙ settings panel.

## License

GPL-3.0 — see [LICENSE](LICENSE).