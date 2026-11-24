# Clay Mascot Integration Guide

## Quick Start

### 1. Import the Component
```tsx
import AnimatedClayMascot from './components/AnimatedClayMascot';
```

### 2. Basic Usage
```tsx
<AnimatedClayMascot 
  isSpeaking={isSpeaking}
  mood="happy"
  gesture="wave"
/>
```

### 3. Connect to Audio Engine
```tsx
import { audioEngine } from '../lib/audioEngine';

// In your component
useEffect(() => {
  audioEngine.setSpeakStateListener((speaking) => {
    setIsSpeaking(speaking);
  });
}, []);
```

## Integration Patterns

### Pattern 1: Simple Voice Guide
```tsx
export function SimpleGuide() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (text) => {
    audioEngine.speak(text, 'en', () => {
      setIsSpeaking(false);
    });
    setIsSpeaking(true);
  };

  return (
    <div>
      <AnimatedClayMascot isSpeaking={isSpeaking} />
      <button onClick={() => handleSpeak("Hello!")}>
        Click Me
      </button>
    </div>
  );
}
```

### Pattern 2: Interactive Storyboard (ClaybotIntroduction)
See `ClaybotIntroduction.tsx` for full implementation with:
- Multiple message scenarios
- Automatic mood switching
- Gesture synchronization
- Language support

```tsx
<ClaybotIntroduction autoPlay={false} />
```

### Pattern 3: Tutorial with Clay Guide
```tsx
export function AITutorial() {
  const [step, setStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const steps = [
    { 
      text: "Let me explain AI...",
      mood: 'thinking' as const,
      gesture: 'think' as const
    },
    { 
      text: "Machine Learning is...",
      mood: 'thinking' as const,
      gesture: 'point' as const
    },
    { 
      text: "Great! You understand now!",
      mood: 'excited' as const,
      gesture: 'wave' as const
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      audioEngine.speak(steps[step + 1].text, 'en', () => {
        setIsSpeaking(false);
      });
      setStep(step + 1);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    audioEngine.setSpeakStateListener(setIsSpeaking);
  }, []);

  return (
    <div>
      <AnimatedClayMascot 
        isSpeaking={isSpeaking}
        mood={steps[step].mood}
        gesture={steps[step].gesture}
      />
      <div>{steps[step].text}</div>
      <button onClick={handleNext}>Next →</button>
    </div>
  );
}
```

### Pattern 4: Contextual Chat Assistant
```tsx
export function ClayChat() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mood, setMood] = useState('happy');
  const [gesture, setGesture] = useState('none');

  const handleUserMessage = (message) => {
    // Analyze sentiment/intent
    const sentiment = analyzeSentiment(message);
    
    // Set appropriate mood/gesture
    if (sentiment.confused) {
      setMood('thinking');
      setGesture('think');
    } else if (sentiment.excited) {
      setMood('excited');
      setGesture('wave');
    } else {
      setMood('happy');
      setGesture('none');
    }

    // Generate and speak response
    const response = generateResponse(message);
    audioEngine.speak(response, 'en', () => {
      setIsSpeaking(false);
      setGesture('none');
    });
    setIsSpeaking(true);
  };

  useEffect(() => {
    audioEngine.setSpeakStateListener(setIsSpeaking);
  }, []);

  return (
    <div>
      <AnimatedClayMascot 
        isSpeaking={isSpeaking}
        mood={mood}
        gesture={gesture}
      />
      <ChatInput onSubmit={handleUserMessage} />
    </div>
  );
}
```

## Component Composition

### With Speech Bubble
```tsx
<div className="relative">
  <div className="speech-bubble">
    <p>{currentMessage}</p>
  </div>
  <AnimatedClayMascot 
    isSpeaking={isSpeaking}
    mood={mood}
    gesture={gesture}
  />
</div>
```

### With Control Panel
```tsx
<div className="flex gap-8">
  <AnimatedClayMascot 
    isSpeaking={isSpeaking}
    mood={mood}
    gesture={gesture}
  />
  <div className="control-panel">
    <button onClick={() => setMood('happy')}>Happy</button>
    <button onClick={() => setMood('thinking')}>Thinking</button>
    <button onClick={() => setMood('excited')}>Excited</button>
    <button onClick={() => setGesture('wave')}>Wave</button>
    <button onClick={() => setGesture('point')}>Point</button>
  </div>
</div>
```

### With Animation Timeline
```tsx
<div className="timeline-editor">
  <AnimatedClayMascot 
    isSpeaking={isPlayingTimeline}
    mood={timelineState.mood}
    gesture={timelineState.gesture}
  />
  <div className="timeline-controls">
    {/* Keyframe editor */}
  </div>
</div>
```

## Audio Engine Integration

### Setup audioEngine Listener
```tsx
useEffect(() => {
  const unsubscribe = audioEngine.setSpeakStateListener((isSpeaking) => {
    setIsSpeaking(isSpeaking);
  });

  // Check initial state
  if (audioEngine.isCurrentlySpeaking()) {
    setIsSpeaking(true);
  }

  return () => unsubscribe?.();
}, []);
```

### Trigger Speech
```tsx
// Simple speak
audioEngine.speak("Hello world", "en", onComplete);

// With language
audioEngine.speak("नमस्ते", "hi", onComplete);

// Stop speaking
audioEngine.stopSpeaking();

// Check if speaking
const isSpeaking = audioEngine.isCurrentlySpeaking();
```

