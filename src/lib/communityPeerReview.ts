/**
 * Community Peer Review & Anonymous Feedback Hub
 * Allows students to submit mock interview transcripts anonymously to a community feed,
 * browse peer interviews, write structured reviews/critiques, rate technical depth, and upvote.
 */

import { MockInterviewRecord, QuestionAttempt } from '../types';

export interface PeerReviewComment {
  id: string;
  authorAlias: string; // e.g. "Senior ML Reviewer #92"
  authorRole: string; // "Staff Engineer", "ML Practitioner", etc.
  authorAvatarEmoji: string;
  createdAtStr: string;
  technicalDepthRating: number; // 1-5 stars
  clarityRating: number; // 1-5 stars
  generalCritique: string;
  specificQuestionFeedback?: {
    questionIndex: number;
    feedback: string;
  }[];
  helpfulUpvotes: number;
  userUpvoted?: boolean;
}

export interface AnonymousInterviewSubmission {
  id: string;
  anonymousAlias: string; // "Anonymous ML Engineer #408"
  avatarEmoji: string;
  submittedAtStr: string;
  roleTrack: string;
  difficulty: string;
  targetFocusQuestion: string; // e.g. "Looking for feedback on my RAG vector latency explanations"
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  eyeContactScore: number;
  hiringDecision: string;
  summaryFeedback: string;
  attempts: QuestionAttempt[];
  topics: string[];
  upvotesCount: number;
  userUpvoted?: boolean;
  isCurrentUserSubmission?: boolean;
  reviews: PeerReviewComment[];
}

const STORAGE_KEY = 'clay_community_peer_submissions';

