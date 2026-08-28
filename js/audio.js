/* ── WEB AUDIO API SYNTHESIZER ───────────────────────────── */
const Sfx = {
  ctx: null, droneOsc: null, droneGain: null, muted: false,
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = 'sine';
    this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    this.droneOsc.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);
    this.droneOsc.start();
    this.updateDrone();
  },
  updateDrone() {
    if (!this.ctx || !this.droneGain) return;
    const muted = this.muted || (typeof settings !== 'undefined' && !settings.sfxOn);
    this.droneGain.gain.setTargetAtTime(muted ? 0 : 0.04, this.ctx.currentTime, 0.05);
  },
  playTone(freq, type, duration, vol) {
    if (!this.ctx || this.muted || (typeof settings !== 'undefined' && !settings.sfxOn)) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  noise(dur, vol) {
    if (!this.ctx || this.muted || (typeof settings !== 'undefined' && !settings.sfxOn)) return;
    const bufSize = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const n = this.ctx.createBufferSource();
    n.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    n.connect(gain);
    gain.connect(this.ctx.destination);
    n.start();
  },
  tick() { this.playTone(800 + Math.random()*400, 'sine', 0.05, 0.015); }, 
  blip() { this.playTone(600, 'square', 0.1, 0.04); }, 
  bloop() { this.playTone(300, 'sine', 0.1, 0.06); }, 
  ping() { this.playTone(1200, 'sine', 0.15, 0.04); }, 
  roast() { this.playTone(150, 'sawtooth', 0.3, 0.06); }, 
  alarm() { this.playTone(400, 'square', 0.4, 0.05); setTimeout(() => this.playTone(450, 'square', 0.4, 0.05), 200); }, 
  shoot() { this.noise(0.08, 0.08); },
  victory() { this.playTone(523, 'sine', 0.12, 0.05); setTimeout(() => this.playTone(659, 'sine', 0.12, 0.05), 100); setTimeout(() => this.playTone(784, 'sine', 0.2, 0.05), 200); }
};

