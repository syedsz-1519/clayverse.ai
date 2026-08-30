import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'motion/react';
import {
  GripVertical,
  LayoutGrid,
  RotateCcw,
  Sparkles,
  Check,
  Move,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  Layers,
  Brain,
  Award,
  BarChart3,
  Flame,
  Wifi,
  History,
  Compass,
  ArrowUpDown
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';

export type BentoTileId =
  | 'recommendations'
  | 'streak'
  | 'learning-path'
  | 'analytics'
  | 'milestones'
  | 'offline-tools'
  | 'interview-history';

export interface BentoTileDefinition {
  id: BentoTileId;
  titleEn: string;
  titleUr: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultSpan: 'full' | 'half' | 'two-thirds' | 'one-third';
  descriptionEn: string;
  descriptionUr: string;
}

export const BENTO_TILES_CONFIG: Record<BentoTileId, BentoTileDefinition> = {
  recommendations: {
    id: 'recommendations',
    titleEn: 'Recommended Next Lesson',
    titleUr: 'Agla Tajweez Karda Sabaq',
    icon: Compass,
    defaultSpan: 'two-thirds',
    descriptionEn: 'Priority guidance on the next curriculum milestone to conquer.',
    descriptionUr: 'Agla sabaq shuru karne ki rahnumai.'
  },
  streak: {
    id: 'streak',
    titleEn: 'Consistency Pulse & Streak',
    titleUr: 'Daily Streak aur Consistency',
    icon: Flame,
    defaultSpan: 'one-third',
    descriptionEn: '7-day learning activity tracker, streak milestones, and check-in.',
    descriptionUr: 'Rozana sabaq mukammal karne ka streak tracker.'
  },
  'learning-path': {
    id: 'learning-path',
    titleEn: 'AI Concept Dependency Map',
    titleUr: 'AI Concept Shijra aur Map',
    icon: Brain,
    defaultSpan: 'full',
    descriptionEn: 'Interactive DAG knowledge graph with locked & unlocked nodes.',
    descriptionUr: 'Concepts ka aapas mein jura hua visual graph.'
  },
  analytics: {
    id: 'analytics',
    titleEn: 'Performance Visualizer & Charts',
    titleUr: 'Performance aur Quiz Analytics',
    icon: BarChart3,
    defaultSpan: 'full',
    descriptionEn: 'Recharts interactive analytics for scores, curriculum time, and accuracy.',
    descriptionUr: 'Quizzes aur sabaq ki progress ke visual charts.'
  },
  milestones: {
    id: 'milestones',
    titleEn: 'Learning Milestones & Badges',
    titleUr: 'Achievements aur Inamat',
    icon: Award,
    defaultSpan: 'full',
    descriptionEn: 'Tiered milestone unlocks, XP rewards, and celebratory badges.',
    descriptionUr: 'Mukammal kiye gaye asbaaq ke badges aur inamat.'
  },
  'offline-tools': {
    id: 'offline-tools',
    titleEn: 'Offline Hub, Notes & Weekly Digest',
    titleUr: 'Offline Hub aur Notes Exporter',
    icon: Wifi,
    defaultSpan: 'full',
    descriptionEn: 'Offline curriculum cache, notes exporter, and automated weekly digests.',
    descriptionUr: 'Offline parhai, notes export aur weekly email.'
  },
  'interview-history': {
    id: 'interview-history',
    titleEn: 'Mock Interview History & Radar',
    titleUr: 'Mock Interview Record aur Radar',
    icon: History,
    defaultSpan: 'full',
    descriptionEn: 'Round-by-round interview scores, camera gaze tracking, and AI feedback.',
    descriptionUr: 'Interview ki practice aur feedback ka record.'
  }
};

export const DEFAULT_BENTO_LAYOUT: BentoTileId[] = [
  'recommendations',
  'streak',
  'learning-path',
  'analytics',
  'milestones',
  'offline-tools',
  'interview-history'
];

export const LAYOUT_PRESETS: {
  id: string;
  nameEn: string;
  nameUr: string;
  order: BentoTileId[];
}[] = [
  {
    id: 'default',
    nameEn: 'Balanced Standard',
    nameUr: 'Standard Layout',
    order: DEFAULT_BENTO_LAYOUT
  },
  {
    id: 'learning-path-first',
    nameEn: 'Knowledge Path First 🗺️',
    nameUr: 'Knowledge Map Pehle 🗺️',
    order: [
      'learning-path',
      'recommendations',
      'streak',
      'milestones',
      'analytics',
      'offline-tools',
      'interview-history'
    ]
  },
  {
    id: 'analytics-first',
    nameEn: 'Analytics & Charts First 📊',
    nameUr: 'Charts & Scores Pehle 📊',
    order: [
      'analytics',
      'milestones',
      'learning-path',
      'recommendations',
      'streak',
      'interview-history',
      'offline-tools'
    ]
  },
  {
    id: 'interview-first',
    nameEn: 'Interview Prep First 🎯',
    nameUr: 'Interview Practice Pehle 🎯',
    order: [
      'interview-history',
      'analytics',
      'recommendations',
      'streak',
      'learning-path',
      'milestones',
      'offline-tools'
    ]
  }
];

interface SortableBentoTileProps {
  id: BentoTileId;
  isCustomizeMode: boolean;
  children: React.ReactNode;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function SortableBentoTile({
  id,
  isCustomizeMode,
  children,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}: SortableBentoTileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : 'auto',
    opacity: isDragging ? 0.35 : 1
  };

  const tileConfig = BENTO_TILES_CONFIG[id];
  const IconComponent = tileConfig?.icon || Layers;

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`bento-tile-${id}`}
      className={`relative transition-shadow duration-200 ${
        isCustomizeMode
          ? 'p-2 rounded-3xl border-2 border-dashed border-indigo-400/80 bg-indigo-50/20 shadow-sm'
          : ''
      }`}
    >
      {/* Customize Mode Drag Header Bar */}
      {isCustomizeMode && (
        <div className="flex items-center justify-between gap-2 p-2.5 mb-2 rounded-2xl bg-indigo-600 text-white shadow-sm select-none">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center gap-2 cursor-grab active:cursor-grabbing flex-1 hover:opacity-90"
            title="Click and drag to rearrange this component"
          >
            <GripVertical className="w-4 h-4 text-indigo-200 shrink-0" />
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold truncate">
              <IconComponent className="w-3.5 h-3.5 text-amber-300" />
              <span>{tileConfig?.titleEn || id}</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-200 uppercase px-1.5 py-0.5 rounded bg-indigo-700/60 hidden sm:inline">
              Drag to reorder
            </span>
          </div>

          {/* Quick manual directional buttons for accessibility */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              disabled={isFirst}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="p-1 rounded-lg bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white transition-all cursor-pointer"
              title="Move component up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="p-1 rounded-lg bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white transition-all cursor-pointer"
              title="Move component down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Render the actual component */}
      <div>{children}</div>
    </div>
  );
}

interface BentoDashboardDndGridProps {
  renderTileContent: (tileId: BentoTileId) => React.ReactNode;
  className?: string;
}

export default function BentoDashboardDndGrid({
  renderTileContent,
  className = ''
}: BentoDashboardDndGridProps) {
  const { lang } = useLanguage();
  const [tileOrder, setTileOrder] = useState<BentoTileId[]>(DEFAULT_BENTO_LAYOUT);
  const [isCustomizeMode, setIsCustomizeMode] = useState<boolean>(false);
  const [activeDragId, setActiveDragId] = useState<BentoTileId | null>(null);
  const [activePreset, setActivePreset] = useState<string>('default');
  const [savedToast, setSavedToast] = useState<boolean>(false);

  // Load layout from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('clay_dashboard_bento_layout_order_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure all current tiles are present
          const validSet = new Set(DEFAULT_BENTO_LAYOUT);
          const cleaned = parsed.filter((id: any) => validSet.has(id));
          DEFAULT_BENTO_LAYOUT.forEach(id => {
            if (!cleaned.includes(id)) cleaned.push(id);
          });
          setTileOrder(cleaned);
        }
      }
    } catch {}
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    audioEngine.playLoFiChord();
    setActiveDragId(event.active.id as BentoTileId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && active.id !== over.id) {
      audioEngine.playLoFiChord();
      setTileOrder(prev => {
        const oldIndex = prev.indexOf(active.id as BentoTileId);
        const newIndex = prev.indexOf(over.id as BentoTileId);
        const updated = arrayMove(prev, oldIndex, newIndex);
        try {
          localStorage.setItem('clay_dashboard_bento_layout_order_v2', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setActivePreset('custom');
      showSavedToast();
    }
  };

  const showSavedToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = LAYOUT_PRESETS.find(p => p.id === presetId);
    if (preset) {
      audioEngine.playLoFiChord();
      setTileOrder(preset.order);
      setActivePreset(preset.id);
      try {
        localStorage.setItem('clay_dashboard_bento_layout_order_v2', JSON.stringify(preset.order));
      } catch {}
      showSavedToast();
    }
  };

  const handleResetDefault = () => {
    audioEngine.playLoFiChord();
    setTileOrder(DEFAULT_BENTO_LAYOUT);
    setActivePreset('default');
    try {
      localStorage.setItem('clay_dashboard_bento_layout_order_v2', JSON.stringify(DEFAULT_BENTO_LAYOUT));
    } catch {}
    showSavedToast();
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    audioEngine.playLoFiChord();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tileOrder.length) return;

    setTileOrder(prev => {
      const updated = arrayMove(prev, index, newIndex);
      try {
        localStorage.setItem('clay_dashboard_bento_layout_order_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setActivePreset('custom');
    showSavedToast();
  };

  return (
    <div className={`space-y-5 ${className}`}>
      
      {/* Customization Control Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-brand-slate/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl transition-colors ${
            isCustomizeMode ? 'bg-indigo-600 text-white animate-pulse' : 'bg-brand-amber/15 text-brand-amber'
          }`}>
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Drag-and-Drop Bento Engine
              </span>
              {savedToast && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10.5px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-emerald-300"
                >
                  <Check className="w-3 h-3" />
                  <span>Layout Saved</span>
                </motion.span>
              )}
            </div>
            <h3 className="font-display text-base font-bold text-brand-charcoal mt-0.5">
              {lang === 'en' ? "Personalized Dashboard Bento Grid" : "Bento Grid Dashboard Customization"}
            </h3>
            <p className="text-xs text-brand-muted">
              {lang === 'en'
                ? "Rearrange charts, milestones, and learning path modules to match your study workflow."
                : "Apni marzi ke mutabiq dashboard ke sections ko ooper neechay arrange karein."}
            </p>
          </div>
        </div>

        {/* Toolbar Action Buttons & Preset Selector */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {LAYOUT_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer whitespace-nowrap ${
                  activePreset === preset.id
                    ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-2xs'
                    : 'bg-brand-sand/40 hover:bg-brand-sand/80 text-brand-slate border-brand-slate/15'
                }`}
                title={`Apply ${preset.nameEn}`}
              >
                <span>{lang === 'en' ? preset.nameEn : preset.nameUr}</span>
              </button>
            ))}
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetDefault}
            className="p-2 rounded-xl bg-brand-sand/50 hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal transition-all border border-brand-slate/15 cursor-pointer"
            title="Reset to default Bento layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Drag Customization Mode Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => {
              audioEngine.playLoFiChord();
              setIsCustomizeMode(!isCustomizeMode);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isCustomizeMode
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400/30'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isCustomizeMode ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Done Customizing</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize Layout</span>
              </>
            )}
          </motion.button>

        </div>
      </div>

      {/* DND-Kit Sortable Context Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tileOrder} strategy={rectSortingStrategy}>
          <div className="space-y-6">
            {tileOrder.map((tileId, index) => (
              <SortableBentoTile
                key={tileId}
                id={tileId}
                isCustomizeMode={isCustomizeMode}
                onMoveUp={() => handleMoveItem(index, 'up')}
                onMoveDown={() => handleMoveItem(index, 'down')}
                isFirst={index === 0}
                isLast={index === tileOrder.length - 1}
              >
                {renderTileContent(tileId)}
              </SortableBentoTile>
            ))}
          </div>
        </SortableContext>

        {/* Drag Overlay for smooth visual dragging */}
        <DragOverlay>
          {activeDragId ? (
            <div className="p-4 rounded-3xl bg-indigo-600 text-white shadow-2xl border-2 border-indigo-400 flex items-center gap-3 opacity-95 scale-105 pointer-events-none">
              <Move className="w-5 h-5 text-amber-300 animate-spin" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-200 block">
                  Moving Bento Module
                </span>
                <span className="font-display font-bold text-sm">
                  {BENTO_TILES_CONFIG[activeDragId]?.titleEn || activeDragId}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

    </div>
  );
}
