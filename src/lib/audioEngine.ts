// Real-time Web Audio Synthesizer and Text-to-Speech Engine for Clay
// Synthesizes a lo-fi ambient track in real-time and manages narration.

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isAmbientPlaying: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private onSpeakStateChange: ((speaking: boolean) => void) | null = null;

  // Synthesizer nodes
  private masterVolume: GainNode | null = null;
  private padOscs: OscillatorNode[] = [];
  private padGains: GainNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private crackleNode: ScriptProcessorNode | null = null;
  private drumInterval: any = null;
  private userVolume: number = 50; // Default 50 (0-100)
  private userSpeechRate: number = 0.96; // Default 0.96 (0.5 to 2.0)
  private userPitch: number = 1.15; // Default 1.15 (0.5 to 2.0)
  private crackleEnabled: boolean = true; // Default true

  constructor() {
    // Check if SpeechSynthesis is supported
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Reset on start
    }
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('clay_ambient_volume');
      if (savedVolume !== null) {
        const parsed = parseInt(savedVolume, 10);
        if (!isNaN(parsed)) {
          this.userVolume = Math.max(0, Math.min(100, parsed));
        }
      }
      
      const savedRate = localStorage.getItem('clay_speech_rate');
      if (savedRate !== null) {
        const parsed = parseFloat(savedRate);
        if (!isNaN(parsed)) {
          this.userSpeechRate = Math.max(0.5, Math.min(2.0, parsed));
        }
      }

      const savedPitch = localStorage.getItem('clay_speech_pitch');
      if (savedPitch !== null) {
        const parsed = parseFloat(savedPitch);
        if (!isNaN(parsed)) {
          this.userPitch = Math.max(0.5, Math.min(2.0, parsed));
        }
      }
      
      const savedCrackle = localStorage.getItem('clay_crackle_enabled');
      this.crackleEnabled = savedCrackle !== 'false';
    }
  }

  getVolume(): number {
    return this.userVolume;
  }

  setVolume(vol: number) {
    this.userVolume = Math.max(0, Math.min(100, vol));
    if (typeof window !== 'undefined') {
      localStorage.setItem('clay_ambient_volume', this.userVolume.toString());
      // Dispatch event to sync settings dialogs
      window.dispatchEvent(new Event('clay_volume_changed'));
    }
    
    if (this.masterVolume && this.ctx) {
      const gainVal = this.getGainValue();
      this.masterVolume.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    }
  }

  getSpeechRate(): number {
    return this.userSpeechRate;
  }

  setSpeechRate(rate: number) {
    this.userSpeechRate = Math.max(0.5, Math.min(2.0, rate));
    if (typeof window !== 'undefined') {
      localStorage.setItem('clay_speech_rate', this.userSpeechRate.toString());
    }
  }

  isCrackleEnabled(): boolean {
    return this.crackleEnabled;
  }

  setCrackleEnabled(enabled: boolean) {
    this.crackleEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('clay_crackle_enabled', String(enabled));
    }
  }

  getPitch(): number {
    return this.userPitch;
  }

  setPitch(pitch: number) {
    this.userPitch = Math.max(0.5, Math.min(2.0, pitch));
    if (typeof window !== 'undefined') {
      localStorage.setItem('clay_speech_pitch', this.userPitch.toString());
    }
  }

  private getGainValue(): number {
    // Maps 0-100 to 0-0.16 gain (so 50 maps to the original 0.08)
    return (this.userVolume / 100) * 0.16;
  }

  setSpeakStateListener(listener: (speaking: boolean) => void) {
    this.onSpeakStateChange = listener;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- LO-FI CHILL SYNTHESISER ---
  startAmbientLooper() {
    this.initContext();
    if (!this.ctx || this.isAmbientPlaying) return;

    this.isAmbientPlaying = true;
    const ctx = this.ctx;

    // Master volume set to low level for ambient background
    this.masterVolume = ctx.createGain();
    this.masterVolume.gain.setValueAtTime(this.getGainValue(), ctx.currentTime);
    this.masterVolume.connect(ctx.destination);

    // Warm Lowpass Filter
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(650, ctx.currentTime);
    this.filter.Q.setValueAtTime(1.5, ctx.currentTime);
    this.filter.connect(this.masterVolume);

    // Tape wow/flutter LFO
    this.lfo = ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.25, ctx.currentTime); // very slow 4-second cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(150, ctx.currentTime); // modulates filter cutoff slightly
    this.lfo.connect(lfoGain);
    if (this.filter) {
      lfoGain.connect(this.filter.frequency);
    }
    this.lfo.start();

    // Start Synthesized Warm Chords
    this.startChords();

    // Start Vinyl Crackle
    this.startVinylCrackle();

    // Start Soft Drum Beat
    this.startBeats();
  }

  stopAmbientLooper() {
    this.isAmbientPlaying = false;
    clearInterval(this.drumInterval);

    // Stop and cleanup nodes
    this.padOscs.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.padOscs = [];
    this.padGains = [];

    if (this.lfo) {
      try { this.lfo.stop(); } catch (e) {}
      this.lfo = null;
    }

    if (this.crackleNode) {
      this.crackleNode.disconnect();
      this.crackleNode = null;
    }

    if (this.masterVolume) {
      this.masterVolume.disconnect();
      this.masterVolume = null;
    }
  }

  private startChords() {
    if (!this.ctx || !this.filter) return;
    const ctx = this.ctx;

    // Lofi progression chords frequencies (Hz)
    // Cmaj9 (C3, E3, G3, B3, D4)
    // Am9   (A2, C3, E3, G3, B3)
    // Fmaj9 (F2, A3, C4, E4, G4)
    // G11   (G2, B3, D4, F4, A4)
    const chordList = [
      [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
      [110.00, 130.81, 164.81, 196.00, 246.94], // Am9
      [87.31, 220.00, 261.63, 329.63, 392.00],  // Fmaj9
      [98.00, 246.94, 293.66, 349.23, 440.00],  // G11
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.isAmbientPlaying) return;

      // Fade out previous notes if any
      const now = ctx.currentTime;
      this.padGains.forEach(gainNode => {
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      });

      // Clear completed oscs after they fade out
      const oldOscs = this.padOscs;
      setTimeout(() => {
        oldOscs.forEach(osc => {
          try { osc.stop(); } catch (e) {}
        });
      }, 2000);

      this.padOscs = [];
      this.padGains = [];

      // Play new chord
      const freqs = chordList[chordIndex];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Use soft triangle waves for lo-fi warmth
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Micro-detune to create lush chorus tape effect
        osc.detune.setValueAtTime((Math.random() - 0.5) * 12, now);

        gainNode.gain.setValueAtTime(0, now);
        // Soft slow attack
        gainNode.gain.linearRampToValueAtTime(0.04 / freqs.length, now + 2.5);

        osc.connect(gainNode);
        if (this.filter) {
          gainNode.connect(this.filter);
        }

        osc.start(now);
        this.padOscs.push(osc);
        this.padGains.push(gainNode);
      });

      chordIndex = (chordIndex + 1) % chordList.length;

      // Schedule next chord in 8 seconds
      setTimeout(playNextChord, 8000);
    };

    playNextChord();
  }

  private startVinylCrackle() {
    if (!this.ctx || !this.masterVolume) return;
    const ctx = this.ctx;

    // Create a procedural noise node for crackling sounds
    const bufferSize = 4096;
    this.crackleNode = ctx.createScriptProcessor(bufferSize, 1, 1);
    
    this.crackleNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      if (!this.crackleEnabled) {
        for (let i = 0; i < bufferSize; i++) {
          output[i] = 0;
        }
        return;
      }
      for (let i = 0; i < bufferSize; i++) {
        // Continuous low background hum/noise
        let noise = (Math.random() * 2 - 1) * 0.003;
        
        // Random clicks and dust crackles
        if (Math.random() > 0.9992) {
          // Add a high amplitude click
          const clickAmp = (Math.random() * 0.3 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
          noise += clickAmp;
        }
        
        output[i] = noise;
      }
    };

    // Filter crackle to make it warm
    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.setValueAtTime(1200, ctx.currentTime);
    crackleFilter.Q.setValueAtTime(1.0, ctx.currentTime);

    this.crackleNode.connect(crackleFilter);
    crackleFilter.connect(this.masterVolume);
  }

  private startBeats() {
    if (!this.ctx || !this.masterVolume) return;
    const ctx = this.ctx;

    // Gentle 70 BPM lofi pattern
    // Beat 1: Kick, Beat 2: Hihat, Beat 3: Snare, Beat 4: Hihat
    let beatStep = 0;
    const intervalMs = (60 / 70) * 1000; // time per beat

    const triggerKick = (time: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      if (this.masterVolume) gain.connect(this.masterVolume);

      osc.frequency.setValueAtTime(120, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.25);
      
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

      osc.start(time);
      osc.stop(time + 0.3);
    };

    const triggerHihat = (time: number) => {
      // White noise hi-hat
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, time);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.015, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      if (this.masterVolume) gain.connect(this.masterVolume);

      noise.start(time);
      noise.stop(time + 0.05);
    };

    const triggerSnare = (time: number) => {
      // Soft brushed lofi snare
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, time);
      filter.Q.setValueAtTime(1.2, time);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      if (this.masterVolume) gain.connect(this.masterVolume);

      noise.start(time);
      noise.stop(time + 0.18);
    };

    this.drumInterval = setInterval(() => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;

      if (beatStep === 0) {
        triggerKick(now);
      } else if (beatStep === 1 || beatStep === 3) {
        if (Math.random() > 0.2) triggerHihat(now);
      } else if (beatStep === 2) {
        triggerSnare(now);
      }

      beatStep = (beatStep + 1) % 4;
    }, intervalMs);
  }

  // --- TEXT TO SPEECH NARRATION ---
  private activeSectionQueue: {
    sectionId: string;
    sentences: string[];
    currentIndex: number;
    langCode: string;
    onSentenceChange?: (index: number) => void;
    onEnd?: () => void;
  } | null = null;

  pauseSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
      if (this.onSpeakStateChange) this.onSpeakStateChange(false);
      window.dispatchEvent(new CustomEvent('clay_narration_state_changed', {
        detail: { status: 'paused', sectionId: this.activeSectionQueue?.sectionId }
      }));
    }
  }

  resumeSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.resume();
      if (this.onSpeakStateChange) this.onSpeakStateChange(true);
      window.dispatchEvent(new CustomEvent('clay_narration_state_changed', {
        detail: { status: 'playing', sectionId: this.activeSectionQueue?.sectionId }
      }));
    }
  }

  isPaused(): boolean {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      return window.speechSynthesis.paused;
    }
    return false;
  }

  getCurrentSectionId(): string | null {
    return this.activeSectionQueue?.sectionId || null;
  }

  speakSectionSentences(
    sectionId: string,
    sentences: string[],
    langCode: string = 'en',
    onSentenceChange?: (index: number) => void,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    this.stopSpeaking();

    if (!sentences || sentences.length === 0) return;

    this.activeSectionQueue = {
      sectionId,
      sentences,
      currentIndex: 0,
      langCode,
      onSentenceChange,
      onEnd
    };

    this.playNextSentence();
  }

  private playNextSentence() {
    if (!this.activeSectionQueue) return;

    const { sectionId, sentences, currentIndex, langCode, onSentenceChange, onEnd } = this.activeSectionQueue;

    if (currentIndex >= sentences.length) {
      this.activeSectionQueue = null;
      if (this.onSpeakStateChange) this.onSpeakStateChange(false);
      window.dispatchEvent(new CustomEvent('clay_narration_state_changed', {
        detail: { status: 'stopped', sectionId }
      }));
      if (onEnd) onEnd();
      return;
    }

    const currentSentence = sentences[currentIndex];
    if (onSentenceChange) onSentenceChange(currentIndex);

    window.dispatchEvent(new CustomEvent('clay_narration_state_changed', {
      detail: {
        status: 'playing',
        sectionId,
        sentenceIndex: currentIndex,
        totalSentences: sentences.length,
        sentenceText: currentSentence
      }
    }));

    this.speak(currentSentence, langCode, () => {
      if (this.activeSectionQueue && this.activeSectionQueue.sectionId === sectionId) {
        this.activeSectionQueue.currentIndex += 1;
        // Small pleasant pause between sentences
        setTimeout(() => {
          this.playNextSentence();
        }, 180);
      }
    });
  }

  speak(text: string, langCode: string = 'en', onEnd?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Cancel any active speech

    // Clean text of markdown
    const cleanText = text
      .replace(/[\*\_\#\`]/g, '')
      .replace(/claymorphic/gi, 'tactile') // Just in case
      .trim();

    this.activeUtterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose voice
    const voices = window.speechSynthesis.getVoices();
    let preferredVoice: SpeechSynthesisVoice | null = null;

    // Helper to find premium / natural / neural voices
    const findBestVoice = (lang: string, fallbackPrefixes: string[]): SpeechSynthesisVoice | null => {
      const lowerLang = lang.toLowerCase();
      
      // Tier 1: Natural, Neural, Premium or Google/Microsoft modern voices
      let found = voices.find(v => 
        v.lang.toLowerCase().replace('_', '-').startsWith(lowerLang) && (
          v.name.toLowerCase().includes('natural') || 
          v.name.toLowerCase().includes('neural') || 
          v.name.toLowerCase().includes('premium') ||
          v.name.toLowerCase().includes('siri') ||
          v.name.toLowerCase().includes('google')
        )
      );
      if (found) return found;

      // Tier 2: Specific matching voice names
      found = voices.find(v => 
        v.lang.toLowerCase().replace('_', '-').startsWith(lowerLang) && (
          v.name.toLowerCase().includes('david') || 
          v.name.toLowerCase().includes('ravi') || 
          v.name.toLowerCase().includes('heera') || 
          v.name.toLowerCase().includes('harsh') ||
          v.name.toLowerCase().includes('neerja') ||
          v.name.toLowerCase().includes('geeta') ||
          v.name.toLowerCase().includes('swapna')
        )
      );
      if (found) return found;

      // Tier 3: General language match
      found = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(lowerLang));
      if (found) return found;

      // Tier 4: Fallbacks
      for (const prefix of fallbackPrefixes) {
        const lowerPrefix = prefix.toLowerCase();
        found = voices.find(v => 
          v.lang.toLowerCase().replace('_', '-').startsWith(lowerPrefix) && (
            v.name.toLowerCase().includes('natural') || 
            v.name.toLowerCase().includes('google')
          )
        );
        if (found) return found;

        found = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(lowerPrefix));
        if (found) return found;
      }

      return null;
    };

    if (langCode === 'te') {
      preferredVoice = findBestVoice('te-in', ['te', 'hi-in', 'en-in']);
    } else if (langCode === 'hi') {
      preferredVoice = findBestVoice('hi-in', ['hi', 'ur-in', 'en-in']);
    } else if (langCode === 'ur' || langCode === 'hyd') {
      // For Urdu & Hyderabadi: ur-IN or hi-IN, fallback en-IN
      preferredVoice = findBestVoice('ur-in', ['ur', 'hi-in', 'hi', 'en-in']);
      if (!preferredVoice) {
        preferredVoice = findBestVoice('hi', ['ur', 'en-in']);
      }
    } else if (langCode === 'ta') {
      preferredVoice = findBestVoice('ta-in', ['ta', 'en-in']);
    } else if (langCode === 'kn') {
      preferredVoice = findBestVoice('kn-in', ['kn', 'en-in']);
    } else if (langCode === 'ml') {
      preferredVoice = findBestVoice('ml-in', ['ml', 'en-in']);
    } else if (langCode === 'bn') {
      preferredVoice = findBestVoice('bn-in', ['bn', 'hi-in', 'en-in']);
    } else if (langCode === 'mr') {
      preferredVoice = findBestVoice('mr-in', ['mr', 'hi-in', 'en-in']);
    } else if (langCode === 'gu') {
      preferredVoice = findBestVoice('gu-in', ['gu', 'hi-in', 'en-in']);
    } else if (langCode === 'pa') {
      preferredVoice = findBestVoice('pa-in', ['pa', 'hi-in', 'en-in']);
    } else {
      // English default
      preferredVoice = findBestVoice('en-us', ['en', 'en-gb', 'en-in']);
    }

    if (preferredVoice) {
      this.activeUtterance.voice = preferredVoice;
    }

    // Set properties for a soft, precise, and highly listenable narrator voice
    const rateFactor = (this.userSpeechRate || 1.0);
    if (langCode === 'hyd' || langCode === 'ur' || langCode === 'hi' || langCode === 'te') {
      this.activeUtterance.pitch = this.userPitch || 1.05; // Warm, friendly regional tone
      this.activeUtterance.rate = 0.94 * rateFactor;  // Slower, clear pacing for regional dialect readability
    } else {
      this.activeUtterance.pitch = this.userPitch || 1.1;  // Crisp, engaging youthful English voice
      this.activeUtterance.rate = 0.96 * rateFactor;  // Paced beautifully for easy listening
    }
    this.activeUtterance.volume = Math.max(0, Math.min(1, this.userVolume / 100)); // Comfortable volume level

    this.activeUtterance.onstart = () => {
      if (this.onSpeakStateChange) this.onSpeakStateChange(true);
    };

    this.activeUtterance.onend = () => {
      if (this.onSpeakStateChange) this.onSpeakStateChange(false);
      if (onEnd) onEnd();
    };

    this.activeUtterance.onerror = () => {
      if (this.onSpeakStateChange) this.onSpeakStateChange(false);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(this.activeUtterance);
  }

  stopSpeaking() {
    this.activeSectionQueue = null;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (this.onSpeakStateChange) this.onSpeakStateChange(false);
      window.dispatchEvent(new CustomEvent('clay_narration_state_changed', {
        detail: { status: 'stopped' }
      }));
    }
  }

  isCurrentlySpeaking(): boolean {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }

  playLoFiChord() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      // Synthesize a soft warm chime chord for tactile feedback
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.04, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + 1.3);
      });
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  playPop() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      // Ignore audio synthesis errors on strict autoplay environments
    }
  }

  playClick() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      // Ignore
    }
  }

  playChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      [880, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.03, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + 0.7);
      });
    } catch (e) {
      // Ignore
    }
  }
}

export const audioEngine = new AudioEngine();
