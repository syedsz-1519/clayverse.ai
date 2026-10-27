import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Zap,
  Award,
  Globe,
  Users,
  Sparkles,
  CheckCircle,
  Play,
  Volume2,
} from 'lucide-react';
import ClayLogo from './ClayLogo';
import AnimatedClayMascot from './AnimatedClayMascot';
import Button from './ui/Button';

interface LandingPageProps {
  onStudentLogin: () => void;
  onAdminLogin: () => void;
}

export default function LandingPage({ onStudentLogin, onAdminLogin }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'accessible',
      icon: Globe,
      title: 'Accessible to All',
      description: 'Learn AI in 25+ Indian languages. No prerequisites needed.',
    },
    {
      id: 'interactive',
      icon: Sparkles,
      title: 'Interactive Learning',
      description: 'Engage with Clay, quiz yourself, and practice with real-world scenarios.',
    },
    {
      id: 'progressive',
      icon: TrendingUp,
      title: 'Progressive Mastery',
      description: 'From "What is AI?" to advanced concepts at your own pace.',
    },
    {
      id: 'community',
      icon: Users,
      title: 'Community & Support',
      description: 'Learn with peers, share insights, and grow together.',
    },
  ];

  const stats = [
    { label: 'Students Learning', value: '10K+' },
    { label: 'Languages Supported', value: '25+' },
    { label: 'Lessons Available', value: '50+' },
    { label: 'Satisfaction Rate', value: '98%' },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClayLogo />
            <span className="text-xl font-bold text-slate-900">Clayverse AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onStudentLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Student Login
            </button>
            <button
              onClick={onAdminLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Clay Mascot */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                The Future of AI Education Starts Here
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 leading-tight"
            >
              Learn{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
              <br />
              The Intuitive Way
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            >
              Master AI, Machine Learning, Neural Networks, and Transformers through warm, tactile, stop-motion learning experiences. No math jargon. No prerequisites. Just intuitive understanding.
            </motion.p>

            {/* Animated Clay Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="py-8"
            >
              <AnimatedClayMascot size={200} autoPlay={false} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={onStudentLogin}
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Start Learning as Student
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onAdminLogin}
                className="flex items-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all"
              >
                <Award className="w-5 h-5" />
                Admin Dashboard
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>100% Free Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Learn at Your Pace</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Expert Curated</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-slate-600 font-semibold mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Why Choose Clayverse AI?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've reimagined AI education from the ground up. Here's what makes us different.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-2 gap-8"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  variants={item}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="group p-8 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-16"
          >
            How Clayverse AI Works
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                title: 'Choose Your Role',
                description: 'Select whether you want to learn as a student or manage as an admin.',
              },
              {
                step: '02',
                title: 'Start Learning',
                description: 'Access 50+ lessons in your preferred language with interactive content.',
              },
              {
                step: '03',
                title: 'Master AI Concepts',
                description: 'Progress through modules, practice with AI, and earn achievements.',
              },
            ].map((step) => (
              <motion.div
                key={step.step}
                variants={item}
                className="relative"
              >
                <div className="absolute -top-6 left-0 text-6xl font-black text-white/10">
                  {step.step}
                </div>
                <div className="relative z-10 space-y-3">
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900"
          >
            Ready to Master AI?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, delay: 0.1 }}
            className="text-xl text-slate-600"
          >
            Join thousands of students already learning AI the intuitive way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onStudentLogin}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onAdminLogin}
              className="flex items-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all"
            >
              <Award className="w-5 h-5" />
              Admin Access
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto text-center text-slate-600 text-sm">
          <p>
            © 2026 Clayverse AI. Reimagining AI education for everyone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// TrendingUp Icon component
function TrendingUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
