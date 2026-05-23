let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function sadTrombone() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(300, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8)
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
  osc.start()
  osc.stop(ctx.currentTime + 0.85)
}

function derpyBoing() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(220, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4)
  lfo.frequency.setValueAtTime(10, ctx.currentTime)
  lfoGain.gain.setValueAtTime(80, ctx.currentTime)
  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)
  osc.connect(gain)
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
  lfo.start()
  osc.start()
  lfo.stop(ctx.currentTime + 0.5)
  osc.stop(ctx.currentTime + 0.5)
}

function confusedLaser() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.connect(gain)
  gain.connect(ctx.destination)
  const notes = [800, 400, 1200, 200, 600, 1000, 300, 700]
  notes.forEach((freq, i) => {
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07)
  })
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6)
  osc.start()
  osc.stop(ctx.currentTime + 0.6)
}

function sadWhale() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(160, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 1.2)
  lfo.frequency.setValueAtTime(2.5, ctx.currentTime)
  lfoGain.gain.setValueAtTime(25, ctx.currentTime)
  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)
  osc.connect(gain)
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0.35, ctx.currentTime)
  gain.gain.setValueAtTime(0.35, ctx.currentTime + 0.9)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.3)
  lfo.start()
  osc.start()
  lfo.stop(ctx.currentTime + 1.3)
  osc.stop(ctx.currentTime + 1.3)
}

function glitchBurst() {
  const ctx = getCtx()
  const bufferSize = Math.floor(ctx.sampleRate * 0.25)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25))
  }
  const source = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(1200, ctx.currentTime)
  filter.Q.setValueAtTime(0.8, ctx.currentTime)
  source.buffer = buffer
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0.35, ctx.currentTime)
  source.start()
}

function weirdBlorp() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc2.type = 'sawtooth'
  osc.frequency.setValueAtTime(440, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.4)
  osc2.frequency.setValueAtTime(660, ctx.currentTime)
  osc2.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.4)
  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(ctx.destination)
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45)
  osc.start()
  osc2.start()
  osc.stop(ctx.currentTime + 0.45)
  osc2.stop(ctx.currentTime + 0.45)
}

const SOUNDS = [sadTrombone, derpyBoing, confusedLaser, sadWhale, glitchBurst, weirdBlorp]

export function playRandomSound() {
  try {
    const fn = SOUNDS[Math.floor(Math.random() * SOUNDS.length)]
    fn()
  } catch (e) {
    // Audio unavailable or denied — silently fail
  }
}
