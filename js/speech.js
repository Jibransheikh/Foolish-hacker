/* ── WEB SPEECH API (ROBOTIC VOICE) ──────────────────────── */
const Speech = {
  voices: [],
  init() {
    this.voices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => { this.voices = window.speechSynthesis.getVoices(); };
  },
  say(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.pitch = 0.3; // Deep, robotic pitch
    msg.rate = 0.9;  // Deliberate pacing
    msg.volume = 0.9;
    
    // Prefer standard OS robotic/deadpan voices
    const synthVoice = this.voices.find(v => v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Alex') || v.name.includes('Daniel'));
    if (synthVoice) msg.voice = synthVoice;
    
    window.speechSynthesis.speak(msg);
  }
};