// Initial realistic seeded peer review transcripts for Day 1 community vibrancy
const INITIAL_COMMUNITY_SUBMISSIONS: AnonymousInterviewSubmission[] = [
  {
    id: 'comm_sub_01',
    anonymousAlias: 'Anonymous ML Engineer #312',
    avatarEmoji: '🤖',
    submittedAtStr: '2 hours ago',
    roleTrack: 'AI / Machine Learning Engineer',
    difficulty: 'Senior',
    targetFocusQuestion: 'Seeking critique on my trade-off analysis between Quantization (4-bit AWQ) vs LoRA fine-tuning for low-latency edge deployment.',
    overallScore: 88,
    technicalScore: 90,
    communicationScore: 86,
    eyeContactScore: 94,
    hiringDecision: 'Hire',
    summaryFeedback: 'Strong foundational grasp of model compression and loss surfaces. Structured the answer logically from quantization error to throughput benchmarks.',
    topics: ['Deep Learning', 'MLOps & Deployment', 'Generative AI & LLMs'],
    upvotesCount: 14,
    userUpvoted: false,
    attempts: [
      {
        questionId: 'q_quant_01',
        questionText: 'When deploying a 70B parameter LLM under tight latency and VRAM limits, how do you evaluate AWQ versus GGUF quantization and speculative decoding?',
        userAnswer: 'I evaluate AWQ primarily for GPU server inference where TensorRT-LLM or vLLM can leverage fused FP16/INT4 GEMM kernels with minimal perplexity degradation. For mixed CPU-GPU offload or consumer hardware, GGUF with llama.cpp provides flexible layer-by-layer offloading. If latency per output token is the primary bottleneck, I pair 4-bit AWQ with a small 1B draft model using speculative decoding to achieve 2x to 3x token generation speedup without modifying the final target distribution.',
        durationSeconds: 94,
        aiFeedback: 'Excellent technical depth! You accurately distinguished between kernel execution targets and correctly noted speculative decoding verification invariance.',
        score: 92,
        strengths: ['Identified fused GEMM advantages', 'Explained draft model verification mechanics'],
        improvements: ['Could briefly mention KV cache quantization (FP8) impact on context window scaling'],
        modelAnswer: 'Evaluate AWQ for server-side GPU throughput with kernel acceleration, and GGUF for consumer/CPU memory bounds. Add speculative decoding to overcome memory bandwidth constraints.',
        inBetweenInteractions: []
      }
    ],
    reviews: [
      {
        id: 'rev_01',
        authorAlias: 'Staff AI Architect #104',
        authorRole: 'Principal ML Engineer',
        authorAvatarEmoji: '⚡',
        createdAtStr: '1 hour ago',
        technicalDepthRating: 5,
        clarityRating: 5,
        generalCritique: 'Spot on explanation regarding speculative decoding and memory-bandwidth bound token generation. Your point on AWQ kernel fusion vs GGUF quantization shows genuine production deployment experience. In a Staff round, also mention latency trade-offs during pre-fill vs decode phases.',
        helpfulUpvotes: 8,
        userUpvoted: false
      }
    ]
  },
  {
    id: 'comm_sub_02',
    anonymousAlias: 'Anonymous GenAI Developer #189',
    avatarEmoji: '⚡',
    submittedAtStr: 'Yesterday',
    roleTrack: 'Generative AI & LLM Specialist',
    difficulty: 'Mid-Level',
    targetFocusQuestion: 'Did I structure my RAG vector database chunking and re-ranking explanation clearly?',
    overallScore: 84,
    technicalScore: 85,
    communicationScore: 83,
    eyeContactScore: 91,
    hiringDecision: 'Hire',
    summaryFeedback: 'Great explanation of hierarchical chunking and cross-encoder re-ranking pipelines to eliminate hallucinated context.',
    topics: ['Generative AI & LLMs', 'System Design'],
    upvotesCount: 9,
    userUpvoted: false,
    attempts: [
      {
        questionId: 'q_rag_01',
        questionText: 'How do you design a high-accuracy RAG pipeline to prevent context dilution and hallucination over thousands of internal PDF documents?',
        userAnswer: 'First, I implement semantic or parent-document chunking (e.g. 512-token child chunks for dense vector embedding search, mapping back to larger parent chunks for LLM context). Second, I apply a hybrid retrieval strategy combining BM25 keyword matching with dense HNSW vector search via reciprocal rank fusion (RRF). Third, I run top-50 results through a cross-encoder re-ranker like Cohere or BGE-Reranker to pass only the top 5 highly relevant passages to the prompt.',
        durationSeconds: 88,
        aiFeedback: 'Very comprehensive! Parent-document chunking and Reciprocal Rank Fusion are industry-standard patterns.',
        score: 87,
        strengths: ['Addressed hybrid search (BM25 + Dense)', 'Accurately used Re-ranker step'],
        improvements: ['Could mention citation validation or guardrail checks before returning output'],
        modelAnswer: 'Combine parent-child chunking, hybrid BM25 + dense retrieval with Reciprocal Rank Fusion, and cross-encoder re-ranking.',
        inBetweenInteractions: []
      }
    ],
    reviews: [
      {
        id: 'rev_02',
        authorAlias: 'AI Lead Reviewer #44',
        authorRole: 'Tech Lead',
        authorAvatarEmoji: '🚀',
        createdAtStr: '20 hours ago',
        technicalDepthRating: 4,
        clarityRating: 5,
        generalCritique: 'Very crisp three-step structure! The division into chunking, hybrid retrieval, and cross-encoder re-ranking was easy to follow. To make it a 10/10, consider adding a quick mention of latency budgets (e.g. re-rankers adding 50-100ms).',
        helpfulUpvotes: 5,
        userUpvoted: false
      }
    ]
  }
];

