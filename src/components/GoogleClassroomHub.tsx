import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  RefreshCw, 
  Plus, 
  Send, 
  CheckCircle2, 
  Share2, 
  LogOut, 
  AlertCircle, 
  Calendar, 
  Sparkles,
  BookOpen,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import ReadSectionButton from './ReadSectionButton';
import CopyCodeButton from './CopyCodeButton';
import { 
  googleSignInForClassroom, 
  getCachedClassroomToken, 
  disconnectClassroom, 
  fetchClassroomCourses, 
  fetchCourseWork, 
  postClassroomAnnouncement, 
  postClassroomAssignment,
  ClassroomCourse,
  ClassroomCourseWork
} from '../lib/classroom';

export default function GoogleClassroomHub() {
  const { lang } = useLanguage();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [courseWork, setCourseWork] = useState<ClassroomCourseWork[]>([]);
  const [isLoadingWork, setIsLoadingWork] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Standalone playTone helper to avoid any module resolution issues
  const playTone = (frequency: number, type: OscillatorType = 'sine', duration: number = 0.1, volume = 0.05) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Web Audio failed:', e);
    }
  };

  useEffect(() => {
    // Check initial connection status
    setIsConnected(!!getCachedClassroomToken());

    const handleConnectionChange = () => {
      setIsConnected(!!getCachedClassroomToken());
      if (!getCachedClassroomToken()) {
        setCourses([]);
        setSelectedCourse(null);
        setCourseWork([]);
      }
    };

    window.addEventListener('classroom_connection_changed', handleConnectionChange);
    return () => window.removeEventListener('classroom_connection_changed', handleConnectionChange);
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadCourses();
    }
  }, [isConnected]);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseWork(selectedCourse.id);
    }
  }, [selectedCourse]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleConnect = async () => {
    setIsLoading(true);
    playTone(523.25, 'sine', 0.15, 0.08); // C5
    try {
      await googleSignInForClassroom();
      showNotification('success', lang === 'en' ? 'Successfully connected to Google Classroom!' : 'Google Classroom se kamyabi se rabta qaim ho gaya!');
      playTone(659.25, 'sine', 0.2, 0.08); // E5
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Connection failed.');
      playTone(220, 'sawtooth', 0.25, 0.05);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    playTone(293.66, 'sine', 0.1, 0.06); // D5
    disconnectClassroom();
    showNotification('success', lang === 'en' ? 'Disconnected from Google Classroom.' : 'Google Classroom se rabta khatam ho gaya.');
  };

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const activeCourses = await fetchClassroomCourses();
      setCourses(activeCourses);
      if (activeCourses.length > 0) {
        playTone(440, 'sine', 0.08, 0.04);
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Failed to fetch courses.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourseWork = async (courseId: string) => {
    setIsLoadingWork(true);
    try {
      const work = await fetchCourseWork(courseId);
      setCourseWork(work);
      playTone(493.88, 'sine', 0.08, 0.04); // B4
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Failed to fetch class coursework.');
    } finally {
      setIsLoadingWork(false);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!selectedCourse || !announcementText.trim()) return;
    setIsPosting(true);
    playTone(587.33, 'sine', 0.1, 0.05); // D5
    try {
      await postClassroomAnnouncement(selectedCourse.id, announcementText);
      showNotification('success', lang === 'en' ? 'Announcement successfully posted to your stream!' : 'Aapka ailan classroom stream par post ho gaya!');
      setAnnouncementText('');
      playTone(880, 'sine', 0.2, 0.06); // A5 Success
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Failed to post announcement.');
      playTone(220, 'sawtooth', 0.25, 0.05);
    } finally {
      setIsPosting(false);
    }
  };

  const handleCreateAssignment = async (title: string, desc: string) => {
    if (!selectedCourse) return;
    const confirmed = window.confirm(
      lang === 'en' 
        ? `Are you sure you want to create the assignment "${title}" in Google Classroom?`
        : `Kya aap Classroom me sabaq "${title}" create karna chahte hain?`
    );
    if (!confirmed) return;

    setIsPosting(true);
    playTone(659.25, 'sine', 0.1, 0.05);
    try {
      await postClassroomAssignment(selectedCourse.id, title, desc);
      showNotification('success', lang === 'en' ? 'Tactile Quiz Assignment posted successfully!' : 'Interactive Quiz Assignment kamyabi se post ho gaya!');
      loadCourseWork(selectedCourse.id); // reload work stream
      playTone(880, 'sine', 0.25, 0.06);
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Failed to create assignment.');
      playTone(220, 'sawtooth', 0.25, 0.05);
    } finally {
      setIsPosting(false);
    }
  };

  const presetAnnouncements = [
    {
      titleEn: "🤖 What is Artificial Intelligence?",
      titleUr: "🤖 AI kya hai?",
      text: "Hello Class! Today we explored 'Clayverse AI' and learned that Artificial Intelligence is not magic—it's a set of smart algorithms, clean visual data loops, and neural structures designed to make predictions. Try this hands-on guide: " + window.location.origin
    },
    {
      titleEn: "🎨 Clay & Sound in Modern Tech",
      titleUr: "🎨 Clay aur Sound Technology",
      text: "Hi Everyone! We are examining multi-sensory skeuomorphic interfaces. Here is an interactive sandbox where we can test prompt structures and learn computer science using real clay shapes and Web Audio synthesized chimes: " + window.location.origin
    },
    {
      titleEn: "🧠 Exploring Neural Net Family Trees",
      titleUr: "🧠 Neural Net Family Tree",
      text: "Hi class! Check out this comprehensive visual directory mapping the evolutionary path of modern LLMs, Deep Networks, and machine learning models: " + window.location.origin + "#family-tree"
    }
  ];

  const presetAssignments = [
    {
      titleEn: "Clayverse AI: Neural Net Family Tree Challenge",
      titleUr: "Clayverse AI: Neural Net ka Challenge",
      desc: "Go to " + window.location.origin + "#family-tree, explore the interactive clay neural network mapping, then test your knowledge in the Check Your Knowledge quiz. Write down 3 key learnings in your notebook."
    },
    {
      titleEn: "Practical Prompting & RAG Simulation",
      titleUr: "Practical Prompting aur RAG Simulation",
      desc: "Connect to the Interactive AI Arena at the end of the Clayverse AI app (" + window.location.origin + "), run 3 RAG search simulations with custom queries, and take a screenshot of your earned AI Explorer badge."
    }
  ];

  return (
    <section id="classroom-hub" className="max-w-5xl mx-auto px-6 py-12 scroll-mt-20 text-left">
      <div className="bg-[#FAF8F5]/90 dark:bg-white/[0.02] border-2 border-brand-slate/15 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03),_0_12px_24px_rgba(0,0,0,0.02)] relative overflow-hidden">
        {/* Soft skeuomorphic top highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/60 dark:bg-white/10"></div>
        
        {/* Clay visual styling background corner icon */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-brand-slate/10">
          <div className="space-y-1.5 max-w-2xl text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 shrink-0" />
              {lang === 'en' ? "Teacher & Student Sync" : "Ustaad aur Shagird Sync"}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-brand-charcoal tracking-tight flex items-center gap-2 justify-start">
              <GraduationCap className="w-7 h-7 text-brand-amber shrink-0" />
              {lang === 'en' ? "Google Classroom Hub" : "Google Classroom Hub"}
            </h2>
            <p className="text-xs md:text-sm text-brand-slate leading-relaxed text-left mb-3">
              {lang === 'en' 
                ? "Connect your real-world Google Classroom account. Instantly synchronize course streams, distribute Clayverse AI learning assignments, and share live interactive sandboxes with your students."
                : "Apne real-world Google Classroom account ko jorhein. Apne students ke sath fauri tor par learning materials share karein aur Clayverse AI ke challenges ko ba-zaria assignments bheinjein."}
            </p>
            <ReadSectionButton sectionId="classroom-hub" variant="compact" />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-2xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                <span>{lang === 'en' ? "Disconnect" : "Rabta Khatam"}</span>
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="flex items-center gap-2.5 py-3 px-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] cursor-pointer active:translate-y-[1px] disabled:opacity-50"
              >
                <GraduationCap className="w-4.5 h-4.5 shrink-0" />
                <span>{isLoading ? (lang === 'en' ? 'Connecting...' : 'Rabta ho raha hai...') : (lang === 'en' ? 'Connect Classroom' : 'Classroom Connect Karein')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live notification banners */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className={`mt-4 p-3.5 rounded-2xl flex items-start gap-2.5 border text-xs font-medium leading-relaxed ${
                notification.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-800 dark:text-red-300 border-red-500/20'
              }`}
            >
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isConnected ? (
          /* NOT CONNECTED STATE: SLEEK PROMPT CARD */
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4 text-left">
              <h3 className="font-display text-lg font-extrabold text-brand-charcoal">
                {lang === 'en' ? "Why connect with Google Classroom?" : "Classroom connect kyun karein?"}
              </h3>
              <ul className="space-y-3.5 text-xs text-brand-slate">
                <li className="flex items-start gap-3 justify-start">
                  <div className="w-5 h-5 rounded-lg bg-brand-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-3 h-3 text-brand-amber" />
                  </div>
                  <div>
                    <strong>{lang === 'en' ? "Distribute Interactive Lessons" : "Interactive Sabaq Bheinjein"}</strong>
                    <p className="mt-0.5 text-brand-muted">{lang === 'en' ? "Share interactive lessons on neural structures and prompting methodologies directly to student streams." : "Neural structures aur prompting ki guidelines ko aasaani se class me share karein."}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 justify-start">
                  <div className="w-5 h-5 rounded-lg bg-brand-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Share2 className="w-3 h-3 text-brand-amber" />
                  </div>
                  <div>
                    <strong>{lang === 'en' ? "Create Real Assignments" : "Real Assignments Banayein"}</strong>
                    <p className="mt-0.5 text-brand-muted">{lang === 'en' ? "Instantly transform Clayverse AI's interactive quizzes and game scorecards into graded Google Classroom coursework." : "Clayverse AI ke quizzes ko graded coursework assignments me tabdeel karein."}</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="md:col-span-5 bg-brand-sand/30 dark:bg-white/[0.01] border border-brand-slate/10 p-5 rounded-2xl text-center space-y-4">
              <GraduationCap className="w-12 h-12 text-brand-amber/40 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-brand-charcoal">
                  {lang === 'en' ? "Classroom Sandbox Ready" : "Classroom Link Tayyar Hai"}
                </h4>
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  {lang === 'en' ? "Authorize secure reading and publishing rights to synchronize active class resources safely." : "Apne active class resources ko safe tariqe se sync karne ke liye access dein."}
                </p>
              </div>
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-[0.98]"
              >
                {isLoading ? (lang === 'en' ? 'Syncing...' : 'Sync ho raha hai...') : (lang === 'en' ? 'Sign in with Google' : 'Google se Connect Karein')}
              </button>
            </div>
          </div>
        ) : (
          /* CONNECTED STATE: TWO-COLUMN CLASSROOM CONTROL WORKSPACE */
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand: Course Selector & Info (5 columns) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-[10px] font-black text-brand-amber uppercase tracking-wider">
                  {lang === 'en' ? "Active Courses" : "Aapki Active Classes"}
                </h3>
                <button
                  onClick={loadCourses}
                  className="p-1.5 rounded-lg border border-brand-slate/10 hover:border-brand-slate/25 hover:bg-brand-sand/30 transition-all text-brand-muted hover:text-brand-charcoal cursor-pointer active:scale-95"
                  title={lang === 'en' ? "Reload courses" : "Classes reload karein"}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {isLoading && courses.length === 0 ? (
                <div className="py-12 text-center text-brand-muted text-xs flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-brand-amber" />
                  <span>{lang === 'en' ? "Loading active courses..." : "Classes load ho rahi hain..."}</span>
                </div>
              ) : courses.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-brand-slate/10 rounded-2xl text-center text-brand-muted text-xs px-4">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-brand-slate/20" />
                  <span>{lang === 'en' ? "No active Google Classroom courses found." : "Google Classroom par koi active class nahi mili."}</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {courses.map((course) => {
                    const isCurrent = selectedCourse?.id === course.id;
                    return (
                      <button
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          playTone(392, 'sine', 0.1, 0.05); // G4
                        }}
                        className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center justify-between gap-3 ${
                          isCurrent 
                            ? 'bg-white dark:bg-white/[0.04] border-brand-amber shadow-sm ring-1 ring-brand-amber/30' 
                            : 'bg-white/50 dark:bg-white/[0.01] border-brand-slate/10 hover:border-brand-slate/25 hover:bg-white dark:hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="space-y-1 max-w-[85%] text-left">
                          <h4 className="font-display font-bold text-xs text-brand-charcoal truncate">
                            {course.name}
                          </h4>
                          {course.section && (
                            <p className="font-mono text-[9px] text-brand-muted font-bold uppercase tracking-wider">
                              {lang === 'en' ? `Section: ${course.section}` : `Section: ${course.section}`}
                            </p>
                          )}
                          {course.description && (
                            <p className="text-[10px] text-brand-muted truncate mt-0.5">
                              {course.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform shrink-0 ${isCurrent ? 'text-brand-amber translate-x-0.5' : 'text-brand-slate/30'}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Hand: Action Center & Coursework Stream (7 columns) */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {selectedCourse ? (
                <div className="space-y-5">
                  {/* Selected Class Info Header */}
                  <div className="p-4 bg-brand-amber/5 border border-brand-amber/15 rounded-2xl flex items-center justify-between text-left">
                    <div className="text-left">
                      <span className="font-mono text-[9px] font-bold text-brand-amber uppercase tracking-wider">
                        {lang === 'en' ? "Selected Class" : "Muntakhib Class"}
                      </span>
                      <h3 className="font-display font-extrabold text-sm text-brand-charcoal mt-0.5">
                        {selectedCourse.name}
                      </h3>
                    </div>
                    {selectedCourse.alternateLink && (
                      <a
                        href={selectedCourse.alternateLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 py-1.5 px-3 bg-white dark:bg-white/[0.03] border border-brand-slate/10 hover:border-brand-amber/30 rounded-xl text-[10px] font-bold text-brand-slate hover:text-brand-charcoal transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5 text-brand-amber" />
                        <span>{lang === 'en' ? "Open Classroom" : "Classroom Kholen"}</span>
                      </a>
                    )}
                  </div>

                  {/* Tabbed Interactive Control Panel */}
                  <div className="space-y-4">
                    {/* Part A: Share Announcement Stream */}
                    <div className="bg-white/80 dark:bg-white/[0.02] border border-brand-slate/10 p-5 rounded-2xl space-y-3.5 text-left shadow-sm">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-brand-amber" />
                          {lang === 'en' ? "Post Lesson to Class Stream" : "Ailan Ya Sabaq Post Karein"}
                        </h4>
                        <span className="font-mono text-[9px] font-bold text-brand-muted uppercase">
                          {lang === 'en' ? "Live Stream" : "Live Stream"}
                        </span>
                      </div>

                      <textarea
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        placeholder={
                          lang === 'en' 
                            ? "Type a custom update or select a quick topic template below to distribute to your students..."
                            : "Apna ailan likhein ya niche diye gaye templates me se sabaq chunain..."
                        }
                        className="w-full h-20 p-3 bg-brand-cream/40 dark:bg-black/10 border border-brand-slate/10 rounded-xl text-xs placeholder:text-brand-slate/40 text-brand-charcoal focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber/30 resize-none"
                      />

                      {/* Announcement Templates */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-brand-muted font-mono font-bold block">
                            {lang === 'en' ? "Quick Templates:" : "Aasan Sabaq Templates:"}
                          </span>
                          {announcementText.trim() && (
                            <CopyCodeButton
                              text={announcementText}
                              label={lang === 'en' ? "Copy Text" : "Text Copy"}
                              variant="compact"
                            />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {presetAnnouncements.map((preset, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setAnnouncementText(preset.text);
                                playTone(440 + idx * 40, 'sine', 0.08, 0.04);
                              }}
                              className="py-1 px-2.5 bg-brand-sand/20 hover:bg-brand-amber/10 border border-brand-slate/5 rounded-lg text-[9px] font-medium text-brand-slate hover:text-brand-amber transition-all cursor-pointer"
                            >
                              {lang === 'en' ? preset.titleEn : preset.titleUr}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handlePostAnnouncement}
                        disabled={isPosting || !announcementText.trim()}
                        className="w-full py-2 bg-brand-amber hover:bg-brand-amber-light text-brand-charcoal font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isPosting ? (lang === 'en' ? 'Posting...' : 'Post ho raha hai...') : (lang === 'en' ? 'Publish to Stream' : 'Class Stream Par Post Karein')}</span>
                      </button>
                    </div>

                    {/* Part B: Distribute Assignments & Graded Quizzes */}
                    <div className="bg-white/80 dark:bg-white/[0.02] border border-brand-slate/10 p-5 rounded-2xl space-y-3.5 text-left shadow-sm">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                          <ClipboardList className="w-3.5 h-3.5 text-brand-amber" />
                          {lang === 'en' ? "Assign Clayverse AI Challenges" : "Clayverse AI Tasks Assign Karein"}
                        </h4>
                        <span className="font-mono text-[9px] font-bold text-brand-muted uppercase">
                          {lang === 'en' ? "CourseWork" : "Ghar Ka Kaam"}
                        </span>
                      </div>

                      <p className="text-[11px] text-brand-slate leading-relaxed">
                        {lang === 'en'
                          ? "Instantly deploy interactive graded coursework assignments. Students can complete them directly in the sandbox."
                          : "Classroom me interactive coursework assignments bheinjein. Students directly sandbox me solve kar sakte hain."}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {presetAssignments.map((assignment, idx) => (
                          <div 
                            key={idx}
                            className="p-3 bg-brand-sand/15 hover:bg-brand-amber/5 border border-brand-slate/10 rounded-xl space-y-2 flex flex-col justify-between"
                          >
                            <div className="space-y-1 text-left">
                              <h5 className="font-display font-extrabold text-[11px] text-brand-charcoal leading-snug">
                                {lang === 'en' ? assignment.titleEn : assignment.titleUr}
                              </h5>
                              <p className="text-[10px] text-brand-muted leading-relaxed line-clamp-2">
                                {assignment.desc}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => handleCreateAssignment(lang === 'en' ? assignment.titleEn : assignment.titleUr, assignment.desc)}
                                className="flex-1 py-1.5 bg-white dark:bg-white/[0.03] border border-brand-slate/10 hover:border-brand-amber text-brand-charcoal font-bold text-[10px] rounded-lg cursor-pointer transition-all"
                              >
                                {lang === 'en' ? "Create Assignment" : "Assignment Banayein"}
                              </button>
                              <CopyCodeButton
                                text={`${lang === 'en' ? assignment.titleEn : assignment.titleUr}\n\n${assignment.desc}`}
                                label={lang === 'en' ? "Copy" : "Copy"}
                                variant="compact"
                                showIconOnly={true}
                                title={lang === 'en' ? "Copy assignment description" : "Assignment description copy karo"}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Part C: Live CourseWork Assignments List */}
                    <div className="bg-white/80 dark:bg-white/[0.02] border border-brand-slate/10 p-5 rounded-2xl space-y-3 text-left shadow-sm">
                      <div className="flex items-center justify-between border-b border-brand-slate/5 pb-2">
                        <h4 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                          <ClipboardList className="w-3.5 h-3.5 text-brand-amber" />
                          {lang === 'en' ? "Active Assignments Stream" : "Active Assignments Stream"}
                        </h4>
                        <span className="font-mono text-[9px] font-bold text-brand-muted">
                          {courseWork.length} {lang === 'en' ? "Items" : "Items"}
                        </span>
                      </div>

                      {isLoadingWork ? (
                        <div className="py-8 text-center text-brand-muted text-xs flex flex-col items-center gap-2">
                          <RefreshCw className="w-5 h-5 animate-spin text-brand-amber" />
                          <span>{lang === 'en' ? "Fetching homework stream..." : "Kaam load ho raha hai..."}</span>
                        </div>
                      ) : courseWork.length === 0 ? (
                        <p className="text-[11px] text-brand-muted text-center py-6 leading-relaxed">
                          {lang === 'en' 
                            ? "No coursework assignments found in this class yet. Create one above to get started!"
                            : "Is class me abhi tak koi assignment nahi banayi gayi. Upar se pehli assignment create karein!"}
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-left">
                          {courseWork.map((work) => (
                            <div 
                              key={work.id}
                              className="p-3 bg-white/40 dark:bg-white/[0.01] border border-brand-slate/5 rounded-xl flex items-center justify-between text-left"
                            >
                              <div className="space-y-0.5 max-w-[75%] text-left">
                                <h5 className="font-display font-bold text-[11px] text-brand-charcoal leading-snug">
                                  {work.title}
                                </h5>
                                <p className="text-[9px] text-brand-muted flex items-center gap-1 justify-start">
                                  <Calendar className="w-3 h-3 text-brand-amber" />
                                  <span>{lang === 'en' ? "Published" : "Published"} {work.creationTime ? new Date(work.creationTime).toLocaleDateString() : 'N/A'}</span>
                                </p>
                              </div>
                              {work.alternateLink && (
                                <a
                                  href={work.alternateLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] font-bold text-brand-amber hover:underline shrink-0"
                                >
                                  {lang === 'en' ? "View" : "Kholen"}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* CHOOSE CLASS EMPTY STATE */
                <div className="h-full py-16 border-2 border-dashed border-brand-slate/10 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-brand-sand/5 dark:bg-white/[0.01]">
                  <GraduationCap className="w-12 h-12 text-brand-amber/30 mb-3" />
                  <h4 className="font-display font-bold text-sm text-brand-charcoal">
                    {lang === 'en' ? "Select a Google Classroom" : "Google Classroom Select Karein"}
                  </h4>
                  <p className="text-[11px] text-brand-muted max-w-sm mt-1 leading-relaxed">
                    {lang === 'en' 
                      ? "Choose an active course from the list on the left to start posting lesson resources, generating assignments, and managing your student stream."
                      : "Sabaq, announcements, aur challenges bheinjein ke liye left side par di gayi list se koi class select karein."}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
