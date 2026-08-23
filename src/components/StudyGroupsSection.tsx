import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Clock, 
  UserPlus, 
  UserMinus, 
  Send, 
  Check, 
  Search, 
  Filter, 
  BookOpen, 
  ArrowRight,
  Shield,
  Layers,
  X,
  Share2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { 
  UserProfile, 
  StudyGroup, 
  StudyGroupMessage,
  fetchStudyGroups, 
  createStudyGroupCloud, 
  joinStudyGroupCloud, 
  leaveStudyGroupCloud, 
  getStudyGroupMessages, 
  postStudyGroupMessage 
} from '../lib/firebase';
import { AI_CURRICULUM_CONCEPTS } from './StudentDashboard';

interface StudyGroupsSectionProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSelectTopic?: (topicId: string) => void;
}

export default function StudyGroupsSection({
  currentUser,
  onOpenAuth,
  onSelectTopic
}: StudyGroupsSectionProps) {
  const { lang } = useLanguage();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGroupChat, setActiveGroupChat] = useState<StudyGroup | null>(null);
  const [chatMessages, setChatMessages] = useState<StudyGroupMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTopicId, setNewGroupTopicId] = useState('c1');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupMeetingTime, setNewGroupMeetingTime] = useState('Wednesdays • 6:00 PM IST');
  const [newGroupMaxMembers, setNewGroupMaxMembers] = useState(15);

  // Load groups
  const loadGroups = async () => {
    setIsLoading(true);
    const data = await fetchStudyGroups();
    setGroups(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadGroups();
    const handleUpdate = () => loadGroups();
    window.addEventListener('clay_study_groups_updated', handleUpdate);
    return () => window.removeEventListener('clay_study_groups_updated', handleUpdate);
  }, []);

  // Update chat when active group is selected
  useEffect(() => {
    if (activeGroupChat) {
      setChatMessages(getStudyGroupMessages(activeGroupChat.id));
      const handleChatUpdate = () => {
        setChatMessages(getStudyGroupMessages(activeGroupChat.id));
      };
      window.addEventListener(`clay_group_chat_${activeGroupChat.id}`, handleChatUpdate);
      return () => window.removeEventListener(`clay_group_chat_${activeGroupChat.id}`, handleChatUpdate);
    }
  }, [activeGroupChat]);

  const categories = ['All', 'Foundations', 'GenAI', 'ML Types', 'Deep Learning', 'Prompting', 'Optimization', 'Production'];

  const filteredGroups = groups.filter(g => {
    const matchesCat = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleJoin = async (group: StudyGroup) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    try {
      await joinStudyGroupCloud(group.id, currentUser);
      loadGroups();
      if (activeGroupChat?.id === group.id) {
        setActiveGroupChat({
          ...group,
          members: [...group.members, {
            uid: currentUser.uid,
            name: currentUser.fullName || 'Scholar',
            avatar: currentUser.avatar,
            role: 'member',
            joinedAt: new Date().toISOString().split('T')[0]
          }]
        });
      }
    } catch (e: any) {
      alert(e.message || 'Failed to join group');
    }
  };

  const handleLeave = async (group: StudyGroup) => {
    if (!currentUser) return;
    try {
      await leaveStudyGroupCloud(group.id, currentUser.uid);
      loadGroups();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeGroupChat) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    postStudyGroupMessage(activeGroupChat.id, currentUser, messageInput.trim());
    setMessageInput('');
    setChatMessages(getStudyGroupMessages(activeGroupChat.id));
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupDesc.trim()) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const matchedTopic = AI_CURRICULUM_CONCEPTS.find(c => c.id === newGroupTopicId) || AI_CURRICULUM_CONCEPTS[0];

    await createStudyGroupCloud({
      name: newGroupName.trim(),
      topicId: matchedTopic.id,
      topicTitle: matchedTopic.title,
      category: matchedTopic.category,
      level: matchedTopic.level as any,
      description: newGroupDesc.trim(),
      createdBy: currentUser.uid,
      createdByName: currentUser.fullName || currentUser.email || 'Scholar Leader',
      meetingTime: newGroupMeetingTime,
      maxMembers: newGroupMaxMembers,
      tags: [matchedTopic.category, matchedTopic.level, 'Peer Learning'],
      members: [
        {
          uid: currentUser.uid,
          name: currentUser.fullName || 'Scholar Leader',
          avatar: currentUser.avatar,
          role: 'leader',
          joinedAt: new Date().toISOString().split('T')[0]
        }
      ]
    });

    setIsCreateModalOpen(false);
    setNewGroupName('');
    setNewGroupDesc('');
    loadGroups();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-gradient-to-r from-amber-500/10 via-brand-sand/50 to-orange-500/10 border border-amber-500/25 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-mono font-black">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'en' ? "PEER LEARNING COHORTS • FIRESTORE SYNCED" : "HUM-SABAQ GROUPS • CLOUD SYNCED"}</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-brand-charcoal">
            {lang === 'en' ? "Curriculum Study Groups & Discussion Circles" : "AI Sathi Study Groups aur Discussion"}
          </h3>
          <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
            {lang === 'en'
              ? "Connect with fellow learners tackling the same AI topics. Share flashcards, discuss interview questions, and join live scheduled study circles."
              : "Apne saath AI seekhne wale doston se juden, interview questions discuss karein aur live study groups me hissa lein."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 z-10 w-full sm:w-auto">
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                setIsCreateModalOpen(true);
              }
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-mono text-xs font-black tracking-wider transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? "CREATE STUDY GROUP" : "NAYA GROUP BANAO"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-brand-charcoal font-black shadow-xs'
                  : 'bg-white/80 hover:bg-brand-sand text-brand-slate border border-brand-slate/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? "Search study groups..." : "Groups dhoondein..."}
            className="w-full pl-9 pr-4 py-2 bg-white text-brand-charcoal placeholder-brand-muted rounded-xl border border-brand-slate/20 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroups.map(group => {
          const isMember = currentUser ? group.members.some(m => m.uid === currentUser.uid) : false;
          const isFull = group.members.length >= group.maxMembers;

          return (
            <div
              key={group.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                isMember 
                  ? 'bg-amber-500/5 border-amber-500/30 shadow-xs' 
                  : 'bg-white/90 border-brand-slate/15 hover:border-brand-slate/30'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {group.category}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-brand-muted">
                        • {group.level}
                      </span>
                    </div>
                    <h4 className="font-display font-black text-base text-brand-charcoal leading-snug">
                      {group.name}
                    </h4>
                  </div>
                  
                  {isMember && (
                    <span className="shrink-0 text-[10px] font-mono font-black text-emerald-800 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>JOINED</span>
                    </span>
                  )}
                </div>

                {/* Topic & Description */}
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-slate mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{group.topicTitle}</span>
                  </div>
                  <p className="text-xs text-brand-slate leading-relaxed line-clamp-2 font-sans">
                    {group.description}
                  </p>
                </div>

                {/* Schedule info */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-brand-muted mb-4 bg-brand-sand/30 px-3 py-1.5 rounded-xl">
                  <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{group.meetingTime}</span>
                </div>

                {/* Members Avatars List */}
                <div className="flex items-center justify-between gap-2 border-t border-brand-slate/10 pt-3 mb-4">
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {group.members.slice(0, 5).map((member, i) => (
                      <img
                        key={member.uid || i}
                        src={member.avatar}
                        alt={member.name}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-100"
                        title={member.name}
                      />
                    ))}
                    {group.members.length > 5 && (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-sand text-[10px] font-mono font-black ring-2 ring-white">
                        +{group.members.length - 5}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-brand-muted">
                    {group.members.length} / {group.maxMembers} Learners
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {isMember ? (
                  <>
                    <button
                      onClick={() => setActiveGroupChat(group)}
                      className="flex-1 py-2 px-3 rounded-xl bg-brand-charcoal text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-brand-charcoal/90"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'en' ? "Group Discussion" : "Baat Cheet"}</span>
                    </button>
                    <button
                      onClick={() => handleLeave(group)}
                      className="py-2 px-3 rounded-xl bg-brand-sand/80 hover:bg-red-50 text-brand-muted hover:text-red-600 text-xs font-mono font-bold transition-colors cursor-pointer"
                      title="Leave Group"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleJoin(group)}
                      disabled={isFull}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isFull 
                          ? 'bg-brand-slate/20 text-brand-muted cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-600 text-brand-charcoal'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isFull ? "Group Full" : (lang === 'en' ? "Join Study Group" : "Group Join Karein")}</span>
                    </button>
                    <button
                      onClick={() => setActiveGroupChat(group)}
                      className="py-2 px-3 rounded-xl bg-brand-sand/80 hover:bg-brand-sand text-brand-slate text-xs font-mono font-bold cursor-pointer"
                      title="Preview Discussion Board"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Discussion Chat Modal / Drawer */}
      <AnimatePresence>
        {activeGroupChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-brand-slate/20 overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-4 sm:p-5 border-b border-brand-slate/10 flex items-center justify-between bg-brand-sand/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-amber-900 rounded-2xl">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base text-brand-charcoal">
                      {activeGroupChat.name}
                    </h3>
                    <p className="text-[11px] font-mono text-brand-muted">
                      {activeGroupChat.topicTitle} • {activeGroupChat.members.length} Members
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveGroupChat(null)}
                  className="p-1.5 rounded-full hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[420px] bg-slate-50/50">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-brand-muted text-xs font-mono">
                    No messages yet. Be the first to start the discussion!
                  </div>
                ) : (
                  chatMessages.map(msg => {
                    const isMe = currentUser?.uid === msg.senderUid;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-7 h-7 rounded-full bg-amber-100 shrink-0"
                        />
                        <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="text-[10px] font-mono font-bold text-brand-slate">
                              {msg.senderName}
                            </span>
                            <span className="text-[9px] font-mono text-brand-muted">
                              {msg.timestamp}
                            </span>
                          </div>
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                              isMe
                                ? 'bg-brand-charcoal text-white rounded-tr-xs'
                                : 'bg-white border border-brand-slate/15 text-brand-charcoal rounded-tl-xs shadow-2xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Send Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-brand-slate/10 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    currentUser 
                      ? (lang === 'en' ? "Type your discussion question or insight..." : "Apna sawaal ya raye likhein...") 
                      : "Please sign in to participate in the chat"
                  }
                  disabled={!currentUser}
                  className="flex-1 px-4 py-2.5 bg-brand-sand/30 border border-brand-slate/20 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || !currentUser}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-brand-charcoal cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-brand-slate/20"
            >
              <div className="flex items-center justify-between mb-5 border-b border-brand-slate/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/20 text-amber-900 rounded-xl">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-black text-lg text-brand-charcoal">
                    {lang === 'en' ? "Create AI Study Group" : "Naya Study Group Banayein"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-brand-sand text-brand-slate cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-brand-charcoal mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g., Transformers & Attention Circle"
                    className="w-full px-3.5 py-2.5 bg-brand-sand/20 border border-brand-slate/20 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-brand-charcoal mb-1">
                    Curriculum Topic
                  </label>
                  <select
                    value={newGroupTopicId}
                    onChange={(e) => setNewGroupTopicId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-brand-sand/20 border border-brand-slate/20 rounded-xl text-xs font-mono font-bold focus:outline-none cursor-pointer"
                  >
                    {AI_CURRICULUM_CONCEPTS.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.category} • {c.title} ({c.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-brand-charcoal mb-1">
                    Description & Objectives
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="What will members explore together in this study cohort?"
                    className="w-full px-3.5 py-2.5 bg-brand-sand/20 border border-brand-slate/20 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-brand-charcoal mb-1">
                      Meeting Cadence
                    </label>
                    <input
                      type="text"
                      value={newGroupMeetingTime}
                      onChange={(e) => setNewGroupMeetingTime(e.target.value)}
                      placeholder="e.g. Saturdays • 5:00 PM"
                      className="w-full px-3.5 py-2 bg-brand-sand/20 border border-brand-slate/20 rounded-xl text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-brand-charcoal mb-1">
                      Max Members
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={30}
                      value={newGroupMaxMembers}
                      onChange={(e) => setNewGroupMaxMembers(parseInt(e.target.value) || 15)}
                      className="w-full px-3.5 py-2 bg-brand-sand/20 border border-brand-slate/20 rounded-xl text-xs font-sans"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-brand-slate/10">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-brand-slate hover:bg-brand-sand cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-brand-charcoal font-mono text-xs font-black tracking-wider cursor-pointer shadow-xs"
                  >
                    CREATE GROUP
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
