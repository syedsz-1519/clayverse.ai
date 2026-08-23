import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Printer, 
  Check, 
  Sparkles, 
  BookOpen, 
  Edit3, 
  Save, 
  Trash2, 
  Languages, 
  CheckCircle2,
  Share2,
  FolderDown,
  Layers,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { LESSON_MODULES } from './HomeCurriculumGrid';
import { TAKEAWAYS_DATA } from './QuickTakeaway';
import { 
  getStudentKnowledgeNotes, 
  saveStudentKnowledgeNote, 
  generatePlainTextExport, 
  generateMarkdownExport, 
  exportPrintablePdf, 
  downloadFile,
  type ExportOptions 
} from '../lib/notesExporter';

interface TakeawaysNotesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLessonId?: string;
}

export default function TakeawaysNotesExportModal({
  isOpen,
  onClose,
  initialLessonId
}: TakeawaysNotesExportModalProps) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'export' | 'edit-notes'>('export');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hyd' | 'te'>('en');
  const [selectedLessons, setSelectedLessons] = useState<string[]>(LESSON_MODULES.map(m => m.id));
  const [includeTakeaways, setIncludeTakeaways] = useState(true);
  const [includeStudentNotes, setIncludeStudentNotes] = useState(true);
  const [includeMentalModels, setIncludeMentalModels] = useState(true);
  const [studentName, setStudentName] = useState(() => {
    try {
      const user = localStorage.getItem('clay_user_profile');
      if (user) return JSON.parse(user).name || 'Clayverse AI Scholar';
    } catch {}
    return 'Clayverse AI Scholar';
  });

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingLessonId, setEditingLessonId] = useState<string>(initialLessonId || LESSON_MODULES[0]?.id || 'what-is-ai');
  const [currentDraftNote, setCurrentDraftNote] = useState<string>('');
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loaded = getStudentKnowledgeNotes();
      setNotes(loaded);
      const targetId = initialLessonId || LESSON_MODULES[0]?.id || 'what-is-ai';
      setEditingLessonId(targetId);
      setCurrentDraftNote(loaded[targetId] || '');
      setSelectedLanguage(lang === 'te' ? 'te' : lang === 'hyd' ? 'hyd' : 'en');
    }
  }, [isOpen, initialLessonId, lang]);

  const handleSelectAll = () => {
    if (selectedLessons.length === LESSON_MODULES.length) {
      setSelectedLessons([]);
    } else {
      setSelectedLessons(LESSON_MODULES.map(m => m.id));
    }
  };

  const handleToggleLesson = (id: string) => {
    if (selectedLessons.includes(id)) {
      setSelectedLessons(selectedLessons.filter(l => l !== id));
    } else {
      setSelectedLessons([...selectedLessons, id]);
    }
  };

  const handleSaveNote = () => {
    const updated = saveStudentKnowledgeNote(editingLessonId, currentDraftNote);
    setNotes(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleSwitchEditingLesson = (id: string) => {
    // auto save previous draft if modified
    saveStudentKnowledgeNote(editingLessonId, currentDraftNote);
    setEditingLessonId(id);
    setCurrentDraftNote(notes[id] || '');
  };

  const getOptions = (): ExportOptions => ({
    includeTakeaways,
    includeStudentNotes,
    includeMentalModels,
    selectedLessonIds: selectedLessons,
    language: selectedLanguage,
    studentName: studentName.trim() || 'Clayverse AI Scholar'
  });

  const handleExportTxt = () => {
    const opts = getOptions();
    const content = generatePlainTextExport(opts);
    const filename = `Clayverse_AI_Takeaways_Notes_${opts.language.toUpperCase()}.txt`;
    downloadFile(content, filename, 'text/plain;charset=utf-8');
  };

  const handleExportMd = () => {
    const opts = getOptions();
    const content = generateMarkdownExport(opts);
    const filename = `Clayverse_AI_Takeaways_Notes_${opts.language.toUpperCase()}.md`;
    downloadFile(content, filename, 'text/markdown;charset=utf-8');
  };

  const handleExportPdf = () => {
    const opts = getOptions();
    exportPrintablePdf(opts);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/70 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-3xl rounded-3xl border border-brand-slate/20 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-left"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-brand-slate/15 flex items-center justify-between bg-gradient-to-r from-brand-sand/60 via-white to-brand-amber/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 text-brand-amber flex items-center justify-center border border-brand-amber/30">
              <FolderDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber-dark">
                  Offline & Study Notebook
                </span>
              </div>
              <h2 className="text-xl font-bold font-display text-brand-charcoal mt-0.5">
                Export Takeaways & Knowledge Notes
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-brand-slate/15 px-6 bg-brand-sand/30 gap-4">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'export'
                ? 'border-brand-amber text-brand-charcoal'
                : 'border-transparent text-brand-muted hover:text-brand-charcoal'
            }`}
          >
            <Download className="w-4 h-4 text-brand-amber" />
            <span>Export & Download Options</span>
          </button>

          <button
            onClick={() => setActiveTab('edit-notes')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'edit-notes'
                ? 'border-brand-amber text-brand-charcoal'
                : 'border-transparent text-brand-muted hover:text-brand-charcoal'
            }`}
          >
            <Edit3 className="w-4 h-4 text-brand-amber" />
            <span>Edit My Lesson Notes ({Object.keys(notes).length} saved)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              {/* Student Metadata & Language Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-brand-muted uppercase mb-1">
                    Student Name (for Document Header)
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-slate/20 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-amber/40 bg-brand-sand/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-brand-muted uppercase mb-1">
                    Export Language
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'en', label: 'English' },
                      { id: 'hyd', label: 'Urdu / Hyd' },
                      { id: 'te', label: 'Telugu' }
                    ].map(l => (
                      <button
                        key={l.id}
                        onClick={() => setSelectedLanguage(l.id as any)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          selectedLanguage === l.id
                            ? 'bg-brand-charcoal text-white shadow-2xs'
                            : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-charcoal border border-brand-slate/15'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Toggles */}
              <div className="p-4 rounded-2xl bg-brand-sand/40 border border-brand-slate/15 space-y-3">
                <span className="text-xs font-mono font-bold text-brand-charcoal uppercase block">
                  Included Sections
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeTakeaways}
                      onChange={(e) => setIncludeTakeaways(e.target.checked)}
                      className="w-4 h-4 accent-brand-amber rounded cursor-pointer"
                    />
                    <span className="font-semibold text-brand-charcoal">Quick Takeaways & TL;DR</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeMentalModels}
                      onChange={(e) => setIncludeMentalModels(e.target.checked)}
                      className="w-4 h-4 accent-brand-amber rounded cursor-pointer"
                    />
                    <span className="font-semibold text-brand-charcoal">Mental Model Formulas</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeStudentNotes}
                      onChange={(e) => setIncludeStudentNotes(e.target.checked)}
                      className="w-4 h-4 accent-brand-amber rounded cursor-pointer"
                    />
                    <span className="font-semibold text-brand-charcoal">My Personal Notes</span>
                  </label>
                </div>
              </div>

              {/* Lesson Module Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-brand-muted uppercase">
                    Select Chapters to Export ({selectedLessons.length} / {LESSON_MODULES.length} selected)
                  </span>
                  <button
                    onClick={handleSelectAll}
                    className="text-xs font-bold text-brand-amber hover:text-brand-amber-dark underline cursor-pointer"
                  >
                    {selectedLessons.length === LESSON_MODULES.length ? 'Deselect All' : 'Select All Chapters'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {LESSON_MODULES.map((mod) => {
                    const isSelected = selectedLessons.includes(mod.id);
                    const hasNotes = !!notes[mod.id];
                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleToggleLesson(mod.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-white border-brand-amber/60 shadow-2xs'
                            : 'bg-brand-sand/20 border-brand-slate/15 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by parent div
                            className="w-4 h-4 accent-brand-amber rounded shrink-0 cursor-pointer"
                          />
                          <span className="font-mono text-[10px] font-bold text-brand-muted shrink-0">
                            0{mod.lessonNum}
                          </span>
                          <span className="text-xs font-bold text-brand-charcoal truncate">
                            {lang === 'en' ? mod.titleEn : mod.titleHyd}
                          </span>
                        </div>

                        {hasNotes && (
                          <span className="text-[9px] font-mono bg-blue-500/15 text-blue-700 px-1.5 py-0.5 rounded-md font-bold shrink-0">
                            Has Notes
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3 Prominent Export Buttons */}
              <div className="pt-2 border-t border-brand-slate/15">
                <span className="text-xs font-mono font-bold text-brand-muted uppercase block mb-3">
                  Choose Download Format
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Download PDF / Print */}
                  <button
                    onClick={handleExportPdf}
                    disabled={selectedLessons.length === 0}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-1.5">
                      <Printer className="w-4 h-4" />
                      <span>Download / Print PDF</span>
                    </div>
                    <span className="text-[10px] opacity-80 font-normal">
                      Clean Printable Styling & Tables
                    </span>
                  </button>

                  {/* Download Plain Text .txt */}
                  <button
                    onClick={handleExportTxt}
                    disabled={selectedLessons.length === 0}
                    className="p-3.5 rounded-2xl bg-brand-charcoal hover:bg-black text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-brand-amber" />
                      <span>Plain Text (.txt)</span>
                    </div>
                    <span className="text-[10px] opacity-80 font-normal">
                      Universal Lightweight ASCII File
                    </span>
                  </button>

                  {/* Download Markdown .md */}
                  <button
                    onClick={handleExportMd}
                    disabled={selectedLessons.length === 0}
                    className="p-3.5 rounded-2xl bg-white hover:bg-brand-sand border border-brand-slate/25 text-brand-charcoal font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-2xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span>Markdown (.md)</span>
                    </div>
                    <span className="text-[10px] opacity-80 font-normal text-brand-muted">
                      Compatible with Obsidian / Notion
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Notes Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-mono font-bold text-brand-muted uppercase block">
                    Choose Lesson Chapter to Add/Edit Note
                  </label>
                </div>
                {savedToast && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Note Saved!
                  </span>
                )}
              </div>

              {/* Lesson Pills Selector */}
              <div className="flex gap-1.5 overflow-x-auto pb-2">
                {LESSON_MODULES.map((mod) => {
                  const isActive = mod.id === editingLessonId;
                  const hasNotes = !!notes[mod.id];
                  return (
                    <button
                      key={mod.id}
                      onClick={() => handleSwitchEditingLesson(mod.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-brand-charcoal text-white shadow-2xs'
                          : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-charcoal border border-brand-slate/15'
                      }`}
                    >
                      <span>0{mod.lessonNum}</span>
                      <span className="truncate max-w-[120px]">{mod.titleEn}</span>
                      {hasNotes && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Note Editor Area */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-brand-amber/10 border border-brand-amber/25 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-brand-amber-dark shrink-0 mt-0.5" />
                  <p className="text-xs text-brand-charcoal leading-relaxed">
                    Write your personal thoughts, interview cheat sheets, mental mnemonics, or questions for this lesson. Notes are saved automatically to your device and included in your exports.
                  </p>
                </div>

                <textarea
                  value={currentDraftNote}
                  onChange={(e) => setCurrentDraftNote(e.target.value)}
                  placeholder={`Write your personal study notes for this lesson here...\nExample:\n- Transformer attention mechanism weighs the importance of all prior words simultaneously.\n- Don't confuse fine-tuning (style/format) with RAG (external factual lookup).`}
                  className="w-full h-48 p-4 rounded-2xl border border-brand-slate/20 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-brand-amber/50 bg-brand-sand/10 leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-brand-muted">
                    {currentDraftNote.length} characters • Stored locally in offline cache
                  </span>

                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl bg-brand-amber hover:bg-brand-amber-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