## Styling & Layout

### Center Clay
```tsx
<div className="flex items-center justify-center min-h-screen">
  <AnimatedClayMascot isSpeaking={false} />
</div>
```

### Side Panel
```tsx
<div className="grid grid-cols-2 gap-8 items-center">
  <AnimatedClayMascot isSpeaking={false} />
  <div className="content">
    {/* Content here */}
  </div>
</div>
```

### Full Screen Hero
```tsx
<div className="relative w-full h-screen bg-gradient-to-br">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <AnimatedClayMascot isSpeaking={false} />
  </div>
</div>
```

### Mobile Responsive
```tsx
<div className="w-full flex flex-col md:flex-row gap-4">
  <div className="flex justify-center md:w-1/2">
    <AnimatedClayMascot isSpeaking={false} />
  </div>
  <div className="md:w-1/2">
    {/* Content */}
  </div>
</div>
```

## Multi-Language Support

### Integration with useLanguageMultilingual
```tsx
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';

export function MultiLangClay() {
  const { lang } = useLanguageMultilingual();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messages = {
    en: "Hello!",
    hi: "नमस्ते!",
    te: "హలో!",
    mr: "नमस्कार!",
    // ... etc
  };

  const handleSpeak = () => {
    audioEngine.speak(messages[lang], lang, () => {
      setIsSpeaking(false);
    });
    setIsSpeaking(true);
  };

  useEffect(() => {
    audioEngine.setSpeakStateListener(setIsSpeaking);
  }, []);

  return (
    <>
      <AnimatedClayMascot isSpeaking={isSpeaking} />
      <button onClick={handleSpeak}>Speak</button>
    </>
  );
}
```

## TypeScript Types

```typescript
interface AnimatedClayProps {
  isSpeaking: boolean;
  mood?: 'happy' | 'thinking' | 'excited';
  gesture?: 'wave' | 'point' | 'think' | 'none';
}

type Mood = 'happy' | 'thinking' | 'excited';
type Gesture = 'wave' | 'point' | 'think' | 'none';
```

## Performance Best Practices

### 1. Memoize Clay Component
```tsx
import { memo } from 'react';

const MemoizedClay = memo(AnimatedClayMascot);

<MemoizedClay isSpeaking={isSpeaking} mood="happy" />;
```

### 2. Debounce State Updates
```tsx
const debouncedSetMood = useCallback(
  debounce((newMood) => setMood(newMood), 300),
  []
);
```

### 3. Use useCallback for Handlers
```tsx
const handleSpeak = useCallback(() => {
  audioEngine.speak(text, lang, () => setIsSpeaking(false));
  setIsSpeaking(true);
}, [text, lang]);
```

### 4. Lazy Load When Off-Screen
```tsx
const clayRef = useRef(null);
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    setIsVisible(entry.isIntersecting);
  });
  if (clayRef.current) observer.observe(clayRef.current);
}, []);

{isVisible && <AnimatedClayMascot {...props} />}
```

## Accessibility

### Screen Reader Announcements
```tsx
<div role="img" aria-label="Clay the AI mascot is speaking">
  <AnimatedClayMascot isSpeaking={isSpeaking} />
</div>
```

### Reduced Motion Respect
```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<AnimatedClayMascot 
  isSpeaking={isSpeaking && !prefersReducedMotion}
/>
```

### Keyboard Navigation
```tsx
<button
  onClick={handleSpeak}
  aria-label="Click to hear Clay's explanation"
  onKeyDown={(e) => e.key === 'Enter' && handleSpeak()}
>
  <AnimatedClayMascot isSpeaking={isSpeaking} />
</button>
```

## Troubleshooting

### Mouth not animating?
- Check `isSpeaking` is boolean
- Verify audioEngine is calling listener correctly
- Check mouth update interval (100ms)

### Gesture not working?
- Ensure gesture is valid: 'wave' | 'point' | 'think' | 'none'
- Check transition duration matches gesture type
- Verify no CSS specificity conflicts

### Performance dropping?
- Use React DevTools Profiler
- Check GPU acceleration in Layers panel
- Reduce animation frequency if needed
- Memoize component if updating rapidly

### Speech not syncing?
- Verify audioEngine listener is set up
- Check browser console for errors
- Test with simple text first
- Check audio is not muted

## Deployment

### Build Verification
```bash
npm run build
# Check dist/assets/index-*.js is <400KB
```

### Production Deployment
```tsx
// Lazy load Clay if on slow connections
const AnimatedClayMascot = lazy(() => 
  import('./components/AnimatedClayMascot')
);

<Suspense fallback={<div>Loading...</div>}>
  <AnimatedClayMascot {...props} />
</Suspense>
```

## Examples Repository

Ready-to-use examples:
- `src/components/ClaybotIntroduction.tsx` - Interactive intro
- `src/components/ClayExplainer.tsx` - Full storyboard
- Tests in `__tests__/AnimatedClayMascot.test.tsx`

## Support

For issues or questions:
1. Check `CLAY_MASCOT_GUIDE.md`
2. Review test checklist in `CLAY_TESTING_CHECKLIST.md`
3. See examples above
4. Check browser console for errors
5. File issue with detailed reproduction steps

---

**Last Updated**: Current Session
**Version**: 1.0
**Status**: Production Ready ✅
