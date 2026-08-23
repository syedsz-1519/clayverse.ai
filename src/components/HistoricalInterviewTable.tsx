import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Award, 
  TrendingUp, 
  Video, 
  FileText, 
  Volume2, 
  FileSpreadsheet, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Tag, 
  Eye, 
  Mic, 
  Edit3,
  CheckCircle2,
  BarChart2,
  Plus,
  X,
  Check,
  Filter,
  BookOpen
} from 'lucide-react';
import { MockInterviewRecord } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';
import { 
  deriveSessionTags, 
  getTopicTagMeta, 
  TOPIC_TAG_DEFINITIONS, 
  updateRecordTags 
} from '../lib/interviewExportAndTags';
import SessionInlineReflectionEditor from './SessionInlineReflectionEditor';

interface HistoricalInterviewTableProps {
  records: MockInterviewRecord[];
  onOpenReportModal: (record: MockInterviewRecord) => void;
  onOpenAudioReplay: (record: MockInterviewRecord) => void;
  onOpenReflectionModal: (record: MockInterviewRecord) => void;
  onExportCsv: (record: MockInterviewRecord) => void;
  onOpenComparison?: (record: MockInterviewRecord) => void;
  onTagSelected?: (tag: string) => void;
  onRecordsUpdated?: () => void;
}

type SortField = 'date' | 'score' | 'difficulty' | 'role';
type SortOrder = 'asc' | 'desc';