export class CommunityPeerReviewManager {
  /**
   * Get all active submissions from storage or fallback to seeded list
   */
  public static getSubmissions(): AnonymousInterviewSubmission[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_SUBMISSIONS));
        return INITIAL_COMMUNITY_SUBMISSIONS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_COMMUNITY_SUBMISSIONS;
    }
  }

  /**
   * Save submissions list
   */
  private static saveSubmissions(submissions: AnonymousInterviewSubmission[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch (e) {
      console.warn('Failed to save community submissions to storage:', e);
    }
  }

  /**
   * Submit an existing mock interview record anonymously
   */
  public static submitInterviewAnonymously(
    record: MockInterviewRecord,
    targetFocusQuestion: string = 'Looking for constructive peer feedback on my answers and clarity'
  ): AnonymousInterviewSubmission {
    const submissions = this.getSubmissions();
    const randomId = Math.floor(100 + Math.random() * 900);
    const emojis = ['🤖', '⚡', '🔬', '🎓', '🚀', '💻', '🧠', '🌟'];
    const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newSubmission: AnonymousInterviewSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      anonymousAlias: `Anonymous ${record.roleTrack.split(' ')[0]} Scholar #${randomId}`,
      avatarEmoji: chosenEmoji,
      submittedAtStr: 'Just now',
      roleTrack: record.roleTrack,
      difficulty: record.difficulty,
      targetFocusQuestion: targetFocusQuestion.trim() || 'Looking for constructive peer feedback on my answer structure.',
      overallScore: record.overallScore,
      technicalScore: record.technicalScore,
      communicationScore: record.communicationScore,
      eyeContactScore: record.eyeContactScore,
      hiringDecision: record.hiringDecision,
      summaryFeedback: record.summaryFeedback,
      attempts: record.attempts,
      topics: record.topics || ['System Design', 'Machine Learning'],
      upvotesCount: 1,
      userUpvoted: true,
      isCurrentUserSubmission: true,
      reviews: []
    };

    const updated = [newSubmission, ...submissions];
    this.saveSubmissions(updated);
    return newSubmission;
  }

  /**
   * Toggle Upvote on a submission
   */
  public static toggleUpvoteSubmission(submissionId: string): AnonymousInterviewSubmission[] {
    const list = this.getSubmissions();
    const updated = list.map(item => {
      if (item.id === submissionId) {
        const isUpvoted = !!item.userUpvoted;
        return {
          ...item,
          userUpvoted: !isUpvoted,
          upvotesCount: isUpvoted ? Math.max(0, item.upvotesCount - 1) : item.upvotesCount + 1
        };
      }
      return item;
    });
    this.saveSubmissions(updated);
    return updated;
  }

  /**
   * Add a peer review critique to a submission
   */
  public static addPeerReview(
    submissionId: string,
    critiqueText: string,
    technicalRating: number = 5,
    clarityRating: number = 5,
    reviewerRole: string = 'AI Scholar Peer'
  ): AnonymousInterviewSubmission[] {
    const list = this.getSubmissions();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newReview: PeerReviewComment = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      authorAlias: `Peer Reviewer #${randomNum}`,
      authorRole: reviewerRole,
      authorAvatarEmoji: '💡',
      createdAtStr: 'Just now',
      technicalDepthRating: technicalRating,
      clarityRating: clarityRating,
      generalCritique: critiqueText,
      helpfulUpvotes: 0,
      userUpvoted: false
    };

    const updated = list.map(item => {
      if (item.id === submissionId) {
        return {
          ...item,
          reviews: [newReview, ...item.reviews]
        };
      }
      return item;
    });

    this.saveSubmissions(updated);
    return updated;
  }

  /**
   * Toggle Helpful upvote on a review
   */
  public static toggleHelpfulReview(submissionId: string, reviewId: string): AnonymousInterviewSubmission[] {
    const list = this.getSubmissions();
    const updated = list.map(sub => {
      if (sub.id === submissionId) {
        const nextReviews = sub.reviews.map(rev => {
          if (rev.id === reviewId) {
            const isUp = !!rev.userUpvoted;
            return {
              ...rev,
              userUpvoted: !isUp,
              helpfulUpvotes: isUp ? Math.max(0, rev.helpfulUpvotes - 1) : rev.helpfulUpvotes + 1
            };
          }
          return rev;
        });
        return { ...sub, reviews: nextReviews };
      }
      return sub;
    });

    this.saveSubmissions(updated);
    return updated;
  }

  /**
   * Delete user's own submission
   */
  public static deleteSubmission(submissionId: string): AnonymousInterviewSubmission[] {
    const list = this.getSubmissions();
    const updated = list.filter(sub => sub.id !== submissionId);
    this.saveSubmissions(updated);
    return updated;
  }
}
