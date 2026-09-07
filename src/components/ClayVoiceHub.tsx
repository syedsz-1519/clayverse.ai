import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Pause, Play, Settings, Zap } from 'lucide-react';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import {
  synthesizeSpeech,
  stopSpeech,
  isTTSSupported,
  TTSConfig,
} from '../lib/ttsEngine';

interface ClayVoiceHubProps {
  text: string; // Text for Clay to speak
  autoPlay?: boolean; // Auto-play on mount
  speakButtonLabel?: string;
}

export default function ClayVoiceHub({
  text,
  autoPlay = false,
  speakButtonLabel,
}: ClayVoiceHubProps) {
  const { lang, t } = useLanguageMultilingual();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ttsProvider, setTtsProvider] = useState<'webSpeech' | 'googleTranslate'>(
    'webSpeech'
  );
  const [speechRate, setSpeechRate] = useState<0.5 | 0.75 | 1 | 1.25 | 1.5>(1);
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState<number | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isTTSSupported());
  }, []);

  useEffect(() => {
    if (autoPlay && text) {
      handleSpeak();
    }
  }, [autoPlay, text]);

  const handleSpeak = async () => {
    if (!supported) {
      alert('Text-to-Speech is not supported in your browser');
      return;
    }

    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setIsSynthesizing(true);
    setIsPlaying(true);

    const config: TTSConfig = {
      provider: ttsProvider,
      language: lang,
      voiceGender: 'female', // Clay's voice
      speechRate,
      volume,
      pitch: 1.1, // Slightly higher for animated character
    };

    try {
      const result = await synthesizeSpeech(text, config);

      if (result.success) {
        setDuration(result.duration);
        console.log('✅ Clay speaking successfully');
      } else {
        console.error('❌ Speech synthesis failed:', result.error);
        alert(`Failed to generate speech: ${result.error}`);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
    } finally {
      setIsSynthesizing(false);
      // Auto-stop after speech ends
      setTimeout(() => {
        setIsPlaying(false);
      }, (duration || 5) * 1000);
    }
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
  };

  if (!supported) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      {/* Main Speak Button */}
      <motion.button
        onClick={handleSpeak}
        disabled={isSynthesizing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
          isPlaying
            ? 'bg-brand-amber text-white shadow-lg shadow-brand-amber/50'
            : 'bg-brand-amber/10 text-brand-amber hover:bg-brand-amber/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSynthesizing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-4 h-4" />
            </motion.div>
            <span>{t('mascot.playingVoice', 'Playing Voice...')}</span>
          </>
        ) : isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            <span>{t('mascot.stopAudio', 'Pause Narration')}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>{speakButtonLabel || t('mascot.hearClaySpeak', 'Hear Clay Speak')}</span>
          </>
        )}
      </motion.button>

      {/* Settings Toggle */}
      <motion.button
        onClick={() => setShowSettings(!showSettings)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full hover:bg-brand-amber/10 transition-colors text-brand-slate hover:text-brand-amber"
      >
        <Settings className="w-4 h-4" />
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -10 }}
            className="absolute top-full mt-2 left-0 bg-white border border-brand-slate/10 rounded-2xl p-4 w-64 shadow-lg z-50"
          >
            <div className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="text-xs font-bold text-brand-slate uppercase block mb-2">
                  Speech Engine
                </label>
                <div className="flex gap-2">
                  {(['webSpeech', 'googleTranslate'] as const).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setTtsProvider(provider)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        ttsProvider === provider
                          ? 'bg-brand-amber text-white'
                          : 'bg-brand-slate/10 text-brand-slate hover:bg-brand-slate/20'
                      }`}
                    >
                      {provider === 'webSpeech' ? 'Native' : 'Google'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speech Rate */}
              <div>
                <label className="text-xs font-bold text-brand-slate uppercase block mb-2">
                  Speed: {speechRate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.25"
                  value={speechRate}
                  onChange={(e) =>
                    setSpeechRate(parseFloat(e.target.value) as any)
                  }
                  className="w-full"
                />
              </div>

              {/* Volume */}
              <div>
                <label className="text-xs font-bold text-brand-slate uppercase block mb-2">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Info */}
              <div className="text-[11px] text-brand-muted bg-brand-sand/20 p-2 rounded-lg">
                💡 Using <strong>Web Speech API</strong> - works offline, 100% free, no API key needed!
              </div>

              {/* Close */}
              <button
                onClick={() => setShowSettings(false)}
                className="w-full text-xs font-semibold text-brand-amber hover:text-brand-amber/80 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Indicator */}
      {isPlaying && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
          className="flex gap-1"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: [8, 16, 8],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-1 bg-brand-amber rounded-full"
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
