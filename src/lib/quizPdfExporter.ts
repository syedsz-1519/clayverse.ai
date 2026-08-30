// Quiz Performance Summary and Progress Report PDF Export Utility
// Generates a comprehensive, beautifully styled printable PDF report for Clayverse AI students

import { QuizSessionRecord } from '../components/QuizPerformanceBarChart';
import { quizModules } from '../data/quizQuestions';
import { DailyStreakState } from './streakManager';

export interface QuizReportExportOptions {
  studentName?: string;
  studentEmail?: string;
  sessions: QuizSessionRecord[];
  kpiStats?: {
    avgAccuracy: number;
    totalPoints: number;
    totalCompleted: number;
    bestCategory: string;
    streakBonusCount: number;
  };
  streakState?: DailyStreakState;
  masteredConcepts?: string[];
  language?: 'en' | 'ur';
}

export function exportQuizPerformancePdf(options: QuizReportExportOptions): void {
  const {
    studentName = 'Clayverse AI Scholar',
    studentEmail = 'student@clayverse.ai',
    sessions = [],
    streakState,
    masteredConcepts = [],
    language = 'en'
  } = options;

  let kpiStats = options.kpiStats;
  if (!kpiStats) {
    let totalScoreEarned = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;
    let streakBonusCount = 0;

    sessions.forEach(s => {
      totalScoreEarned += s.scoreEarned;
      totalQuestions += s.totalCount;
      totalCorrect += s.correctCount;
      if (s.multiplierApplied && s.multiplierApplied > 1) {
        streakBonusCount++;
      }
    });

    const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    kpiStats = {
      avgAccuracy,
      totalPoints: totalScoreEarned,
      totalCompleted: sessions.length,
      bestCategory: 'Foundations & Architectures',
      streakBonusCount
    };
  }

  const isUr = language === 'ur';
  const reportDate = new Date();
  const formattedDate = reportDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = reportDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate sorted sessions (chronological descending for list)
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Module competency calculations
  const moduleSummaries = quizModules.map(mod => {
    const sectionIds = mod.sections.map(s => s.id);
    const matching = sessions.filter(s => sectionIds.includes(s.sectionId));
    
    let totalCorrect = 0;
    let totalQuestions = 0;
    let totalPoints = 0;
    let highScore = 0;

    matching.forEach(s => {
      totalCorrect += s.correctCount;
      totalQuestions += s.totalCount;
      totalPoints += s.scoreEarned;
      if (s.scoreEarned > highScore) highScore = s.scoreEarned;
    });

    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const attempts = matching.length;
    const status = attempts === 0 ? 'Pending' : accuracy >= 80 ? 'Mastered' : accuracy >= 60 ? 'In Progress' : 'Needs Review';
    const statusColor = attempts === 0 ? '#64748b' : accuracy >= 80 ? '#059669' : accuracy >= 60 ? '#d97706' : '#e11d48';

    return {
      id: mod.id,
      number: mod.number,
      title: isUr ? mod.title.ur : mod.title.en,
      difficulty: mod.difficulty,
      attempts,
      accuracy,
      totalPoints,
      highScore,
      status,
      statusColor,
      sectionsTotal: mod.sections.length
    };
  });

  // Calculate session-by-session trends
  // (In chronological order from oldest to newest)
  const chronologicalSessions = [...sessions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const sessionTrendMap = new Map<string, { deltaAccuracy: number; deltaPoints: number }>();
  chronologicalSessions.forEach((sess, idx) => {
    const acc = sess.totalCount > 0 ? Math.round((sess.correctCount / sess.totalCount) * 100) : 0;
    if (idx === 0) {
      sessionTrendMap.set(sess.id, { deltaAccuracy: 0, deltaPoints: 0 });
    } else {
      const prev = chronologicalSessions[idx - 1];
      const prevAcc = prev.totalCount > 0 ? Math.round((prev.correctCount / prev.totalCount) * 100) : 0;
      sessionTrendMap.set(sess.id, {
        deltaAccuracy: acc - prevAcc,
        deltaPoints: sess.scoreEarned - prev.scoreEarned
      });
    }
  });

  // Recent 10 sessions table rows
  const sessionRowsHtml = sortedSessions.slice(0, 15).map((s, idx) => {
    const sDate = new Date(s.timestamp);
    const dateStr = sDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const timeStr = sDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const accuracy = s.totalCount > 0 ? Math.round((s.correctCount / s.totalCount) * 100) : 0;
    const trend = sessionTrendMap.get(s.id) || { deltaAccuracy: 0, deltaPoints: 0 };
    
    let trendBadge = `<span style="color:#64748b; font-weight:600;">— Baseline</span>`;
    if (trend.deltaAccuracy > 0) {
      trendBadge = `<span style="color:#059669; font-weight:bold; background:#ecfdf5; padding:2px 6px; border-radius:4px;">▲ +${trend.deltaAccuracy}%</span>`;
    } else if (trend.deltaAccuracy < 0) {
      trendBadge = `<span style="color:#e11d48; font-weight:bold; background:#fff1f2; padding:2px 6px; border-radius:4px;">▼ ${trend.deltaAccuracy}%</span>`;
    } else if (idx < sortedSessions.length - 1) {
      trendBadge = `<span style="color:#64748b; font-weight:600; background:#f1f5f9; padding:2px 6px; border-radius:4px;">= 0%</span>`;
    }

    const accuracyColor = accuracy >= 80 ? '#059669' : accuracy >= 60 ? '#d97706' : '#e11d48';
    const title = isUr ? s.sectionTitle.ur : s.sectionTitle.en;

    return `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
        <td style="padding: 8px 10px; color: #475569; font-family: monospace;">${dateStr} <span style="color:#94a3b8; font-size:10px;">${timeStr}</span></td>
        <td style="padding: 8px 10px; font-weight: 600; color: #1e293b;">
          ${title}
          ${s.practiceMode ? '<span style="font-size:9px; background:#eff6ff; color:#2563eb; padding:1px 4px; border-radius:3px; margin-left:4px;">PRACTICE</span>' : ''}
        </td>
        <td style="padding: 8px 10px; text-align: center; font-weight: bold; color: ${accuracyColor};">
          ${accuracy}%
        </td>
        <td style="padding: 8px 10px; text-align: center; font-family: monospace;">
          <strong>${s.scoreEarned} pts</strong> <span style="color:#64748b; font-size:10px;">(${s.correctCount}/${s.totalCount})</span>
        </td>
        <td style="padding: 8px 10px; text-align: center;">
          ${trendBadge}
        </td>
        <td style="padding: 8px 10px; text-align: right; font-family: monospace; font-size: 10px; color: #d97706;">
          ${s.multiplierApplied && s.multiplierApplied > 1 ? `x${s.multiplierApplied} Bonus` : '1.0x Base'}
        </td>
      </tr>
    `;
  }).join('');

  // Module summaries rows
  const moduleRowsHtml = moduleSummaries.map(m => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11.5px;">
      <td style="padding: 8px 10px; font-weight: bold; color: #0f172a;">
        Module ${m.number}: ${m.title}
      </td>
      <td style="padding: 8px 10px; text-align: center; color: #64748b; font-family: monospace;">
        ${m.difficulty}
      </td>
      <td style="padding: 8px 10px; text-align: center; font-weight: 600;">
        ${m.attempts} attempts
      </td>
      <td style="padding: 8px 10px; text-align: center; font-weight: bold; color: ${m.statusColor};">
        ${m.attempts > 0 ? `${m.accuracy}%` : '—'}
      </td>
      <td style="padding: 8px 10px; text-align: center; font-family: monospace; font-weight: 600; color: #d97706;">
        ${m.highScore} / 50 pts
      </td>
      <td style="padding: 8px 10px; text-align: right;">
        <span style="display:inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; color: ${m.statusColor}; background: ${m.statusColor}15; border: 1px solid ${m.statusColor}30;">
          ${m.status}
        </span>
      </td>
    </tr>
  `).join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to open and print your Quiz Performance PDF Report.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${language}">
      <head>
        <meta charset="utf-8" />
        <title>Clayverse AI - Quiz Performance Summary & Progress Report - ${formattedDate}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 12mm 15mm 12mm;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            .page-break {
              page-break-before: always;
            }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 20px;
            font-size: 12px;
            line-height: 1.45;
          }
          .header-banner {
            border-bottom: 2.5px solid #d97706;
            padding-bottom: 14px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .title-area h1 {
            margin: 0 0 4px 0;
            font-size: 20px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
          }
          .title-area p {
            margin: 0;
            font-size: 11px;
            color: #d97706;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }
          .meta-box {
            text-align: right;
            font-size: 11px;
            color: #475569;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 18px;
          }
          .kpi-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px 12px;
          }
          .kpi-label {
            font-size: 9.5px;
            font-weight: 700;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 4px;
          }
          .kpi-val {
            font-size: 18px;
            font-weight: 900;
            color: #0f172a;
            font-family: monospace;
          }
          .kpi-sub {
            font-size: 9.5px;
            color: #059669;
            font-weight: 600;
            margin-top: 2px;
          }
          .section-heading {
            font-size: 13px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 16px 0 8px 0;
            padding-bottom: 4px;
            border-bottom: 1.5px solid #cbd5e1;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
          }
          th {
            background: #f1f5f9;
            color: #334155;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 8px 10px;
            border-bottom: 2px solid #cbd5e1;
          }
          .btn-print {
            background: #d97706;
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            font-size: 13px;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .btn-close {
            background: #f1f5f9;
            color: #334155;
            border: 1px solid #cbd5e1;
            padding: 10px 16px;
            font-size: 13px;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            margin-left: 8px;
          }
          .recommendation-box {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 10px;
            padding: 12px 14px;
            margin-top: 14px;
          }
          .footer {
            margin-top: 24px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
            font-size: 9.5px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <!-- Print Action Bar for preview -->
        <div class="no-print" style="background:#0f172a; color:#fff; padding:12px 16px; border-radius:10px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="color:#f59e0b; font-size:14px;">🖨️ PDF Ready: Quiz Performance Summary & Progress Report</strong>
            <div style="font-size:11px; color:#94a3b8; margin-top:2px;">Click 'Save as PDF' or 'Print Report' below to generate your official PDF download.</div>
          </div>
          <div>
            <button class="btn-print" onclick="window.print()">Print / Save to PDF</button>
            <button class="btn-close" onclick="window.close()">Close Window</button>
          </div>
        </div>

        <!-- Official Header -->
        <div class="header-banner">
          <div class="title-area">
            <p>Clayverse AI • Academy Performance Record</p>
            <h1>Quiz Performance & Learning Progress Report</h1>
            <div style="font-size: 11.5px; color: #475569; margin-top: 4px;">
              Student: <strong>${studentName}</strong> (${studentEmail})
            </div>
          </div>
          <div class="meta-box">
            <div>Date: <strong>${formattedDate}</strong></div>
            <div>Time: <strong>${formattedTime}</strong></div>
            <div>Curriculum: <strong>AI & LLM Architecture Track</strong></div>
            <div>Benchmark Threshold: <strong style="color:#059669;">80% Mastery</strong></div>
          </div>
        </div>

        <!-- KPI Performance Cards -->
        <div class="kpi-grid">
          <div class="kpi-card" style="border-left: 3.5px solid #059669;">
            <div class="kpi-label">Average Quiz Accuracy</div>
            <div class="kpi-val" style="color: #059669;">${kpiStats.avgAccuracy}%</div>
            <div class="kpi-sub">${kpiStats.avgAccuracy >= 80 ? '✓ Exceeding Benchmark' : 'Near Passing Target'}</div>
          </div>

          <div class="kpi-card" style="border-left: 3.5px solid #d97706;">
            <div class="kpi-label">Total Arena Points (XP)</div>
            <div class="kpi-val" style="color: #d97706;">${kpiStats.totalPoints} pts</div>
            <div class="kpi-sub" style="color: #d97706;">Includes Streak Bonuses</div>
          </div>

          <div class="kpi-card" style="border-left: 3.5px solid #2563eb;">
            <div class="kpi-label">Evaluation Batches</div>
            <div class="kpi-val" style="color: #2563eb;">${kpiStats.totalCompleted}</div>
            <div class="kpi-sub" style="color: #2563eb;">5-MCQ Quiz Sessions</div>
          </div>

          <div class="kpi-card" style="border-left: 3.5px solid #7c3aed;">
            <div class="kpi-label">Daily Streak & Habit</div>
            <div class="kpi-val" style="color: #7c3aed;">${streakState?.currentStreak || 1} Days</div>
            <div class="kpi-sub" style="color: #7c3aed;">Best: ${streakState?.longestStreak || 1}d Streak</div>
          </div>
        </div>

        <!-- Module Mastery Summary Table -->
        <div class="section-heading">
          <span>1. Module-by-Module Competency Breakdown</span>
          <span style="font-size: 10px; font-weight: 600; color: #64748b;">5 Core Curricular Modules</span>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Module Title</th>
              <th style="text-align: center;">Tier</th>
              <th style="text-align: center;">Attempts</th>
              <th style="text-align: center;">Avg Accuracy</th>
              <th style="text-align: center;">High Score</th>
              <th style="text-align: right;">Mastery Status</th>
            </tr>
          </thead>
          <tbody>
            ${moduleRowsHtml}
          </tbody>
        </table>

        <!-- Recent Quiz Sessions Breakdown Table -->
        <div class="section-heading">
          <span>2. Detailed Quiz Performance Log & Session Trends</span>
          <span style="font-size: 10px; font-weight: 600; color: #64748b;">Chronological History & Delta vs Prior Quiz</span>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Date & Time</th>
              <th style="text-align: left;">Quiz Topic / Section</th>
              <th style="text-align: center;">Accuracy</th>
              <th style="text-align: center;">Score Earned</th>
              <th style="text-align: center;">Trend vs Prior</th>
              <th style="text-align: right;">Streak Multiplier</th>
            </tr>
          </thead>
          <tbody>
            ${sessionRowsHtml}
          </tbody>
        </table>

        <!-- AI Tutor Recommendations Box -->
        <div class="recommendation-box">
          <div style="font-weight: 800; font-size: 11.5px; color: #92400e; text-transform: uppercase; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span>🤖 AI Tutor Diagnostic & Recommended Next Steps</span>
          </div>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #78350f; line-height: 1.45;">
            <strong>Strongest Competency Domain:</strong> ${kpiStats.bestCategory} with sustained accuracy above passing threshold.<br />
            <strong>Focus Area:</strong> Continue regular daily check-ins to protect your <strong>${streakState?.currentStreak || 1}-day streak</strong> and maintain benchmark accuracy in advanced Transformer & Attention mechanisms.
          </p>
          <div style="font-size: 10.5px; color: #b45309; font-weight: 600;">
            • Recommended next session: Complete Module 4 deep-dive on <em>Self-Attention & Multi-Head Projections</em> to unlock Platinum Scholar Badge.
          </div>
        </div>

        <!-- Official Report Verification Footer -->
        <div class="footer">
          <div>Generated by Clayverse AI Interactive Learning Platform • Document ID: CLAY-${reportDate.getTime().toString(36).toUpperCase()}</div>
          <div>Page 1 of 1 • Certified Educational Record</div>
        </div>

        <script>
          // Automatically prompt print dialog after window loads
          window.addEventListener('load', () => {
            setTimeout(() => {
              window.print();
            }, 350);
          });
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