export default function HistoricalInterviewTable({
  records,
  onOpenReportModal,
  onOpenAudioReplay,
  onOpenReflectionModal,
  onExportCsv,
  onOpenComparison,
  onTagSelected,
  onRecordsUpdated
}: HistoricalInterviewTableProps) {
  const { lang } = useLanguage();
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [activeTagFilter, setActiveTagFilter] = useState<string>('all');
  const [tagEditorRecord, setTagEditorRecord] = useState<MockInterviewRecord | null>(null);
  const [customTagInput, setCustomTagInput] = useState('');
  const [expandedReflectionId, setExpandedReflectionId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    audioEngine.playLoFiChord();
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const difficultyWeight: Record<string, number> = {
    'Beginner': 1,
    'Mid-Level': 2,
    'Senior': 3,
    'Staff': 4
  };

  // Derive tags for each record and extract unique tags with counts
  const recordTagsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const rec of records) {
      const derived = deriveSessionTags(rec);
      // Combine custom tags + derived tags without duplicates
      const combined = Array.from(new Set([...(rec.tags || []), ...derived.topicTags]));
      map.set(rec.id, combined);
    }
    return map;
  }, [records]);

  // Unique tags for quick filtering
  const allAvailableTags = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tags of recordTagsMap.values()) {
      for (const t of tags) {
        counts[t] = (counts[t] || 0) + 1;
      }
    }
    return counts;
  }, [recordTagsMap]);

  // Filter records by activeTagFilter if set
  const filteredRecords = useMemo(() => {
    if (activeTagFilter === 'all') return records;
    return records.filter(rec => {
      const tags = recordTagsMap.get(rec.id) || [];
      return tags.some(t => t.toLowerCase() === activeTagFilter.toLowerCase());
    });
  }, [records, activeTagFilter, recordTagsMap]);

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = (a.timestamp || 0) - (b.timestamp || 0);
      } else if (sortField === 'score') {
        comparison = (a.overallScore || 0) - (b.overallScore || 0);
      } else if (sortField === 'difficulty') {
        comparison = (difficultyWeight[a.difficulty] || 2) - (difficultyWeight[b.difficulty] || 2);
      } else if (sortField === 'role') {
        comparison = a.roleTrack.localeCompare(b.roleTrack);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredRecords, sortField, sortOrder]);

  const handleTagClick = (tag: string) => {
    audioEngine.playLoFiChord();
    if (onTagSelected) {
      onTagSelected(tag);
    }
    setActiveTagFilter(prev => prev.toLowerCase() === tag.toLowerCase() ? 'all' : tag);
  };

  const handleOpenTagEditor = (rec: MockInterviewRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playLoFiChord();
    setTagEditorRecord(rec);
    setCustomTagInput('');
  };

  const handleToggleTagOnRecord = (tagName: string) => {
    if (!tagEditorRecord) return;
    audioEngine.playLoFiChord();
    const currentTags = tagEditorRecord.tags || deriveSessionTags(tagEditorRecord).topicTags;
    const exists = currentTags.some(t => t.toLowerCase() === tagName.toLowerCase());
    const updated = exists 
      ? currentTags.filter(t => t.toLowerCase() !== tagName.toLowerCase())
      : [...currentTags, tagName];

    setTagEditorRecord({
      ...tagEditorRecord,
      tags: updated,
      topics: updated
    });
    updateRecordTags(tagEditorRecord.id, updated);
    if (onRecordsUpdated) onRecordsUpdated();
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagEditorRecord || !customTagInput.trim()) return;
    const trimmed = customTagInput.trim();
    handleToggleTagOnRecord(trimmed);
    setCustomTagInput('');
  };

  if (records.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-brand-sand/20 border border-dashed border-brand-slate/20 text-center space-y-2">
        <Video className="w-7 h-7 text-brand-muted mx-auto" />
        <p className="text-xs text-brand-muted">
          No mock interview records available to display in historical table yet.
        </p>
      </div>
    );
  }

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-brand-muted/60 ml-1 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-brand-amber ml-1 inline" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-brand-amber ml-1 inline" />
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-brand-slate/15 bg-white shadow-2xs space-y-0">
      
      {/* Quick Tag Categorization & Filter Toolbar */}
      <div className="p-3 bg-brand-sand/20 border-b border-brand-slate/15 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-brand-slate mr-1">
            <Tag className="w-3.5 h-3.5 text-brand-amber" />
            <span>Category Tags:</span>
          </div>

          <button
            onClick={() => setActiveTagFilter('all')}
            className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
              activeTagFilter === 'all'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'bg-white border border-brand-slate/20 text-brand-slate hover:bg-brand-sand/40'
            }`}
          >
            All ({records.length})
          </button>

          {Object.entries(allAvailableTags).slice(0, 8).map(([tagName, count]) => {
            const isSelected = activeTagFilter.toLowerCase() === tagName.toLowerCase();
            const meta = getTopicTagMeta(tagName);
            const badgeClass = meta 
              ? `${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}` 
              : 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <button
                key={tagName}
                onClick={() => handleTagClick(tagName)}
                className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-brand-amber text-white border-brand-amber shadow-xs font-black'
                    : `${badgeClass} hover:opacity-85`
                }`}
                title={`Filter interviews by ${tagName}`}
              >
                <span>{tagName}</span>
                <span className={`text-[9px] font-mono px-1 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-black/10'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {activeTagFilter !== 'all' && (
          <button
            onClick={() => setActiveTagFilter('all')}
            className="text-[10.5px] font-mono text-brand-amber hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear Tag Filter</span>
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-brand-sand/30 border-b border-brand-slate/15 text-[11px] font-mono text-brand-slate font-bold uppercase tracking-wider">
              <th 
                onClick={() => handleSort('date')}
                className="py-3 px-4 cursor-pointer hover:text-brand-charcoal transition-colors select-none"
              >
                <span>Date & Time</span>
                {renderSortIndicator('date')}
              </th>
              <th 
                onClick={() => handleSort('role')}
                className="py-3 px-4 cursor-pointer hover:text-brand-charcoal transition-colors select-none"
              >
                <span>Role Track & Tags</span>
                {renderSortIndicator('role')}
              </th>
              <th 
                onClick={() => handleSort('difficulty')}
                className="py-3 px-4 cursor-pointer hover:text-brand-charcoal transition-colors select-none"
              >
                <span>Difficulty</span>
                {renderSortIndicator('difficulty')}
              </th>
              <th 
                onClick={() => handleSort('score')}
                className="py-3 px-4 cursor-pointer hover:text-brand-charcoal transition-colors select-none"
              >
                <span>Overall Score</span>
                {renderSortIndicator('score')}
              </th>
              <th className="py-3 px-4 select-none">
                <span>Hiring Bar</span>
              </th>
              <th className="py-3 px-4 select-none hidden md:table-cell">
                <span>Tone & Notes</span>
              </th>
              <th className="py-3 px-4 text-right select-none">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-brand-slate/10">
            {sortedRecords.map((rec) => {
              const hasReflections = Boolean(rec.personalReflections || rec.personalNotes);
              const tone = rec.speechSentimentReport?.dominantTone || 'Analytical';
              const assignedTags = recordTagsMap.get(rec.id) || ['Technical AI'];

              return (
                <React.Fragment key={rec.id}>
                  <tr className="hover:bg-brand-sand/15 transition-colors group">
                    {/* Date Column */}
                  <td className="py-3.5 px-4 font-mono text-[11.5px] text-brand-charcoal whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                      <span>{rec.dateStr}</span>
                    </div>
                  </td>

                  {/* Role Track & Tag Badges Column */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1.5">
                      <div className="font-display font-bold text-brand-charcoal text-xs sm:text-[13px]">
                        {rec.roleTrack}
                      </div>
                      
                      {/* Topic Tag Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {assignedTags.map((tag) => {
                          const meta = getTopicTagMeta(tag);
                          const badgeStyle = meta 
                            ? `${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}`
                            : 'bg-slate-100 text-slate-700 border-slate-200';

                          return (
                            <button
                              key={tag}
                              onClick={() => handleTagClick(tag)}
                              className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border transition-all cursor-pointer ${badgeStyle} hover:opacity-80`}
                              title={`Filter by tag "${tag}"`}
                            >
                              {tag}
                            </button>
                          );
                        })}

                        {/* Quick Tag Edit Button */}
                        <button
                          onClick={(e) => handleOpenTagEditor(rec, e)}
                          className="text-[9.5px] font-mono text-brand-muted hover:text-brand-charcoal px-1 py-0.5 rounded hover:bg-brand-sand/50 border border-dashed border-brand-slate/20 transition-all flex items-center gap-0.5 cursor-pointer"
                          title="Manage and assign category tags to this interview"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>Tag</span>
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-brand-muted flex items-center gap-1">
                        <span>Interviewer: {rec.interviewerName}</span>
                        <span>•</span>
                        <span>{Math.round(rec.durationSeconds / 60)} mins</span>
                      </div>
                    </div>
                  </td>

                  {/* Difficulty Level Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
                      rec.difficulty === 'Staff' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                      rec.difficulty === 'Senior' || rec.difficulty === 'Advanced' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                      rec.difficulty === 'Mid-Level' || rec.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {rec.difficulty || 'Intermediate'}
                    </span>
                  </td>

                  {/* Overall Score Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`font-display font-black text-sm ${
                        rec.overallScore >= 85 ? 'text-emerald-700' :
                        rec.overallScore >= 70 ? 'text-amber-700' : 'text-red-700'
                      }`}>
                        {rec.overallScore}%
                      </span>
                      {/* Mini Bar */}
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${
                            rec.overallScore >= 85 ? 'bg-emerald-500' :
                            rec.overallScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, rec.overallScore)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Hiring Bar Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      rec.hiringDecision === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                      rec.hiringDecision === 'Hire' ? 'bg-teal-100 text-teal-800' :
                      rec.hiringDecision === 'Leaning Hire' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rec.hiringDecision}
                    </span>
                  </td>

                  {/* Spoken Tone & Reflection Column */}
                  <td className="py-3.5 px-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                        {tone.split(' ')[0]}
                      </span>

                      {hasReflections ? (
                        <button
                          onClick={() => {
                            audioEngine.playLoFiChord();
                            setExpandedReflectionId(prev => prev === rec.id ? null : rec.id);
                          }}
                          className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 cursor-pointer shadow-2xs"
                          title="Click to toggle inline reflection editor"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{expandedReflectionId === rec.id ? 'Close' : 'Reflections'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            audioEngine.playLoFiChord();
                            setExpandedReflectionId(prev => prev === rec.id ? null : rec.id);
                          }}
                          className="flex items-center gap-1 text-[10px] font-mono text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand/40 px-2 py-0.5 rounded border border-dashed border-brand-slate/20 cursor-pointer"
                          title="Click to open inline reflection editor"
                        >
                          <Edit3 className="w-3 h-3 text-brand-slate" />
                          <span>{expandedReflectionId === rec.id ? 'Close' : '+ Reflection'}</span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenReportModal(rec)}
                        className="px-2.5 py-1 rounded-lg bg-brand-charcoal text-white hover:bg-black font-bold text-[10.5px] transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="View Full Scorecard Report"
                      >
                        <FileText className="w-3 h-3 text-brand-amber" />
                        <span className="hidden sm:inline">Scorecard</span>
                      </button>

                      <button
                        onClick={() => onOpenAudioReplay(rec)}
                        className="p-1.5 rounded-lg bg-white border border-brand-slate/20 hover:bg-brand-sand/40 text-brand-charcoal transition-all cursor-pointer"
                        title="Play Spoken Audio Replay & Transcript"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                      </button>

                      <button
                        onClick={() => {
                          audioEngine.playLoFiChord();
                          setExpandedReflectionId(prev => prev === rec.id ? null : rec.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          expandedReflectionId === rec.id 
                            ? 'bg-amber-500 text-white border-amber-600' 
                            : 'bg-white border-brand-slate/20 hover:bg-amber-50 text-purple-600'
                        }`}
                        title="Toggle Inline Reflection Editor"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {onOpenComparison && (
                        <button
                          onClick={() => onOpenComparison(rec)}
                          className="p-1.5 rounded-lg bg-white border border-brand-slate/20 hover:bg-amber-50 text-brand-amber-dark transition-all cursor-pointer"
                          title="Compare with another session"
                        >
                          <BarChart2 className="w-3.5 h-3.5 text-brand-amber" />
                        </button>
                      )}

                      <button
                        onClick={() => onExportCsv(rec)}
                        className="p-1.5 rounded-lg bg-white border border-brand-slate/20 hover:bg-emerald-50 text-emerald-700 transition-all cursor-pointer"
                        title="Export Session Metrics (CSV)"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Inline Reflection Editor Row */}
                {expandedReflectionId === rec.id && (
                  <tr className="bg-amber-50/20 border-b border-amber-200">
                    <td colSpan={7} className="p-3 sm:p-4">
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SessionInlineReflectionEditor
                          record={rec}
                          onSave={() => {
                            if (onRecordsUpdated) onRecordsUpdated();
                          }}
                        />
                      </motion.div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-3 bg-brand-sand/20 border-t border-brand-slate/15 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono text-brand-muted">
        <span>Showing <strong>{sortedRecords.length}</strong> mock interview sessions</span>
        <div className="flex items-center gap-3">
          <span>Click any tag badge to filter</span>
          <span>•</span>
          <span className="text-emerald-700 font-bold">Passing Bar: ≥85%</span>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* MODAL: TAG MANAGER & CATEGORIZATION DIALOG */}
      {/* ======================================================================= */}
      <AnimatePresence>
        {tagEditorRecord && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-brand-slate/20 space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-brand-slate/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-brand-amber/15 text-brand-amber-dark">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-brand-charcoal">
                      Categorize Interview Session
                    </h3>
                    <p className="text-[11px] font-mono text-brand-muted">
                      {tagEditorRecord.roleTrack} ({tagEditorRecord.dateStr})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setTagEditorRecord(null)}
                  className="p-1 rounded-lg text-brand-muted hover:text-brand-charcoal cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tag Selection Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-charcoal block">
                  Select Topic & Category Tags:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                  {TOPIC_TAG_DEFINITIONS.map((def) => {
                    const currentTags = tagEditorRecord.tags || deriveSessionTags(tagEditorRecord).topicTags;
                    const isChecked = currentTags.some(t => t.toLowerCase() === def.name.toLowerCase() || t.toLowerCase() === def.id.toLowerCase());

                    return (
                      <button
                        key={def.id}
                        type="button"
                        onClick={() => handleToggleTagOnRecord(def.name)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isChecked
                            ? `${def.badgeBg} ${def.badgeText} ${def.borderColor} font-bold ring-1 ring-brand-amber/40`
                            : 'bg-brand-sand/20 border-brand-slate/15 text-brand-slate hover:bg-brand-sand/40'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{def.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Tag Input */}
              <form onSubmit={handleAddCustomTag} className="pt-2 border-t border-brand-slate/10 space-y-2">
                <label className="text-xs font-bold text-brand-charcoal block">
                  Add Custom Tag:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    placeholder="e.g. Next.js, Dynamic Programming..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-brand-slate/20 text-xs text-brand-charcoal placeholder:text-brand-muted focus:outline-hidden focus:border-brand-amber focus:ring-1 focus:ring-brand-amber"
                  />
                  <button
                    type="submit"
                    disabled={!customTagInput.trim()}
                    className="px-3 py-1.5 bg-brand-charcoal text-white rounded-xl text-xs font-bold hover:bg-black disabled:opacity-40 transition-all cursor-pointer shrink-0"
                  >
                    Add Tag
                  </button>
                </div>
              </form>

              {/* Current Active Tags on this record */}
              <div className="bg-brand-sand/20 rounded-2xl p-3 border border-brand-slate/10 space-y-1">
                <span className="text-[10px] font-mono text-brand-muted block uppercase font-bold">
                  Assigned Tags for this Session:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(tagEditorRecord.tags || deriveSessionTags(tagEditorRecord).topicTags).map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-white border border-brand-slate/20 text-[10px] font-mono font-bold text-brand-charcoal flex items-center gap-1"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleTagOnRecord(t)}
                        className="text-brand-muted hover:text-red-600 cursor-pointer"
                        title={`Remove tag ${t}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setTagEditorRecord(null)}
                  className="px-4 py-2 bg-brand-amber text-white rounded-xl text-xs font-bold hover:bg-brand-amber-dark transition-all cursor-pointer"
                >
                  Done & Save Tags
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
