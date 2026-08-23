import React, { useState } from 'react';
import { Terminal, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import CopyCodeButton from './CopyCodeButton';

interface CodeSnippetBlockProps {
  code: string;
  language?: string;
  filename?: string;
  title?: string;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'light';
  maxHeight?: string;
  copyLabel?: string;
  className?: string;
}

export default function CodeSnippetBlock({
  code,
  language = 'python',
  filename,
  title,
  showLineNumbers = false,
  theme = 'dark',
  maxHeight,
  copyLabel = 'Copy Code',
  className = ''
}: CodeSnippetBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.trim().split('\n');
  const isLong = lines.length > 10;

  const displayLanguage = language.toUpperCase();

  return (
    <div
      className={`rounded-2xl border overflow-hidden my-3 shadow-md transition-all ${
        theme === 'dark'
          ? 'bg-[#1E1E24] border-stone-800 text-stone-100 shadow-stone-900/30'
          : 'bg-[#F9F7F3] border-brand-slate/15 text-brand-charcoal'
      } ${className}`}
    >
      {/* Top Header Bar */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between gap-3 border-b text-xs select-none ${
          theme === 'dark'
            ? 'bg-[#18181D] border-stone-800/80 text-stone-300'
            : 'bg-white/80 border-brand-slate/10 text-brand-slate'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Window control dots */}
          <div className="flex items-center gap-1.5 shrink-0 opacity-70">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>

          {/* Language / File badge */}
          <div className="flex items-center gap-1.5 ml-2 min-w-0">
            {language.toLowerCase() === 'bash' || language.toLowerCase() === 'shell' ? (
              <Terminal className="w-3.5 h-3.5 text-brand-amber shrink-0" />
            ) : (
              <Code2 className="w-3.5 h-3.5 text-brand-amber shrink-0" />
            )}
            <span
              className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                theme === 'dark'
                  ? 'bg-stone-800 border-stone-700 text-brand-amber'
                  : 'bg-brand-sand border-brand-slate/10 text-brand-amber'
              }`}
            >
              {displayLanguage}
            </span>

            {(filename || title) && (
              <span className="font-mono text-[11px] truncate opacity-85 font-medium ml-1">
                {filename || title}
              </span>
            )}
          </div>
        </div>

        {/* Copy Button */}
        <div className="flex items-center gap-2 shrink-0">
          <CopyCodeButton
            text={code}
            label={copyLabel}
            variant={theme === 'dark' ? 'dark' : 'compact'}
          />
        </div>
      </div>

      {/* Code Body */}
      <div
        className={`relative overflow-x-auto p-4 font-mono text-[12px] leading-relaxed select-text ${
          maxHeight && !isExpanded ? maxHeight : ''
        }`}
      >
        <pre className="m-0 p-0 whitespace-pre font-mono">
          {showLineNumbers ? (
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="pr-4 select-none opacity-35 text-right font-mono text-[11px] w-6 align-top">
                      {idx + 1}
                    </td>
                    <td className="align-top whitespace-pre font-mono">{line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>

      {/* Expand / Collapse for long code */}
      {isLong && maxHeight && (
        <div
          className={`px-4 py-1.5 border-t text-center text-xs ${
            theme === 'dark' ? 'bg-[#18181D] border-stone-800' : 'bg-white border-brand-slate/10'
          }`}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold text-brand-amber hover:underline cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Show full snippet ({lines.length} lines)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
