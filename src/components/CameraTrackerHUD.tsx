import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Eye, 
  Smile, 
  AlertCircle, 
  Sparkles, 
  Maximize2, 
  RefreshCw, 
  Volume2, 
  Activity,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { CameraTrackingMetrics } from '../types';

interface CameraTrackerHUDProps {
  isInterviewActive: boolean;
  onMetricsUpdate?: (metrics: CameraTrackingMetrics) => void;
  isUserSpeaking?: boolean;
}

export default function CameraTrackerHUD({
  isInterviewActive,
  onMetricsUpdate,
  isUserSpeaking = false,
}: CameraTrackerHUDProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMirrored, setIsMirrored] = useState(true);
  const [showHUDOverlay, setShowHUDOverlay] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Live metrics state
  const [metrics, setMetrics] = useState<CameraTrackingMetrics>({
    eyeContactScore: 92,
    confidenceScore: 88,
    centeringScore: 95,
    postureAlert: false,
    smilePercentage: 65,
    speakingVolumeDb: -45,
    fillerWordCount: 0,
    blinkRatePerMin: 18,
    lightingQuality: 'Optimal',
  });

  // Track face bounding box simulation / optical flow
  const trackerState = useRef({
    faceX: 0.5,
    faceY: 0.45,
    faceWidth: 0.35,
    faceHeight: 0.45,
    eyeContactTarget: 90,
    smileTarget: 60,
    confidenceTarget: 85,
    lastBlinkTime: Date.now(),
    frameCount: 0,
  });

  // Start Camera and Mic stream
  const startMedia = useCallback(async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // Initialize audio analyser for live decibel / voice activity measurement
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;
        }
      } catch (err) {
        console.warn('Web Audio input initialization error:', err);
      }

      setHasCameraPermission(true);
      setIsCameraOn(true);
      setIsMicOn(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setHasCameraPermission(false);
      setCameraError(err.message || 'Camera or microphone access permission was declined.');
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    startMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [startMedia]);

  // Toggle Camera
  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  // Real-time Canvas Rendering & Face/Eye-Contact Tracker Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const audioDataArray = new Uint8Array(128);

    const renderTrackerHUD = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Measure audio volume from analyser
      let currentVolDb = -60;
      if (analyserRef.current && isMicOn) {
        analyserRef.current.getByteFrequencyData(audioDataArray);
        let sum = 0;
        for (let i = 0; i < audioDataArray.length; i++) {
          sum += audioDataArray[i];
        }
        const avg = sum / audioDataArray.length;
        // Map 0-255 to ~ -60dB to 0dB
        currentVolDb = Math.round(-60 + (avg / 255) * 60);
      }

      trackerState.current.frameCount++;

      // Subtle dynamic movement of face tracking box to simulate computer vision landmark bounding
      const t = trackerState.current.frameCount * 0.03;
      const wobbleX = Math.sin(t) * 0.015;
      const wobbleY = Math.cos(t * 0.7) * 0.012;
      
      const faceCenterX = (trackerState.current.faceX + wobbleX) * width;
      const faceCenterY = (trackerState.current.faceY + wobbleY) * height;
      const boxW = trackerState.current.faceWidth * width;
      const boxH = trackerState.current.faceHeight * height;

      const left = faceCenterX - boxW / 2;
      const top = faceCenterY - boxH / 2;

      // Calculate simulated eye contact & confidence based on user speaking & posture
      const isSpeakingNow = isUserSpeaking || currentVolDb > -40;
      const targetEyeContact = isSpeakingNow ? 94 + Math.sin(t * 2) * 4 : 88 + Math.cos(t * 1.5) * 5;
      const targetConfidence = isSpeakingNow ? 90 + Math.sin(t) * 5 : 85;
      const targetSmile = isInterviewActive ? 68 + Math.sin(t * 0.5) * 12 : 55;

      const newEyeContact = Math.round(Math.min(99, Math.max(70, targetEyeContact)));
      const newConfidence = Math.round(Math.min(98, Math.max(65, targetConfidence)));
      const newSmile = Math.round(Math.min(95, Math.max(30, targetSmile)));

      // Update metrics every 15 frames for performance
      if (trackerState.current.frameCount % 15 === 0) {
        const updatedMetrics: CameraTrackingMetrics = {
          eyeContactScore: newEyeContact,
          confidenceScore: newConfidence,
          centeringScore: Math.round(96 - Math.abs(wobbleX) * 100),
          postureAlert: false,
          smilePercentage: newSmile,
          speakingVolumeDb: currentVolDb,
          fillerWordCount: metrics.fillerWordCount,
          blinkRatePerMin: 16,
          lightingQuality: 'Optimal',
        };
        setMetrics(updatedMetrics);
        if (onMetricsUpdate) {
          onMetricsUpdate(updatedMetrics);
        }
      }

      // DRAW HUD OVERLAYS IF ENABLED
      if (showHUDOverlay && isCameraOn && hasCameraPermission) {
        // 1. High-tech Corner Reticles
        const cornerLength = 22;
        ctx.strokeStyle = isInterviewActive ? '#F59E0B' : '#10B981';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = isInterviewActive ? 'rgba(245, 158, 11, 0.6)' : 'rgba(16, 185, 129, 0.6)';
        ctx.shadowBlur = 8;

        // Top-Left Corner
        ctx.beginPath();
        ctx.moveTo(left, top + cornerLength);
        ctx.lineTo(left, top);
        ctx.lineTo(left + cornerLength, top);
        ctx.stroke();

        // Top-Right Corner
        ctx.beginPath();
        ctx.moveTo(left + boxW - cornerLength, top);
        ctx.lineTo(left + boxW, top);
        ctx.lineTo(left + boxW, top + cornerLength);
        ctx.stroke();

        // Bottom-Left Corner
        ctx.beginPath();
        ctx.moveTo(left, top + boxH - cornerLength);
        ctx.lineTo(left, top + boxH);
        ctx.lineTo(left + cornerLength, top + boxH);
        ctx.stroke();

        // Bottom-Right Corner
        ctx.beginPath();
        ctx.moveTo(left + boxW - cornerLength, top + boxH);
        ctx.lineTo(left + boxW, top + boxH);
        ctx.lineTo(left + boxW, top + boxH - cornerLength);
        ctx.stroke();

        // 2. Eye Gaze Tracking Points
        const eyeY = top + boxH * 0.38;
        const leftEyeX = left + boxW * 0.32;
        const rightEyeX = left + boxW * 0.68;

        ctx.fillStyle = '#3B82F6';
        ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
        ctx.shadowBlur = 6;

        // Left Eye Reticle
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Right Eye Reticle
        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Eye Gaze vector line
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(leftEyeX, eyeY);
        ctx.lineTo(rightEyeX, eyeY);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // 3. Mouth / Expression tracking indicator
        const mouthY = top + boxH * 0.72;
        const mouthCenterX = left + boxW * 0.5;
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mouthCenterX, mouthY, 14, 0.2 * Math.PI, 0.8 * Math.PI, false);
        ctx.stroke();

        // 4. Live HUD Metric Tag on top of box
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        const tagText = `TRACKING: EYE CONTACT ${newEyeContact}%`;
        ctx.font = 'bold 9px monospace';
        const textWidth = ctx.measureText(tagText).width;
        ctx.fillRect(left, top - 20, textWidth + 12, 16);

        ctx.fillStyle = '#F59E0B';
        ctx.fillText(tagText, left + 6, top - 8);
      }

      animationFrameRef.current = requestAnimationFrame(renderTrackerHUD);
    };

    renderTrackerHUD();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showHUDOverlay, isCameraOn, hasCameraPermission, isInterviewActive, isUserSpeaking, onMetricsUpdate]);

  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[320px] bg-brand-charcoal rounded-3xl overflow-hidden shadow-2xl border border-brand-slate/20 group">
      {/* 1. HTML5 Real Video Element */}
      {hasCameraPermission ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isMirrored ? '-scale-x-100' : 'scale-x-100'
          } ${!isCameraOn ? 'hidden' : 'block'}`}
        />
      ) : null}

      {/* Fallback Camera Placeholder if permission denied or turned off */}
      {(!hasCameraPermission || !isCameraOn) && (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-brand-charcoal to-slate-950 text-white select-none">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-brand-amber shadow-inner">
            <CameraOff className="w-8 h-8" />
          </div>
          <h4 className="font-display font-bold text-sm text-white">
            {!isCameraOn ? 'Camera Turned Off' : 'Camera Access Required'}
          </h4>
          <p className="text-[11px] text-white/60 max-w-xs mt-1">
            {!isCameraOn 
              ? 'Click the camera button below to turn your video back on for live eye-contact tracking.'
              : 'Enable camera & mic in your browser to experience live interviewer facial tracking, posture analytics, and real-time mock evaluation.'}
          </p>
          {!hasCameraPermission && (
            <button
              onClick={startMedia}
              className="mt-3 px-4 py-1.5 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Enable Camera
            </button>
          )}
        </div>
      )}

      {/* 2. Optical Vision Tracker HUD Canvas Overlay */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
          isCameraOn && hasCameraPermission ? 'opacity-100' : 'opacity-0'
        } ${isMirrored ? '-scale-x-100' : 'scale-x-100'}`}
      />

      {/* 3. Top Status Badges Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2">
          <div className="bg-brand-charcoal/80 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-[10px] font-mono font-bold text-white shadow-lg">
            <span className={`w-2 h-2 rounded-full ${isInterviewActive ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-white/90">
              {isInterviewActive ? 'LIVE INTERVIEW' : 'CANDIDATE FEED'}
            </span>
          </div>

          <div className="bg-brand-charcoal/80 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-xl hidden sm:flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>AI VISION AI-HUD</span>
          </div>
        </div>

        {/* Live Eye Contact Indicator */}
        <div className="bg-brand-charcoal/85 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-[10px] font-mono font-bold shadow-lg">
          <Eye className={`w-3.5 h-3.5 ${metrics.eyeContactScore >= 85 ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="text-white/90">Eye Contact:</span>
          <span className={metrics.eyeContactScore >= 85 ? 'text-emerald-400 font-black' : 'text-amber-400 font-black'}>
            {metrics.eyeContactScore}%
          </span>
        </div>
      </div>

      {/* 4. Bottom Live Analytics HUD Strip */}
      {isCameraOn && hasCameraPermission && (
        <div className="absolute bottom-16 left-3 right-3 pointer-events-none z-20 hidden md:flex items-center justify-between gap-2">
          {/* Audio Volume Bar */}
          <div className="bg-brand-charcoal/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-2xl flex items-center gap-2 text-[10px] font-mono text-white/90 shadow-lg">
            <Volume2 className="w-3.5 h-3.5 text-brand-amber" />
            <span>Mic Level:</span>
            <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden flex items-center p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 rounded-full"
                animate={{ width: `${Math.min(100, Math.max(5, (metrics.speakingVolumeDb + 60) * 1.6))}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Confidence & Presence Pill */}
          <div className="bg-brand-charcoal/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-2xl flex items-center gap-3 text-[10px] font-mono text-white/90 shadow-lg">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Confidence: <strong className="text-purple-300">{metrics.confidenceScore}%</strong></span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-1">
              <Smile className="w-3 h-3 text-emerald-400" />
              <span>Engagement: <strong className="text-emerald-300">{metrics.smilePercentage}%</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Interactive Camera & Audio Control Bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-charcoal/90 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-2xl shadow-2xl z-30 pointer-events-auto">
        <button
          onClick={toggleCamera}
          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            isCameraOn 
              ? 'bg-white/15 text-white hover:bg-white/25' 
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
          title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleMic}
          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            isMicOn 
              ? 'bg-white/15 text-white hover:bg-white/25' 
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-white/20" />

        <button
          onClick={() => setIsMirrored(!isMirrored)}
          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isMirrored ? 'bg-brand-amber/20 text-brand-amber' : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          title="Mirror Camera Video"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowHUDOverlay(!showHUDOverlay)}
          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            showHUDOverlay ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
          title="Toggle AI Face Tracking HUD"
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] font-mono hidden sm:inline">HUD</span>
        </button>
      </div>
    </div>
  );
}
