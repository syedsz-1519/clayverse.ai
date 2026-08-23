import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // Fall through to fallback
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}

interface CopyCodeButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: 'default' | 'compact' | 'ghost' | 'pill' | 'dark';
  className?: string;
  showIconOnly?: boolean;
  title?: string;
  onCopySuccess?: () => void;
}

export default function CopyCodeButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  variant = 'default',
  className = '',
  showIconOnly = false,
  title = 'Copy to clipboard',
  onCopySuccess
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const success = await copyTextToClipboard(text);
    if (success) {
      setCopied(true);
      if (onCopySuccess) onCopySuccess();

      // Subtle audio feedback if Web Audio is available
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.08); // D6 chime
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      } catch (err) {
        // Audio error ignored
      }

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Variant styles
  let variantStyles = 'bg-white hover:bg-brand-sand text-brand-slate hover:text-brand-amber border border-brand-slate/15 shadow-2xs';
  
  if (variant === 'compact') {
    variantStyles = 'bg-brand-sand/50 hover:bg-brand-sand text-brand-charcoal hover:text-brand-amber border border-brand-slate/10 px-2 py-1 text-[10px]';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent hover:bg-brand-slate/10 text-brand-muted hover:text-brand-charcoal border-none p-1.5';
  } else if (variant === 'pill') {
    variantStyles = 'bg-brand-sand/70 hover:bg-brand-sand text-brand-charcoal hover:text-brand-amber border border-brand-slate/15 rounded-full px-3 py-1 text-xs font-mono font-bold';
  } else if (variant === 'dark') {
    variantStyles = 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/15 px-2.5 py-1 text-xs font-mono';
  } else {
    variantStyles = 'bg-white hover:bg-brand-sand text-brand-charcoal hover:text-brand-amber border border-brand-slate/20 px-2.5 py-1.5 text-xs';
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      title={copied ? copiedLabel : title}
      aria-label={copied ? copiedLabel : title}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-sans font-semibold transition-all cursor-pointer select-none active:scale-95 ${
        copied 
          ? 'bg-emerald-50! text-emerald-700! border-emerald-300! shadow-xs' 
          : ''
      } ${variantStyles} ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5] animate-scale-in shrink-0" />
          {!showIconOnly && (
            <span className="font-mono text-[10.5px] font-bold text-emerald-700 tracking-tight">
              {copiedLabel}
            </span>
          )}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 opacity-75 group-hover:opacity-100 transition-opacity shrink-0" />
          {!showIconOnly && (
            <span className="font-mono text-[10.5px] font-bold tracking-tight">
              {label}
            </span>
          )}
        </>
      )}
    </button>
  );
}
