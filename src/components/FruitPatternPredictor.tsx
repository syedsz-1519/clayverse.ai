import React, { useState, useMemo } from 'react';
import { Sparkles, Scale, Sun, Dice5, FlaskConical, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';

interface FruitSample {
  name: string;
  sweetness: number; // Brix 10 - 25
  firmness: number;  // 10 - 100%
  saffron: number;   // 10 - 100%
}

const PRESET_SAMPLES: FruitSample[] = [
  { name: 'Ripe Ratnagiri Alphonso', sweetness: 18, firmness: 78, saffron: 85 },
  { name: 'Export-Grade Devgad Alphonso', sweetness: 21, firmness: 82, saffron: 92 },
  { name: 'Semi-Ripe Kesar Mango', sweetness: 15, firmness: 62, saffron: 65 },
  { name: 'Early Harvest Devgad', sweetness: 14, firmness: 88, saffron: 45 },
  { name: 'Raw Green Kairi (Unripe)', sweetness: 11, firmness: 94, saffron: 20 },
];

export default function FruitPatternPredictor() {
  const { lang } = useLanguage();
  const [sweetness, setSweetness] = useState<number>(18);
  const [firmness, setFirmness] = useState<number>(78);
  const [saffron, setSaffron] = useState<number>(85);
  const [sampleIdx, setSampleIdx] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Neural weight model calculation (simulating trained pattern matching)
  const { confidence, predictionTitle, confidenceLabel, isMatch } = useMemo(() => {
    // Score based on ideal Alphonso pattern: high sweetness (>=17), balanced firmness (65-85%), high saffron color (>=75%)
    const sweetnessWeight = Math.min(Math.max((sweetness - 10) / 12, 0), 1);
    const saffronWeight = saffron / 100;
    const firmnessWeight = firmness > 85 ? (100 - firmness) / 15 : firmness / 85;

    const rawScore = (sweetnessWeight * 0.45) + (saffronWeight * 0.35) + (firmnessWeight * 0.20);
    const calculatedConfidence = Math.min(Math.max(Math.round(rawScore * 100), 32), 98);

    let title = 'Ripe Ratnagiri Alphonso';
    let label = 'Very High';
    let match = true;

    if (calculatedConfidence >= 88) {
      title = 'Ripe Ratnagiri Alphonso';
      label = 'Very High';
      match = true;
    } else if (calculatedConfidence >= 72) {
      title = 'Semi-Ripe Devgad Mango';
      label = 'Moderate';
      match = true;
    } else if (calculatedConfidence >= 55) {
      title = 'Early Orchard Harvest';
      label = 'Low Certainty';
      match = false;
    } else {
      title = 'Raw Green Kairi (Unripe)';
      label = 'Negative Match';
      match = false;
    }

    return {
      confidence: calculatedConfidence,
      predictionTitle: title,
      confidenceLabel: label,
      isMatch: match
    };
  }, [sweetness, firmness, saffron]);

  const handleTestNewSample = () => {
    setIsAnimating(true);
    const nextIdx = (sampleIdx + 1) % PRESET_SAMPLES.length;
    setSampleIdx(nextIdx);
    const sample = PRESET_SAMPLES[nextIdx];
    
    setSweetness(sample.sweetness);
    setFirmness(sample.firmness);
    setSaffron(sample.saffron);

    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DC] shadow-xs text-left">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E0F2F1] text-[#00796B] flex items-center justify-center shrink-0 shadow-2xs">
            <FlaskConical className="w-5 h-5 text-[#00796B]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1E1E1E] tracking-tight font-display">
              {lang === 'en' ? 'The Fruit Pattern Predictor' : 'Phal Pattern Predictor'}
            </h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F5] border border-[#E0E0E0] text-[#616161] text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {lang === 'en' ? 'Live Model' : 'Live Model'}
        </span>
      </div>

      <p className="text-sm text-[#757575] mt-1 mb-6 leading-relaxed">
        {lang === 'en' 
          ? 'Adjust the physical attributes below. Watch how the neural weights recalculate certainty dynamically without writing any code rules.'
          : 'Neeche diye gaye attributes badal kar dekhein ke bina code likhe neural model patterns ko kaise pehchanta hai.'}
      </p>

      {/* 3 Physical Attribute Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Slider 1: Sweetness */}
        <div className="bg-[#FAF7F2] border border-[#EFE7DC] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#424242]">
              <Sparkles className="w-3.5 h-3.5 text-[#C1622D]" />
              <span>Sweetness (Brix)</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#A8481F] bg-[#FFF0E6] border border-[#FAD9C3] px-2 py-0.5 rounded-md">
              {sweetness}°
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="25"
            step="1"
            value={sweetness}
            onChange={(e) => setSweetness(Number(e.target.value))}
            className="w-full accent-[#C1622D] cursor-pointer h-1.5 bg-[#E8DFC8] rounded-lg"
            aria-label="Sweetness in Brix"
          />
        </div>

        {/* Slider 2: Firmness / Yield */}
        <div className="bg-[#FAF7F2] border border-[#EFE7DC] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#424242]">
              <Scale className="w-3.5 h-3.5 text-[#00796B]" />
              <span>Firmness / Yield</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#00796B] bg-[#E0F2F1] border border-[#B2DFDB] px-2 py-0.5 rounded-md">
              {firmness}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={firmness}
            onChange={(e) => setFirmness(Number(e.target.value))}
            className="w-full accent-[#00796B] cursor-pointer h-1.5 bg-[#E8DFC8] rounded-lg"
            aria-label="Firmness percentage"
          />
        </div>

        {/* Slider 3: Golden Saffron */}
        <div className="bg-[#FAF7F2] border border-[#EFE7DC] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#424242]">
              <Sun className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Golden Saffron</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 rounded-md">
              {saffron}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={saffron}
            onChange={(e) => setSaffron(Number(e.target.value))}
            className="w-full accent-[#D97706] cursor-pointer h-1.5 bg-[#E8DFC8] rounded-lg"
            aria-label="Golden saffron color percentage"
          />
        </div>
      </div>

      {/* Machine Prediction Banner */}
      <div className="bg-[#FFF5EE] border border-[#FCDCC9] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Circular Percentage Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 rotate-[-90deg]">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#F6D3C5"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#A8481F"
                strokeWidth="5"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={`${(confidence / 100) * 163.36} 163.36`}
                className="transition-all duration-300"
              />
            </svg>
            <span className="absolute font-display font-black text-lg text-[#1E1E1E]">
              {confidence}%
            </span>
          </div>

          {/* Machine Prediction Text */}
          <div className="min-w-0">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-[#A8481F] font-bold">
              MACHINE PREDICTION
            </span>
            <h4 className="text-base sm:text-lg font-bold text-[#1E1E1E] truncate">
              {predictionTitle}
            </h4>
            <p className="text-xs text-[#757575] mt-0.5">
              Classification Confidence:{' '}
              <strong className={isMatch ? 'text-[#A8481F] font-bold' : 'text-neutral-700 font-bold'}>
                {confidenceLabel}
              </strong>
            </p>
          </div>
        </div>

        {/* Test with New Sample Button */}
        <button
          onClick={handleTestNewSample}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E0E0E0] text-[#1E1E1E] text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Dice5 className={`w-4 h-4 text-[#A8481F] ${isAnimating ? 'animate-spin' : ''}`} />
          <span>{lang === 'en' ? 'Test with New Sample' : 'Naya Sample Test Karein'}</span>
        </button>
      </div>
    </div>
  );
}
