import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Info } from 'lucide-react';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';

interface VisualizationProps {
  title: string;
  description: string;
  type: 'neural-network' | 'data-flow' | 'ml-pipeline' | 'transformer' | 'pattern-matching';
}

export default function InteractiveVisualization({
  title,
  description,
  type
}: VisualizationProps) {
  const { lang, t, dir } = useLanguageMultilingual();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Neural Network Visualization
  const NeuralNetworkViz = () => {
    const layers = [
      { name: 'Input', nodes: 5, color: '#1F2937' },
      { name: 'Hidden 1', nodes: 8, color: '#D97706' },
      { name: 'Hidden 2', nodes: 6, color: '#D97706' },
      { name: 'Output', nodes: 3, color: '#059669' }
    ];

    return (
      <div className="w-full h-80 flex items-center justify-center bg-gradient-to-r from-brand-slate/5 to-brand-amber/5 rounded-2xl p-8">
        <svg width="100%" height="100%" viewBox="0 0 800 300" className="max-w-2xl">
          {/* Draw layers */}
          {layers.map((layer, layerIdx) => {
            const x = (layerIdx + 1) * (800 / (layers.length + 1));
            return (
              <g key={`layer-${layerIdx}`}>
                {/* Layer label */}
                <text x={x} y="30" textAnchor="middle" className="text-xs fill-brand-charcoal font-bold">
                  {layer.name}
                </text>

                {/* Nodes */}
                {Array.from({ length: layer.nodes }).map((_, nodeIdx) => {
                  const y = (nodeIdx + 1) * (300 / (layer.nodes + 1));
                  const opacity = isPlaying ? 0.3 + 0.5 * Math.sin(Date.now() / 500 + layerIdx + nodeIdx) : 0.7;

                  return (
                    <motion.circle
                      key={`node-${layerIdx}-${nodeIdx}`}
                      cx={x}
                      cy={y}
                      r="8"
                      fill={layer.color}
                      opacity={opacity}
                      animate={isPlaying ? { r: [8, 12, 8] } : { r: 8 }}
                      transition={{ duration: 0.5 / speed, delay: (layerIdx + nodeIdx) * 0.05 }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Draw connections between layers */}
          {layers.map((_, layerIdx) => {
            if (layerIdx === 0) return null;
            const x1 = layerIdx * (800 / (layers.length + 1));
            const x2 = (layerIdx + 1) * (800 / (layers.length + 1));

            return (
              <g key={`connections-${layerIdx}`} opacity="0.2">
                {Array.from({ length: Math.min(layers[layerIdx].nodes, 3) }).map((_, idx) => {
                  const y1 = ((idx + 1) * (300 / (layers[layerIdx].nodes + 1)));
                  const y2 = ((idx + 1) * (300 / (layers[layerIdx + 1].nodes + 1)));

                  return (
                    <motion.line
                      key={`conn-${layerIdx}-${idx}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#D97706"
                      strokeWidth="1"
                      animate={isPlaying ? { opacity: [0.1, 0.4, 0.1] } : { opacity: 0.2 }}
                      transition={{ duration: 1 / speed, repeat: Infinity }}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Data Flow Visualization
  const DataFlowViz = () => {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-8">
        <div className="flex items-center justify-around w-full">
          {['Data', 'Processing', 'Features', 'Model', 'Prediction'].map((stage, idx) => (
            <motion.div
              key={`stage-${idx}`}
              className="flex flex-col items-center"
              animate={isPlaying ? { y: [0, -10, 0] } : {}}
              transition={{ duration: 1 / speed, delay: idx * 0.2, repeat: Infinity }}
            >
              <motion.div
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-amber to-brand-amber-dark text-white flex items-center justify-center font-bold shadow-lg"
                animate={isPlaying ? { rotate: [0, 5, 0] } : {}}
              >
                {idx + 1}
              </motion.div>
              <p className="text-xs font-bold text-brand-charcoal mt-2 text-center">{stage}</p>

              {idx < 4 && (
                <motion.svg
                  className="w-8 h-8 text-brand-amber mt-2"
                  viewBox="0 0 24 24"
                  animate={isPlaying ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 0.6 / speed, delay: idx * 0.2, repeat: Infinity }}
                >
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </motion.svg>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // ML Pipeline Visualization
  const MLPipelineViz = () => {
    const steps = [
      { label: 'Raw Data', icon: '📊', color: 'bg-blue-100 border-blue-300' },
      { label: 'Cleaning', icon: '🧹', color: 'bg-amber-100 border-amber-300' },
      { label: 'Preprocessing', icon: '⚙️', color: 'bg-purple-100 border-purple-300' },
      { label: 'Training', icon: '🎓', color: 'bg-emerald-100 border-emerald-300' },
      { label: 'Evaluation', icon: '📈', color: 'bg-rose-100 border-rose-300' }
    ];

    return (
      <div className="w-full space-y-6 p-8">
        {steps.map((step, idx) => (
          <motion.div
            key={`pipeline-${idx}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4"
          >
            <motion.div
              className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center text-3xl font-bold ${step.color} shrink-0`}
              animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.8 / speed, delay: idx * 0.15, repeat: Infinity }}
            >
              {step.icon}
            </motion.div>

            <div className="flex-grow">
              <h4 className="font-bold text-brand-charcoal mb-1">{step.label}</h4>
              <div className="h-2 bg-brand-sand rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-amber to-brand-amber-dark"
                  initial={{ width: '0%' }}
                  animate={isPlaying ? { width: '100%' } : { width: '0%' }}
                  transition={{ duration: 1.5 / speed, delay: idx * 0.2 }}
                />
              </div>
            </div>

            {idx < steps.length - 1 && (
              <motion.div
                className="text-2xl text-brand-amber font-bold"
                animate={isPlaying ? { x: [0, 3, 0] } : {}}
                transition={{ duration: 0.5 / speed, delay: idx * 0.2, repeat: Infinity }}
              >
                →
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  // Pattern Matching Visualization
  const PatternMatchingViz = () => {
    const patterns = [
      { name: 'Input', items: ['A', 'B', 'C', 'D', 'E'] },
      { name: 'Features', items: ['○', '◇', '□', '△', '☆'] },
      { name: 'Matching', items: ['✓', '✗', '✓', '✓', '✗'] }
    ];

    return (
      <div className="w-full space-y-8 p-8">
        {patterns.map((pattern, idx) => (
          <motion.div
            key={`pattern-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.2 }}
          >
            <p className="text-xs font-bold text-brand-charcoal mb-3 uppercase">{pattern.name}</p>
            <div className="flex gap-3 flex-wrap">
              {pattern.items.map((item, itemIdx) => (
                <motion.div
                  key={`item-${idx}-${itemIdx}`}
                  className="w-16 h-16 rounded-lg bg-white border-2 border-brand-amber flex items-center justify-center font-bold text-2xl"
                  animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6 / speed, delay: (idx * 0.2) + (itemIdx * 0.1), repeat: Infinity }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderVisualization = () => {
    switch (type) {
      case 'neural-network':
        return <NeuralNetworkViz />;
      case 'data-flow':
        return <DataFlowViz />;
      case 'ml-pipeline':
        return <MLPipelineViz />;
      case 'pattern-matching':
        return <PatternMatchingViz />;
      default:
        return <DataFlowViz />;
    }
  };

  return (
    <div className="bg-white border-2 border-brand-slate/10 rounded-3xl p-6 sm:p-8 skeuo-raised" dir={dir}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-grow">
          <h3 className="font-display text-2xl font-bold text-brand-charcoal mb-1">
            {title}
          </h3>
          <p className="text-sm text-brand-muted">
            {description}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-lg bg-brand-sand hover:bg-brand-sand-dark text-brand-charcoal transition-colors shrink-0"
        >
          <Info className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Visualization */}
      <div className="mb-6 rounded-2xl overflow-hidden">
        {renderVisualization()}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-brand-sand/30 rounded-xl border border-brand-slate/10">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-brand-amber hover:bg-brand-amber-dark text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(true)}
            className="p-2 rounded-lg bg-brand-slate/10 hover:bg-brand-slate/20 text-brand-charcoal transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-charcoal">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="px-2 py-1 rounded-lg bg-white border border-brand-slate/10 text-xs font-bold text-brand-charcoal"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </label>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled
                ? 'bg-brand-amber text-white'
                : 'bg-brand-slate/10 text-brand-charcoal'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
          >
            <p className="text-sm text-blue-900 leading-relaxed">
              {type === 'neural-network' && 'This visualization shows how a neural network processes information through multiple layers. Each circle represents a neuron, and connections show how data flows through the network.'}
              {type === 'data-flow' && 'Watch as data flows through each stage of a machine learning pipeline, from raw input to final predictions.'}
              {type === 'ml-pipeline' && 'A typical ML pipeline involves data cleaning, preprocessing, model training, and evaluation. Each step is crucial for success.'}
              {type === 'pattern-matching' && 'AI learns by identifying patterns in data. This shows how the system recognizes similar patterns across different inputs.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
