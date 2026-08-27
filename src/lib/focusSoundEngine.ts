// Procedural Web Audio Ambient Soundscape Generator for Clayverse AI Focus Mode

export type SoundscapeType = 'off' | 'rain' | 'whiteNoise' | 'deepSpace' | 'binaural';

class FocusSoundEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentType: SoundscapeType = 'off';
  private currentVolume: number = 0.35;
  private activeNodes: Array<{ stop?: () => void; disconnect: () => void }> = [];
  private listeners: Array<(type: SoundscapeType, volume: number) => void> = [];

  constructor() {
    // Lazy init on first user interaction
  }

  private getContext(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public getSoundType(): SoundscapeType {
    return this.currentType;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.audioCtx.currentTime);
    }
    this.notify();
  }

  public setSoundType(type: SoundscapeType) {
    if (type === this.currentType) return;
    this.stop();
    this.currentType = type;

    if (type !== 'off') {
      this.start(type);
    }
    this.notify();
  }

  public toggleSound(type: SoundscapeType) {
    if (this.currentType === type) {
      this.setSoundType('off');
    } else {
      this.setSoundType(type);
    }
  }

  public stop() {
    try {
      this.activeNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch (e) {}
      });
      this.activeNodes = [];

      if (this.masterGain && this.audioCtx) {
        this.masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        this.masterGain.disconnect();
        this.masterGain = null;
      }
    } catch (e) {}
    this.currentType = 'off';
    this.notify();
  }

  private start(type: SoundscapeType) {
    try {
      const ctx = this.getContext();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(Math.max(0.01, this.currentVolume), ctx.currentTime + 0.5);
      master.connect(ctx.destination);
      this.masterGain = master;

      if (type === 'rain') {
        // High quality multi-filtered procedural rainfall
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        // Lowpass filter for heavy raindrops
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(750, ctx.currentTime);

        // Highpass filter to eliminate muddy hum
        const highpass = ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.setValueAtTime(80, ctx.currentTime);

        noise.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(master);

        noise.start();
        this.activeNodes.push(noise, highpass, lowpass);

      } else if (type === 'whiteNoise') {
        // Gentle full-spectrum pink/white focus noise
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);

        noise.connect(filter);
        filter.connect(master);
        noise.start();
        this.activeNodes.push(noise, filter);

      } else if (type === 'deepSpace') {
        // Multi-layered cosmic resonant drone (108Hz + 162Hz + 216Hz harmonic stack with LFO sweep)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(108, ctx.currentTime); // Deep resonant root
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(162, ctx.currentTime); // Perfect fifth harmonic
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(216, ctx.currentTime); // Octave overtone

        // Subtle 0.08Hz slow breathing LFO sweep
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
        lfoGain.gain.setValueAtTime(15, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
        filter.Q.setValueAtTime(3.0, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.25, ctx.currentTime);

        osc1.connect(oscGain);
        osc2.connect(oscGain);
        osc3.connect(oscGain);
        oscGain.connect(filter);
        filter.connect(master);

        osc1.start();
        osc2.start();
        osc3.start();
        lfo.start();
        this.activeNodes.push(osc1, osc2, osc3, lfo, lfoGain, oscGain, filter);

      } else if (type === 'binaural') {
        // 40Hz Gamma Focus Frequency (200Hz Left, 240Hz Right)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(200, ctx.currentTime);
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(240, ctx.currentTime);

        if (panL && panR) {
          panL.pan.setValueAtTime(-1, ctx.currentTime);
          panR.pan.setValueAtTime(1, ctx.currentTime);
          oscL.connect(panL);
          panL.connect(master);
          oscR.connect(panR);
          panR.connect(master);
          this.activeNodes.push(oscL, oscR, panL, panR);
        } else {
          oscL.connect(master);
          oscR.connect(master);
          this.activeNodes.push(oscL, oscR);
        }

        oscL.start();
        oscR.start();
      }
    } catch (e) {
      console.warn("Could not start ambient soundscape:", e);
    }
  }

  public subscribe(listener: (type: SoundscapeType, volume: number) => void) {
    this.listeners.push(listener);
    listener(this.currentType, this.currentVolume);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentType, this.currentVolume));
  }
}

export const focusSoundEngine = new FocusSoundEngine();
