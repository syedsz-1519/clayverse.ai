import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LogOut,
  BarChart3,
  Users,
  BookOpen,
  Settings,
  Shield,
  TrendingUp,
  Activity,
  Download,
  Filter,
  Search,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ClayLogo from './ClayLogo';

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Students', value: '1,247', trend: '+12%', icon: Users },
    { label: 'Active Lessons', value: '48', trend: '+3', icon: BookOpen },
    { label: 'Avg. Completion Rate', value: '78%', trend: '+5%', icon: TrendingUp },
    { label: 'Platform Health', value: '99.8%', trend: 'Excellent', icon: Activity },
  ];

  const recentStudents = [
    { id: 1, name: 'Priya Sharma', email: 'priya@student.com', joined: '2 days ago', progress: 65 },
    { id: 2, name: 'Rahul Kumar', email: 'rahul@student.com', joined: '5 days ago', progress: 42 },
    { id: 3, name: 'Ananya Patel', email: 'ananya@student.com', joined: '1 week ago', progress: 88 },
    { id: 4, name: 'Vikram Singh', email: 'vikram@student.com', joined: '1 week ago', progress: 34 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700/50 backdrop-blur-md bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-black text-white">Admin Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
              <span className="text-sm text-slate-300">Logged as:</span>
              <span className="font-bold text-white">{user?.email}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all border border-red-500/30 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-slate-700">
          {[
            { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
            { id: 'users' as const, label: 'Students', icon: Users },
            { id: 'content' as const, label: 'Content', icon: BookOpen },
            { id: 'settings' as const, label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-red-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-red-500/10">
                        <Icon className="w-6 h-6 text-red-400" />
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{stat.trend}</span>
                    </div>
                    <p className="text-slate-400 text-sm font-semibold mb-2">{stat.label}</p>
                    <p className="text-4xl font-black text-white">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-400" />
                  Recent Student Activity
                </h3>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-slate-700/50 rounded-lg hover:bg-slate-700">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              <div className="space-y-3">
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50 flex items-center justify-between hover:bg-slate-700/50 transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-white">{student.name}</p>
                      <p className="text-sm text-slate-400">{student.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300 mb-2">{student.joined}</p>
                      <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{student.progress}% complete</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all font-semibold">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-4 font-bold text-slate-300 text-sm">Name</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-300 text-sm">Email</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-300 text-sm">Joined</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-300 text-sm">Progress</th>
                    <th className="text-left py-4 px-4 font-bold text-slate-300 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
                    <tr key={student.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-all">
                      <td className="py-4 px-4 text-white font-semibold">{student.name}</td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{student.email}</td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{student.joined}</td>
                      <td className="py-4 px-4">
                        <div className="w-32 h-2 bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Content Management</h3>
            <p className="text-slate-400 mb-6">Manage lessons, courses, and learning materials</p>
            <button className="px-6 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-all">
              Manage Content
            </button>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 text-center py-16">
            <Settings className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Platform Settings</h3>
            <p className="text-slate-400 mb-6">Configure system preferences and integrations</p>
            <button className="px-6 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-all">
              Open Settings
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
