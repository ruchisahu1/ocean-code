const audioCtxRef = { current: null as AudioContext | null };

function getCtx() {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext();
  }
  return audioCtxRef.current;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playMoveSound() {
  playTone(220, 0.12, "sine", 0.08);
  setTimeout(() => playTone(330, 0.1, "sine", 0.06), 50);
}

export function playCollectSound() {
  playTone(523, 0.15, "sine", 0.12);
  setTimeout(() => playTone(659, 0.15, "sine", 0.12), 100);
  setTimeout(() => playTone(784, 0.2, "sine", 0.15), 200);
}

export function playErrorSound() {
  playTone(150, 0.2, "sawtooth", 0.08);
  setTimeout(() => playTone(120, 0.3, "sawtooth", 0.06), 100);
}

export function playCompleteSound() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.3, "sine", 0.12), i * 120);
  });
}

export function playRunSound() {
  playTone(440, 0.08, "square", 0.06);
  setTimeout(() => playTone(550, 0.08, "square", 0.06), 60);
  setTimeout(() => playTone(660, 0.1, "square", 0.08), 120);
}

export function playHazardSound() {
  playTone(80, 0.3, "sawtooth", 0.12);
  playTone(100, 0.25, "square", 0.08);
}

export function playBubbleSound() {
  const freq = 800 + Math.random() * 400;
  playTone(freq, 0.08, "sine", 0.03);
}
