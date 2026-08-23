import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Star, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Brain, 
  Clock, 
  X, 
  Award, 
  Trash2, 
  ShieldCheck,
  Video,
  Code,
  Share2,
  Heart
} from 'lucide-react';
import { 
  CommunityPeerReviewManager, 
  AnonymousInterviewSubmission, 
  PeerReviewComment 
} from '../lib/communityPeerReview';
import { MockInterviewRecord } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';

export interface CommunityPeerReviewFeedProps {
  interviewHistory: MockInterviewRecord[];
  onOpenAuth?: () => void;
  className?: string;
}

export default function CommunityPeerReviewFeed({
  interviewHistory,
  onOpenAuth,
  className = ''
}: CommunityPeerReviewFeedProps) {
  const { lang } = useLanguage();
  const [submissions, setSubmissions] = useState<AnonymousInterviewSubmission[]>(() => {
    return CommunityPeerReviewManager.getSubmissions();
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

  // Submit modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedInterviewForSubmission, setSelectedInterviewForSubmission] = useState<MockInterviewRecord | null>(null);
  const [submissionPromptQuestion, setSubmissionPromptQuestion] = useState('');

  // Write Review State
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<string | null>(null);
  const [newCritiqueText, setNewCritiqueText] = useState('');
  const [technicalRating, setTechnicalRating] = useState(5);
  const [clarityRating, setClarityRating] = useState(5);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (selectedRoleFilter !== 'all' && !sub.roleTrack.toLowerCase().includes(selectedRoleFilter.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchRole = sub.roleTrack.toLowerCase().includes(q);
        const matchQuestion = sub.targetFocusQuestion.toLowerCase().includes(q);
        const matchTopics = sub.topics.some(t => t.toLowerCase().includes(q));
        const matchAnswers = sub.attempts.some(a => 
          a.questionText.toLowerCase().includes(q) || a.userAnswer.toLowerCase().includes(q)
        );
        if (!matchRole && !matchQuestion && !matchTopics && !matchAnswers) {
          return false;
        }
      }
      return true;
    });
  }, [submissions, selectedRoleFilter, searchQuery]);

  // Handle Upvote
  const handleToggleUpvote = (id: string) => {
    audioEngine.playLoFiChord();
    const updated = CommunityPeerReviewManager.toggleUpvoteSubmission(id);
    setSubmissions(updated);
  };

  // Handle Review helpful toggle
  const handleToggleHelpfulReview = (subId: string, revId: string) => {
    audioEngine.playLoFiChord();
    const updated = CommunityPeerReviewManager.toggleHelpfulReview(subId, revId);
    setSubmissions(updated);
  };

  // Submit interview transcript anonymously
  const handleConfirmSubmit = () => {
    if (!selectedInterviewForSubmission) return;
    audioEngine.playLoFiChord();
    const created = CommunityPeerReviewManager.submitInterviewAnonymously(
      selectedInterviewForSubmission,
      submissionPromptQuestion
    );
    setSubmissions(CommunityPeerReviewManager.getSubmissions());
    setIsSubmitModalOpen(false);
    setSelectedInterviewForSubmission(null);
    setSubmissionPromptQuestion('');
    setFeedbackToast('Your interview transcript has been posted anonymously to the community! 🎉');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Post peer critique review
  const handlePostReview = (submissionId: string) => {
    if (!newCritiqueText.trim()) return;
    audioEngine.playLoFiChord();
    const updated = CommunityPeerReviewManager.addPeerReview(
      submissionId,
      newCritiqueText.trim(),
      technicalRating,
      clarityRating
    );
    setSubmissions(updated);
    setReviewingSubmissionId(null);
    setNewCritiqueText('');
    setFeedbackToast('Thank you for contributing a constructive peer review! (+150 XP)');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Delete submission
  const handleDeleteSubmission = (id: string) => {
    const updated = CommunityPeerReviewManager.deleteSubmission(id);
    setSubmissions(updated);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* ========================================================================= */}
      {/* 1. COMMUNITY PEER REVIEW HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-charcoal to-black text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Users className="w-3.5 h-3.5" />
                <span>ANONYMOUS PEER REVIEW FEED</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                100% Anonymized & Safe
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-black text-white">
              Collaborative Interview Feedback & Peer Critiques
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Submit your mock interview transcripts anonymously to receive constructive critiques on system design trade-offs, coding explanations, and communication from other AI scholars.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (interviewHistory.length === 0) {
                  alert('Please complete at least one mock interview round first before submitting for peer review.');
                  return;
                }
                setSelectedInterviewForSubmission(interviewHistory[0]);
                setIsSubmitModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-amber to-amber-500 text-brand-charcoal font-mono font-black text-xs tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>SUBMIT TRANSCRIPT</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & TRACK FILTER TOOLBAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-brand-slate/15 shadow-2xs">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcripts, topics, or questions..."
            className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-brand-sand/40 border border-brand-slate/20 text-xs text-brand-charcoal placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Tracks' },
            { id: 'machine learning', label: 'AI/ML Engineer' },
            { id: 'generative', label: 'GenAI & LLMs' },
            { id: 'system design', label: 'System Design' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedRoleFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                selectedRoleFilter === item.id
                  ? 'bg-brand-charcoal text-white shadow-xs'
                  : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. PEER REVIEW TRANSCRIPTS FEED */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-brand-slate/15 space-y-2">
            <p className="font-bold text-brand-charcoal text-sm">No community submissions found.</p>
            <p className="text-xs text-brand-slate">Be the first to submit a mock interview transcript for peer review!</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const isExpanded = expandedSubmissionId === sub.id;
            const isReviewing = reviewingSubmissionId === sub.id;

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header: Author Alias + Decision Badge + Upvotes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-slate/10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-amber/20 to-blue-500/20 text-2xl flex items-center justify-center shadow-xs">
                      {sub.avatarEmoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-sm font-bold text-brand-charcoal">
                          {sub.anonymousAlias}
                        </h4>
                        {sub.isCurrentUserSubmission && (
                          <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-brand-amber-dark text-[9px] font-mono font-bold">
                            You
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-brand-muted">
                          • {sub.submittedAtStr}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-brand-charcoal">
                          {sub.roleTrack}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-700">
                          {sub.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics & Upvote Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-brand-muted block">AI Score</span>
                      <span className="text-sm font-mono font-black text-brand-charcoal">
                        {sub.overallScore}%
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleUpvote(sub.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        sub.userUpvoted
                          ? 'bg-amber-500/20 text-brand-amber-dark border border-brand-amber/40 shadow-xs'
                          : 'bg-brand-sand/50 text-brand-slate hover:bg-brand-sand border border-brand-slate/20'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${sub.userUpvoted ? 'fill-current' : ''}`} />
                      <span>{sub.upvotesCount}</span>
                    </button>

                    {sub.isCurrentUserSubmission && (
                      <button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        className="p-2 rounded-xl text-brand-slate/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Candidate Focus Request */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-brand-amber/25 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-brand-amber-dark flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-amber" />
                    <span>Candidate's Review Focus:</span>
                  </span>
                  <p className="text-xs text-brand-charcoal font-medium leading-relaxed">
                    "{sub.targetFocusQuestion}"
                  </p>
                </div>

                {/* Question & Answer Excerpt */}
                <div className="space-y-3">
                  {sub.attempts.slice(0, isExpanded ? undefined : 1).map((att, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-brand-sand/30 border border-brand-slate/15 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-brand-charcoal">
                          Question {idx + 1}: {att.questionText}
                        </span>
                        <span className="text-brand-muted shrink-0 ml-2">Score: {att.score}%</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-brand-slate/15 text-xs text-brand-charcoal leading-relaxed">
                        <p className="text-[10px] font-mono font-bold text-brand-muted mb-1">Spoken Candidate Response:</p>
                        <p className="line-clamp-4">{att.userAnswer}</p>
                      </div>

                      <div className="text-[11px] text-brand-slate bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                        <span className="font-bold text-emerald-800">AI Evaluator Feedback: </span>
                        <span>{att.aiFeedback}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expand / Collapse Button if multiple questions */}
                {sub.attempts.length > 1 && (
                  <button
                    onClick={() => setExpandedSubmissionId(isExpanded ? null : sub.id)}
                    className="text-xs font-mono font-bold text-brand-amber hover:text-brand-amber-dark flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Show Less Questions' : `View All ${sub.attempts.length} Interview Questions`}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}

                {/* Peer Reviews Count & Thread Toggle */}
                <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-charcoal flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-brand-amber" />
                      <span>{sub.reviews.length} Peer Critiques</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setReviewingSubmissionId(isReviewing ? null : sub.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-mono font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{isReviewing ? 'Cancel Review' : 'Write Peer Critique'}</span>
                  </button>
                </div>

                {/* Write Peer Review Form Drawer */}
                <AnimatePresence>
                  {isReviewing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-2xl bg-brand-sand/50 border border-brand-slate/20 space-y-3"
                    >
                      <h5 className="font-display text-xs font-bold text-brand-charcoal">
                        Write Constructive Peer Feedback (+150 XP):
                      </h5>

                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                          <label className="block text-brand-slate mb-1">Technical Depth:</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setTechnicalRating(star)}
                                className={`text-sm cursor-pointer ${star <= technicalRating ? 'text-amber-500' : 'text-slate-300'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-brand-slate mb-1">Clarity & Structure:</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setClarityRating(star)}
                                className={`text-sm cursor-pointer ${star <= clarityRating ? 'text-amber-500' : 'text-slate-300'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <textarea
                        value={newCritiqueText}
                        onChange={(e) => setNewCritiqueText(e.target.value)}
                        placeholder="Provide constructive feedback on what they explained well and what trade-offs or technical details they could clarify..."
                        rows={3}
                        className="w-full p-3 rounded-xl bg-white border border-brand-slate/20 text-xs text-brand-charcoal placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReviewingSubmissionId(null)}
                          className="px-3 py-1.5 rounded-xl bg-brand-sand text-brand-slate text-xs font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePostReview(sub.id)}
                          disabled={!newCritiqueText.trim()}
                          className="px-4 py-1.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5 text-brand-amber" />
                          <span>Publish Peer Critique</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Existing Peer Reviews List */}
                {sub.reviews.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    {sub.reviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 rounded-2xl bg-white border border-brand-slate/15 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{rev.authorAvatarEmoji}</span>
                            <span className="font-bold text-brand-charcoal">{rev.authorAlias}</span>
                            <span className="text-[10px] font-mono text-brand-muted">({rev.authorRole})</span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[10px]">
                            <span className="text-amber-600 font-bold">★ {rev.technicalDepthRating}/5 Depth</span>
                            <button
                              onClick={() => handleToggleHelpfulReview(sub.id, rev.id)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] transition-all flex items-center gap-1 cursor-pointer ${
                                rev.userUpvoted
                                  ? 'bg-emerald-500/20 text-emerald-800 font-bold'
                                  : 'bg-brand-sand/50 text-brand-slate hover:bg-brand-sand'
                              }`}
                            >
                              <span>👍 Helpful ({rev.helpfulUpvotes})</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-brand-slate leading-relaxed">
                          {rev.generalCritique}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </motion.div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. SUBMIT INTERVIEW TRANSCRIPT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSubmitModalOpen && selectedInterviewForSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-slate/20 space-y-5 relative"
            >
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-brand-sand/70 hover:bg-brand-sand flex items-center justify-center text-brand-charcoal transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 font-mono text-[10px] font-black uppercase">
                    ANONYMOUS SUBMISSION
                  </span>
                </div>
                <h3 className="font-display text-lg font-black text-brand-charcoal">
                  Submit Interview Transcript to Community
                </h3>
                <p className="text-xs text-brand-slate">
                  Your personal name and account details will be scrubbed and replaced with a random scholar alias.
                </p>
              </div>

              {/* Select from interview history */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-brand-charcoal">
                  Choose Mock Interview Round:
                </label>
                <select
                  value={selectedInterviewForSubmission.id}
                  onChange={(e) => {
                    const found = interviewHistory.find(r => r.id === e.target.value);
                    if (found) setSelectedInterviewForSubmission(found);
                  }}
                  className="w-full p-2.5 rounded-xl bg-brand-sand/40 border border-brand-slate/20 text-xs font-mono text-brand-charcoal"
                >
                  {interviewHistory.map((rec) => (
                    <option key={rec.id} value={rec.id}>
                      {rec.roleTrack} ({rec.difficulty}) — Score: {rec.overallScore}% ({rec.dateStr})
                    </option>
                  ))}
                </select>
              </div>

              {/* Prompt question for peers */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-brand-charcoal">
                  What specific feedback are you seeking?
                </label>
                <input
                  type="text"
                  value={submissionPromptQuestion}
                  onChange={(e) => setSubmissionPromptQuestion(e.target.value)}
                  placeholder="e.g., Looking for feedback on my RAG chunking trade-offs and latency explanation."
                  className="w-full p-3 rounded-xl bg-white border border-brand-slate/20 text-xs text-brand-charcoal placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
                />
              </div>

              {/* Anonymity guarantee note */}
              <div className="p-3 rounded-xl bg-slate-50 border border-brand-slate/15 flex items-start gap-2 text-xs text-brand-slate">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All candidate emails, names, and IP addresses are completely masked. You will appear as an anonymous coder handle (e.g. "Anonymous ML Engineer #312").
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-brand-sand text-brand-slate text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="w-2/3 py-2.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-mono font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-brand-amber" />
                  <span>Publish Anonymously</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Confirmation Toast */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-brand-charcoal text-white rounded-2xl shadow-2xl border border-brand-amber/40 text-xs font-medium flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-brand-amber shrink-0" />
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
