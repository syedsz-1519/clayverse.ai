import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, ZoomIn, ZoomOut, RotateCcw, BookOpen, Network, Layers } from 'lucide-react';
import {
  learningMindMap,
  getMindMapNode,
  getChildNodes,
  MindMapNode,
  Resource,
} from '../data/resourcesData';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import ResourceModal from './ResourceModal';

interface MindMapLearningProps {
  initialFocusId?: string;
}

export default function MindMapLearning({ initialFocusId = 'root' }: MindMapLearningProps) {
  const { lang, t, dir } = useLanguageMultilingual();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [focusedNodeId, setFocusedNodeId] = useState(initialFocusId);
  const [zoom, setZoom] = useState(1);
  const [selectedResourceNode, setSelectedResourceNode] = useState<{ title: string; resources: Resource[] } | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([initialFocusId]));

  const focusedNode = getMindMapNode(focusedNodeId);
  const childNodes = focusedNode ? getChildNodes(focusedNodeId) : [];

  const toggleNodeExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeClick = (nodeId: string) => {
    setFocusedNodeId(nodeId);
    setExpandedNodes(new Set([nodeId]));
  };

  const handleResourceClick = (node: MindMapNode) => {
    if (node.resources && node.resources.length > 0) {
      setSelectedResourceNode({
        title: node.label,
        resources: node.resources
      });
    }
  };

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-brand-amber/10 border-brand-amber/40 text-brand-amber',
      'bg-brand-slate/5 border-brand-slate/20 text-brand-charcoal',
      'bg-emerald-50/50 border-emerald-200/40 text-emerald-700',
      'bg-cyan-50/50 border-cyan-200/40 text-cyan-700',
      'bg-purple-50/50 border-purple-200/40 text-purple-700',
    ];
    return colors[level % colors.length];
  };

  const getLevelIcon = (level: number) => {
    const icons = [Network, Layers, BookOpen, Menu, RotateCcw];
    const Icon = icons[level % icons.length];
    return Icon;
  };

  return (
    <div id="mindmap-learning" className="scroll-mt-16 bg-white py-16 relative overflow-hidden" dir={dir}>
      {/* Background decoration */}
      <div className="absolute top-1/2 -left-96 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-96 w-96 h-96 bg-brand-slate/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-sand border border-brand-slate/10 rounded-full text-xs font-mono font-bold text-brand-slate mb-3">
            <Network className="w-3.5 h-3.5 text-brand-amber" />
            {lang === 'en' ? 'Interactive Mind Map' : 'इंटरैक्टिव माइंड मैप'}
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-brand-charcoal mb-3">
            {lang === 'en' ? 'AI Learning Journey' : 'AI सीखने का सफर'}
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            {lang === 'en'
              ? 'Explore the complete AI ecosystem. Click on nodes to learn more and access YouTube videos, articles, and courses.'
              : 'पूरे AI पारिस्थितिकी तंत्र का अन्वेषण करें। अधिक जानने के लिए नोड्स पर क्लिक करें और YouTube वीडियो, लेख और कोर्स तक पहुंचें।'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
            className="px-4 py-2 bg-brand-sand hover:bg-brand-sand-dark text-brand-charcoal font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <ZoomIn className="w-4 h-4" />
            {lang === 'en' ? 'Zoom In' : 'बड़ा करें'}
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
            className="px-4 py-2 bg-brand-sand hover:bg-brand-sand-dark text-brand-charcoal font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <ZoomOut className="w-4 h-4" />
            {lang === 'en' ? 'Zoom Out' : 'छोटा करें'}
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setFocusedNodeId('root');
              setExpandedNodes(new Set(['root']));
            }}
            className="px-4 py-2 bg-brand-amber hover:bg-brand-amber-dark text-white font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {lang === 'en' ? 'Reset' : 'रीसेट'}
          </button>
        </div>

        {/* Mind Map Visualization */}
        <div
          ref={canvasRef}
          className="bg-gradient-to-br from-[#FAFAF9] to-[#F5F2ED] border-2 border-brand-slate/10 rounded-3xl p-8 overflow-auto max-h-[700px] skeuo-raised"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="min-w-max">
            {/* Root Node */}
            <div className="flex justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleNodeClick(focusedNode?.id || 'root')}
                className={`relative px-8 py-4 rounded-2xl font-display font-extrabold text-lg border-3 transition-all shadow-lg ${getLevelColor(0)} ${
                  focusedNodeId === focusedNode?.id ? 'ring-4 ring-brand-amber/50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  {focusedNode?.label || 'AI Learning'}
                </div>
              </motion.button>
            </div>

            {/* Connection Lines SVG */}
            {childNodes.length > 0 && (
              <svg className="absolute left-0 top-32 w-full h-64 pointer-events-none">
                {childNodes.map((child, idx) => (
                  <line
                    key={`line-${child.id}`}
                    x1="50%"
                    y1="0"
                    x2={`${((idx + 1) / (childNodes.length + 1)) * 100}%`}
                    y2="120"
                    stroke="#D97706"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.3"
                  />
                ))}
              </svg>
            )}

            {/* Child Nodes */}
            <div className="flex flex-wrap justify-center gap-8 mb-8 relative">
              {childNodes.map((child, idx) => {
                const isExpanded = expandedNodes.has(child.id);
                const hasChildren = getChildNodes(child.id).length > 0;
                const Icon = getLevelIcon(child.level);

                return (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNodeClick(child.id)}
                      className={`relative px-6 py-3 rounded-xl font-bold text-sm border-2 transition-all shadow-md ${getLevelColor(
                        child.level
                      )} ${focusedNodeId === child.id ? 'ring-4 ring-brand-amber/50 shadow-lg' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{child.label}</span>
                      </div>

                      {/* Resource Badge */}
                      {child.resources && child.resources.length > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResourceClick(child);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-amber text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-md hover:bg-brand-amber-dark transition-colors"
                          title={`${child.resources.length} resources`}
                        >
                          {child.resources.length}
                        </motion.button>
                      )}

                      {/* Expand Icon */}
                      {hasChildren && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                        >
                          <ChevronDown className="w-4 h-4 text-brand-amber" />
                        </motion.div>
                      )}
                    </motion.button>

                    {/* Nested Children */}
                    <AnimatePresence>
                      {isExpanded && hasChildren && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-wrap justify-center gap-4 mt-10 pt-8 border-t-2 border-brand-amber/20"
                        >
                          {getChildNodes(child.id).map((grandChild) => (
                            <motion.button
                              key={grandChild.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleNodeClick(grandChild.id)}
                              className={`px-4 py-2 rounded-lg font-bold text-xs border-2 transition-all ${getLevelColor(
                                grandChild.level
                              )} ${focusedNodeId === grandChild.id ? 'ring-4 ring-brand-amber/50' : ''}`}
                            >
                              <div className="flex items-center gap-1.5">
                                {grandChild.resources && grandChild.resources.length > 0 && (
                                  <motion.span
                                    whileHover={{ scale: 1.2 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResourceClick(grandChild);
                                    }}
                                    className="w-5 h-5 rounded-full bg-brand-amber text-white flex items-center justify-center text-[10px] font-bold hover:bg-brand-amber-dark transition-colors cursor-pointer"
                                  >
                                    {grandChild.resources.length}
                                  </motion.span>
                                )}
                                <span>{grandChild.label}</span>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom description */}
            {focusedNode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 p-6 bg-white border-2 border-brand-slate/10 rounded-2xl max-w-2xl mx-auto"
              >
                <p className="text-sm text-brand-charcoal leading-relaxed mb-3">
                  <strong className="text-brand-amber">{focusedNode.label}:</strong> {focusedNode.description}
                </p>
                {focusedNode.resources && focusedNode.resources.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResourceClick(focusedNode)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-amber hover:bg-brand-amber-dark text-white font-bold rounded-lg transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    {lang === 'en' ? `Learn More (${focusedNode.resources.length} resources)` : `अधिक जानें (${focusedNode.resources.length} संसाधन)`}
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 p-6 bg-brand-sand/30 border-2 border-brand-slate/10 rounded-2xl">
          <p className="text-xs font-mono font-bold text-brand-muted uppercase mb-4">Legend</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-amber/10 border-2 border-brand-amber/40" />
              <span className="text-xs font-bold text-brand-charcoal">{lang === 'en' ? 'Root Concept' : 'मुख्य अवधारणा'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-8 bg-brand-amber rounded" />
              <span className="text-xs font-bold text-brand-charcoal">{lang === 'en' ? 'Connections' : 'जुड़ाव'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-amber text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-xs font-bold text-brand-charcoal">{lang === 'en' ? 'Resources' : 'संसाधन'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4 text-brand-amber" />
              <span className="text-xs font-bold text-brand-charcoal">{lang === 'en' ? 'Expand' : 'विस्तार'}</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">💡 {lang === 'en' ? 'How to Use' : 'कैसे उपयोग करें'}</p>
            <ul className="text-sm text-emerald-900 space-y-1">
              <li>✓ {lang === 'en' ? 'Click nodes to explore different AI concepts' : 'विभिन्न अवधारणाओं का पता लगाने के लिए नोड्स पर क्लिक करें'}</li>
              <li>✓ {lang === 'en' ? 'Click the number badge to access resources' : 'संसाधनों तक पहुंचने के लिए संख्या बैज पर क्लिक करें'}</li>
              <li>✓ {lang === 'en' ? 'Use zoom controls for better visibility' : 'बेहतर दृश्यता के लिए ज़ूम नियंत्रण का उपयोग करें'}</li>
            </ul>
          </div>

          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">🎓 {lang === 'en' ? 'Learning Path' : 'सीखने का पथ'}</p>
            <ol className="text-sm text-blue-900 space-y-1">
              <li>1. {lang === 'en' ? 'Start with "What is AI?" to understand basics' : 'मूलभूत बातों को समझने के लिए "AI क्या है?" से शुरू करें'}</li>
              <li>2. {lang === 'en' ? 'Explore the AI Family Tree hierarchy' : 'AI परिवार वृक्ष पदानुक्रम का अन्वेषण करें'}</li>
              <li>3. {lang === 'en' ? 'Deep dive into specific concepts' : 'विशिष्ट अवधारणाओं में गहराई से जाएं'}</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Resource Modal */}
      <ResourceModal
        isOpen={!!selectedResourceNode}
        onClose={() => setSelectedResourceNode(null)}
        title={selectedResourceNode?.title || ''}
        resources={selectedResourceNode?.resources || []}
        description={getMindMapNode(focusedNodeId)?.description}
      />
    </div>
  );
}
