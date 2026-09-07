import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Youtube, BookOpen, ExternalLink, Clock, BarChart3, Bookmark, Share2 } from 'lucide-react';
import { Resource } from '../data/resourcesData';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  resources: Resource[];
  description?: string;
}

export default function ResourceModal({
  isOpen,
  onClose,
  title,
  resources,
  description
}: ResourceModalProps) {
  const { lang, t, dir } = useLanguageMultilingual();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(resources[0] || null);
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set());

  const toggleSave = (resourceId: string) => {
    const newSaved = new Set(savedResources);
    if (newSaved.has(resourceId)) {
      newSaved.delete(resourceId);
    } else {
      newSaved.add(resourceId);
    }
    setSavedResources(newSaved);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-brand-sand text-brand-charcoal border-brand-slate/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'article':
        return <BookOpen className="w-4 h-4" />;
      case 'course':
        return <BarChart3 className="w-4 h-4" />;
      case 'documentation':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, Record<string, string>> = {
      en: {
        youtube: 'Video',
        article: 'Article',
        course: 'Course',
        documentation: 'Documentation'
      },
      hi: {
        youtube: 'वीडियो',
        article: 'लेख',
        course: 'कोर्स',
        documentation: 'दस्तावेज़'
      },
      ur: {
        youtube: 'ویڈیو',
        article: 'مقالہ',
        course: 'کورس',
        documentation: 'دستاویزات'
      }
    };
    return typeLabels[lang]?.[type] || type;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            dir={dir}
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-amber/10 to-brand-sand/10 border-b border-brand-slate/10 p-6 flex items-start justify-between shrink-0">
                <div className="flex-grow">
                  <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-1">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-sm text-brand-muted max-w-2xl">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white border border-brand-slate/10 hover:bg-brand-sand flex items-center justify-center transition-colors shrink-0"
                >
                  <X className="w-5 h-5 text-brand-charcoal" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-grow overflow-hidden flex flex-col lg:flex-row">
                {/* Resources List - Left */}
                <div className="lg:w-80 border-r border-brand-slate/10 overflow-y-auto">
                  <div className="p-4 space-y-2">
                    {resources.map((resource, idx) => (
                      <motion.button
                        key={resource.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedResource(resource)}
                        className={`w-full text-left p-3 rounded-xl transition-all border-2 group ${
                          selectedResource?.id === resource.id
                            ? 'bg-brand-amber/10 border-brand-amber shadow-sm'
                            : 'bg-white border-brand-slate/10 hover:border-brand-amber/30 hover:bg-brand-sand/20'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <div className={`p-2 rounded-lg text-brand-amber ${
                            selectedResource?.id === resource.id ? 'bg-brand-amber/20' : 'bg-brand-sand/50'
                          }`}>
                            {getTypeIcon(resource.type)}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-xs font-bold text-brand-slate uppercase tracking-wide mb-0.5">
                              {getTypeLabel(resource.type)}
                            </p>
                            <p className="text-sm font-bold text-brand-charcoal line-clamp-2 group-hover:text-brand-amber transition-colors">
                              {resource.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-10 text-[10px] text-brand-muted">
                          {resource.duration && (
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {resource.duration}
                            </span>
                          )}
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${getDifficultyColor(resource.difficulty)}`}>
                            {resource.difficulty}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Resource Preview - Right */}
                <div className="flex-grow overflow-y-auto">
                  {selectedResource ? (
                    <motion.div
                      key={selectedResource.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 sm:p-8"
                    >
                      {/* Resource Header */}
                      <div className="mb-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded-xl bg-brand-amber/10 flex items-center justify-center text-brand-amber">
                              {getTypeIcon(selectedResource.type)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-brand-slate uppercase tracking-wide">
                                {getTypeLabel(selectedResource.type)}
                              </p>
                              <p className={`text-xs font-bold border px-2 py-0.5 rounded-full mt-1 ${getDifficultyColor(selectedResource.difficulty)}`}>
                                {selectedResource.difficulty.toUpperCase()} LEVEL
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSave(selectedResource.id)}
                              className={`p-2 rounded-lg transition-all ${
                                savedResources.has(selectedResource.id)
                                  ? 'bg-brand-amber/20 text-brand-amber'
                                  : 'bg-brand-sand hover:bg-brand-sand/80 text-brand-slate'
                              }`}
                              title="Save for later"
                            >
                              <Bookmark className={`w-5 h-5 ${savedResources.has(selectedResource.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedResource.url);
                                alert('Link copied!');
                              }}
                              className="p-2 rounded-lg bg-brand-sand hover:bg-brand-sand/80 text-brand-slate transition-all"
                              title="Copy link"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-display text-2xl font-bold text-brand-charcoal mb-2">
                          {selectedResource.title}
                        </h3>
                        <p className="text-sm text-brand-muted mb-4">
                          {selectedResource.description}
                        </p>

                        {/* Resource Metadata */}
                        <div className="grid grid-cols-3 gap-3 bg-brand-sand/30 p-4 rounded-xl mb-4">
                          {selectedResource.duration && (
                            <div>
                              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">
                                Duration
                              </p>
                              <p className="font-display font-bold text-brand-charcoal flex items-center gap-1">
                                <Clock className="w-4 h-4 text-brand-amber" />
                                {selectedResource.duration}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">
                              Difficulty
                            </p>
                            <p className={`font-bold inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm border ${getDifficultyColor(selectedResource.difficulty)}`}>
                              {selectedResource.difficulty}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1">
                              Type
                            </p>
                            <p className="font-display font-bold text-brand-charcoal flex items-center gap-1">
                              {getTypeIcon(selectedResource.type)}
                              {getTypeLabel(selectedResource.type)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.a
                        href={selectedResource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-amber to-brand-amber-dark text-white font-bold rounded-xl hover:shadow-lg transition-all"
                      >
                        <ExternalLink className="w-5 h-5" />
                        {lang === 'en' ? 'Open Resource' : 'संसाधन खोलें'}
                      </motion.a>

                      {/* Tips Section */}
                      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                          💡 {lang === 'en' ? 'Learning Tip' : 'सीखने की टिप्स'}
                        </p>
                        <ul className="text-sm text-emerald-900 space-y-1">
                          <li>• {lang === 'en' ? 'Take notes while watching/reading' : 'देखते/पढ़ते समय नोट्स लें'}</li>
                          <li>• {lang === 'en' ? 'Pause and practice concepts' : 'अवधारणाओं का अभ्यास करें'}</li>
                          <li>• {lang === 'en' ? 'Join communities to discuss' : 'चर्चा के लिए समुदायों में शामिल हों'}</li>
                        </ul>
                      </div>

                      {/* Related Resources */}
                      {resources.length > 1 && (
                        <div className="mt-6 pt-6 border-t border-brand-slate/10">
                          <p className="text-sm font-bold text-brand-charcoal mb-3">
                            {lang === 'en' ? 'More Resources' : 'अधिक संसाधन'}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {resources.filter(r => r.id !== selectedResource.id).slice(0, 4).map(resource => (
                              <button
                                key={resource.id}
                                onClick={() => setSelectedResource(resource)}
                                className="p-2 text-left bg-brand-sand/50 hover:bg-brand-sand border border-brand-slate/10 rounded-lg text-[11px] font-bold text-brand-charcoal transition-colors line-clamp-2"
                              >
                                {resource.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="p-8 flex items-center justify-center h-full text-center text-brand-muted">
                      <p>{lang === 'en' ? 'Select a resource to view details' : 'विवरण देखने के लिए एक संसाधन चुनें'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
