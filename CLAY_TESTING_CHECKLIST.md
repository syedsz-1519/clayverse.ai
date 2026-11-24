# Clay Mascot Testing Checklist

## Setup
- [ ] Dev server running on localhost:5173
- [ ] Latest browser with Web Speech API support
- [ ] Audio/speakers enabled
- [ ] Dev tools open (F12) for debugging

## Component Tests

### AnimatedClayMascot Component
- [ ] Component renders without errors
- [ ] Size is 256x256px (w-64 h-64)
- [ ] Terracotta color (#E07A5F) visible
- [ ] Face plate (cream color #F4EFE6) centered

### Blinking
- [ ] Eyes blink automatically every 3-5 seconds
- [ ] Blink duration is smooth (150ms)
- [ ] Eyes have white highlight/pupil visible
- [ ] Blinking works continuously

### Mouth Animation
- [ ] Mouth is closed by default
- [ ] Mouth animates (height changes) when `isSpeaking={true}`
- [ ] Mouth shape changes (height + border-radius)
- [ ] Smooth 100ms updates

### Mood System
Test each mood:

#### Happy (default)
- [ ] Head position: neutral (0° rotation)
- [ ] Expression: neutral/pleasant
- [ ] Usage: Normal/welcome messages

#### Thinking
- [ ] Head tilts left (-5°)
- [ ] Visual: Contemplative
- [ ] Usage: When explaining complex topics

#### Excited
- [ ] Head tilts right (+5°)
- [ ] Visual: Energetic
- [ ] Usage: Enthusiastic responses

### Gesture System

#### Wave
- [ ] Left arm rotates: 0° → 45° → -15° → 45° → 0°
- [ ] Animation repeats infinitely (0.8s cycle)
- [ ] Smooth, natural waving motion
- [ ] Arm stays attached to body

#### Point
- [ ] Left arm rotates to 25°
- [ ] Offset: -2px
- [ ] One-time animation (0.3s)
- [ ] Returns to rest after animation

#### Think
- [ ] Left arm rotates to -10°
- [ ] Offset: -5px
- [ ] Contemplative pose
- [ ] One-time animation (0.3s)

#### None (default)
- [ ] Left arm at rest
- [ ] No animation
- [ ] Default state

### Performance
- [ ] No lag during animations
- [ ] Smooth 60 FPS (check DevTools > Performance)
- [ ] GPU acceleration active (check in Layers panel)
- [ ] No console errors
- [ ] `will-change-transform` applied correctly
- [ ] `transform: translateZ(0)` renders with acceleration

### Integration Tests

#### ClaybotIntroduction Component
- [ ] Component loads without errors
- [ ] "Meet Clay" header visible
- [ ] 4 message buttons visible and clickable
- [ ] Speech bubble displays current message
- [ ] Clay mascot displays correctly

#### Audio Engine Integration
- [ ] Click Clay or message buttons to trigger speech
- [ ] `isSpeaking` state updates correctly
- [ ] Mascot stops animating when speech ends
- [ ] Can interrupt speech by clicking again
- [ ] Mouth closes when speech ends

#### Mood/Gesture Synchronization
- [ ] Welcome: happy mood, no gesture
- [ ] What is AI?: thinking mood, think gesture
- [ ] Learning: happy mood, point gesture
- [ ] Curious: excited mood, wave gesture

#### Language Support
- [ ] Switch language in top menu
- [ ] Clay speaks in selected language
- [ ] Mood/gesture still responds correctly
- [ ] All 8 languages tested:
  - [ ] English (en)
  - [ ] Hindi (hi)
  - [ ] Telugu (te)
  - [ ] Marathi (mr)
  - [ ] Tamil (ta)
  - [ ] Urdu (ur)
  - [ ] Roman Urdu (roman_ur)
  - [ ] Hinglish (hinglish)

## Browser Compatibility

### Chrome/Chromium
- [ ] All animations smooth
- [ ] GPU acceleration works
- [ ] Speech synthesis available
- [ ] No warnings in console

### Firefox
- [ ] All animations render
- [ ] Speech works (may use different voices)
- [ ] No CSS issues

### Safari
- [ ] All animations render
- [ ] Speech synthesis works
- [ ] Check for vendor prefix issues

### Mobile (iOS/Android)
- [ ] Touch interactions work
- [ ] Scale animations adapt to screen size
- [ ] Speech synthesis works on mobile
- [ ] Gesture animations visible

## Accessibility

- [ ] Screen reader announces Clay's speech
- [ ] Keyboard can trigger speech (if buttons keyboard-accessible)
- [ ] Color contrast meets WCAG AA standards
- [ ] Animation respects `prefers-reduced-motion`

## Edge Cases

### Speech Edge Cases
- [ ] Long text breaks correctly
- [ ] Special characters handled
- [ ] Empty string doesn't break
- [ ] Rapid clicks don't cause multiple voices
- [ ] Language switching during speech works

### Animation Edge Cases
- [ ] Multiple gestures don't conflict
- [ ] Switching moods mid-animation is smooth
- [ ] isSpeaking toggle is responsive
- [ ] Rapid mood changes don't cause jank

### Performance Edge Cases
- [ ] 10+ Clay instances on page don't lag
- [ ] Animations continue smoothly during page scroll
- [ ] No memory leaks after repeated toggles
- [ ] DevTools heap doesn't grow unbounded

## Visual Quality

- [ ] Mouth shape looks natural (0-1 scale works well)
- [ ] Blinking eyes look human-like
- [ ] Arm gestures are fluid, not jerky
- [ ] Shadows render correctly and smoothly
- [ ] Colors are vibrant and accurate

## Regression Tests

- [ ] All existing tests still pass
- [ ] No console errors
- [ ] No TypeScript errors in build
- [ ] Production build succeeds
- [ ] Bundle size within limits (<20KB for mascot)

## Demo Scenarios

### Scenario 1: Welcome
1. Load page
2. Clay is happy, neutral expression
3. Click Clay
4. Clay waves while speaking greeting
5. Mouth animates during speech
6. Speech ends, Clay stops moving
- [ ] All steps work correctly

### Scenario 2: Learning Path
1. Click "What is AI" button
2. Clay enters thinking mood, tilts left
3. Clay points gesture triggers
4. Clay speaks explanation
5. Click "Learning" button
6. Clay happy mood, point gesture
7. Different explanation plays
- [ ] All transitions smooth

### Scenario 3: Enthusiastic Response
1. Click "Curious?" button
2. Clay excited mood, tilts right
3. Clay waves enthusiastically
4. Full speech plays with animations
5. All animations stop after speech
- [ ] Animation quality high

## Final Checklist
- [ ] All tests passed
- [ ] No console errors
- [ ] No TypeScript warnings
- [ ] Production build passes
- [ ] Ready to merge to main
- [ ] Documentation updated
- [ ] Team notified of new features

## Known Issues / Limitations

- [ ] Phoneme mapping is pseudo-random (not real speech parsing)
- [ ] Some browsers may not have multiple voices
- [ ] Mobile speech synthesis quality varies
- [ ] High-motion devices may need reduced animation

## Future Improvements
- [ ] Real phoneme parsing from Web Speech API
- [ ] More gesture types (pointing, dancing, applause)
- [ ] Face expressions beyond mood tilts
- [ ] Recording/export of animations
- [ ] Animation timeline editor UI

---

**Last Updated**: Current Session
**Tester**: [Your Name]
**Device**: [Your Device]
**Browser**: [Browser + Version]
