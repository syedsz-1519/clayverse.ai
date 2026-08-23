import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Clock, 
  Radio, 
  Check
} from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';
import { getNarrationForSection, SectionNarrationItem } from '../data/sectionNarrationData';

interface ReadSectionButtonProps {
  sectionId: string;
  variant?: 'primary' | 'compact' | 'pill' | 'outline';
  className?: string;
  showDuration?: boolean;
}

export default function ReadSectionButton({
  sectionId,
  variant = 'primary',
  className = '',
  showDuration = true
}: ReadSectionButtonProps) {
  const { lang } = useLanguage();
  const [isPlayingThis, setIsPlayingThis] = useState<boolean>(false);
  const [isPausedThis, setIsPausedThis] = useState<boolean>(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);

  const narrationItem: SectionNarrationItem = getNarrationForSection(sectionId);
  const isHyd = lang === 'hyd' || lang === 'te';
  const sentences = isHyd ? narrationItem.sentencesHyd : narrationItem.sentencesEn;
  const langCode: 'en' | 'hyd' = isHyd ? 'hyd' : 'en';

  useEffect(() => {
    const handleNarrationEvent = (e: any) => {
      const detail = e.detail;
      if (!detail) return;

      if (detail.sectionId === sectionId) {
        if (detail.status === 'playing') {
          setIsPlayingThis(true);
          setIsPausedThis(false);
          if (typeof detail.sentenceIndex === 'number') {
            setCurrentSentenceIdx(detail.sentenceIndex);
          }
        } else if (detail.status === 'paused') {
          setIsPlayingThis(true);
          setIsPausedThis(true);
        } else {
          setIsPlayingThis(false);
          setIsPausedThis(false);
        }
      } else {
        if (detail.status === 'playing') {
          setIsPlayingThis(false);
          setIsPausedThis(false);
        }
      }
    };

    window.addEventListener('clay_narration_state_changed', handleNarrationEvent);
    return () => window.removeEventListener('clay_narration_state_changed', handleNarrationEvent);
  }, [sectionId]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlayingThis && !isPausedThis) {
      // Pause or stop
      audioEngine.pauseSpeaking();
    } else if (isPlayingThis && isPausedThis) {
      audioEngine.resumeSpeaking();
    } else {
      // Start reading this section
      audioEngine.speakSectionSentences(
        sectionId,
        sentences,
        langCode,
        (idx) => {
          setCurrentSentenceIdx(idx);
        },
        () => {
          setIsPlayingThis(false);
          setIsPausedThis(false);
        }
      );
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.stopSpeaking();
    setIsPlayingThis(false);
    setIsPausedThis(false);
  };

  // Compact Pill Variant
  if (variant === 'compact' || variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <button
          onClick={handleTogglePlay}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none shadow-sm ${
            isPlayingThis
              ? isPausedThis
                ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : 'bg-brand-amber text-white border border-brand-amber-dark shadow-amber-500/20'
              : 'bg-white hover:bg-brand-sand text-brand-charcoal border border-brand-slate/15 hover:border-brand-amber/40'
          }`}
          title={isPlayingThis ? (isPausedThis ? 'Resume Reading' : 'Pause Reading') : 'Read section aloud'}
          aria-label={`Read ${narrationItem.titleEn} aloud`}
        >
          {isPlayingThis ? (
            isPausedThis ? (
              <Play className="w-3.5 h-3.5 fill-current" />
            ) : (
              <span className="flex items-center gap-1">
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 bg-white h-2 animate-bounce"></span>
                  <span className="w-0.5 bg-white h-3 animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-0.5 bg-white h-1.5 animate-bounce [animation-delay:0.3s]"></span>
                </span>
                <Pause className="w-3 h-3 ml-0.5" />
              </span>
            )
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-brand-amber" />
          )}
          <span>
            {isPlayingThis 
              ? isPausedThis ? (isHyd ? 'Chalu Karein' : 'Resume') : (isHyd ? 'Sun rahe hain...' : 'Listening...')
              : (isHyd ? 'Sabaq Suniye' : 'Read Aloud')
            }
          </span>
          {showDuration && !isPlayingThis && (
            <span className="text-[10px] font-mono opacity-70 border-l border-brand-slate/20 pl-1.5">
              {narrationItem.durationSeconds}s
            </span>
          )}
        </button>

        {isPlayingThis && (
          <button
            onClick={handleStop}
            className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 transition-colors cursor-pointer"
            title="Stop narration"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        )}
      </div>
    );
  }

  // Primary Standard Card Header Button
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={handleTogglePlay}
        className={`group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none shadow-sm ${
          isPlayingThis
            ? isPausedThis
              ? 'bg-amber-100 text-brand-amber-dark border-2 border-brand-amber/50 shadow-md'
              : 'bg-gradient-to-r from-brand-amber to-amber-600 text-white border border-amber-600 shadow-md shadow-brand-amber/25'
            : 'bg-white hover:bg-brand-sand text-brand-charcoal border border-brand-slate/20 hover:border-brand-amber/50 hover:shadow-md'
        }`}
        aria-label={`Read ${narrationItem.titleEn} section aloud`}
      >
        {/* Play / Soundwave Icon */}
        <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
          isPlayingThis
            ? isPausedThis ? 'bg-amber-200 text-amber-900' : 'bg-white/20 text-white'
            : 'bg-brand-amber/15 text-brand-amber group-hover:scale-110'
        }`}>
          {isPlayingThis ? (
            isPausedThis ? (
              <Play className="w-3.5 h-3.5 fill-current" />
            ) : (
              <div className="flex gap-0.5 items-end h-3">
                <span className="w-0.5 bg-white h-2 animate-bounce"></span>
                <span className="w-0.5 bg-white h-3 animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-0.5 bg-white h-1.5 animate-bounce [animation-delay:0.3s]"></span>
              </div>
            )
          ) : (
            <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
        </div>

        {/* Text and Badge */}
        <div className="flex flex-col text-left">
          <span className="leading-tight flex items-center gap-1.5">
            <span>
              {isPlayingThis
                ? isPausedThis 
                  ? (isHyd ? 'Paused (Resume)' : 'Paused (Resume)') 
                  : (isHyd ? 'Sabaq Suniye...' : 'Reading Section...')
                : (isHyd ? 'Sabaq Aawaz me Suniye' : 'Read Section Aloud')
              }
            </span>
            {isPlayingThis && !isPausedThis && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20 uppercase tracking-wider">
                {currentSentenceIdx + 1}/{sentences.length}
              </span>
            )}
          </span>
          <span className="text-[10px] font-normal opacity-75 leading-tight flex items-center gap-1 font-mono mt-0.5">
            <Clock className="w-2.5 h-2.5" />
            <span>{narrationItem.durationSeconds}s audio • Web Speech API</span>
          </span>
        </div>
      </button>

      {/* Stop button when playing */}
      {isPlayingThis && (
        <button
          onClick={handleStop}
          className="p-2.5 rounded-2xl bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 transition-all cursor-pointer shadow-sm"
          title="Stop reading"
          aria-label="Stop reading section aloud"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      )}
    </div>
  );
}
