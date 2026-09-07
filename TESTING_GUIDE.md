# Clayverse AI - Testing Guide 🧪

## ✅ Server Status
**Status**: ✅ Running on `http://localhost:3000`

---

## 📋 Testing Checklist

### 1. **Access the Website**
- [ ] Open browser: `http://localhost:3000`
- [ ] Hero section loads with white background
- [ ] All navigation elements visible
- [ ] Page renders without errors

### 2. **Test Language Switching** 🌍

#### Desktop Language Selector (Top Right)
- [ ] Click language dropdown (currently shows: English, हिन्दी, తెలుగు, मराठी, தமிழ், اردو, Roman Urdu, Hinglish)

#### Test Each Language:

**🇬🇧 English (Default)**
- [ ] UI text in English
- [ ] Navigation: Home, Curriculum, Lessons, 12 Concepts
- [ ] Button text: "Get Started", "Start Learning"
- [ ] AI terms display: "Artificial Intelligence", "Machine Learning", etc.

**🇮🇳 Hindi (हिन्दी)**
- [ ] UI changes to Hindi (Devanagari script)
- [ ] Navigation translates: होम, पाठ्यक्रम, पाठ
- [ ] AI terms show: "कृत्रिम बुद्धिमत्ता", "मशीन लर्निंग"
- [ ] Definitions in Hindi
- [ ] Page direction: Left-to-Right (LTR)

**🇮🇳 Telugu (తెలుగు)**
- [ ] UI changes to Telugu script
- [ ] Navigation translates to Telugu
- [ ] AI terms show: "కృత్రిమ మేధస్సు", "యంత్ర శిక్ష"
- [ ] **CRITICAL**: Definitions now show in Telugu (not English!)
- [ ] Page direction: Left-to-Right (LTR)

**🇮🇳 Marathi (मराठी)**
- [ ] UI in Marathi (Devanagari)
- [ ] AI terms: "कृत्रिम बुद्धिमत्ता", "मशीन लर्निंग"
- [ ] All definitions in Marathi
- [ ] LTR direction

**🇮🇳 Tamil (தமிழ்)**
- [ ] UI in Tamil script
- [ ] AI terms: "செயற்கை நுண்ணறிவு", "இயந்திர கற்றல்"
- [ ] All definitions in Tamil
- [ ] LTR direction

**🇮🇳 Hinglish (Hindi in Roman Script)**
- [ ] UI in Roman script (Hindi transliterated)
- [ ] Mix of Hindi words with Roman letters
- [ ] AI terms: "Artificial Intelligence (Naqli Budhhimatta)", "Machine Learning (Yantra Shiksha)"
- [ ] LTR direction

**🇵🇰 Urdu (اردو) - RTL Test**
- [ ] UI changes to Urdu (Nastaliq/Naskh script)
- [ ] **CRITICAL**: Page direction changes to RIGHT-TO-LEFT (RTL)
- [ ] All elements align to right
- [ ] Navigation bar items flow right-to-left
- [ ] AI terms: "مصنوعی ذہانت", "مشین سیکھنا"
- [ ] Definitions in Urdu
- [ ] Text reading direction: RTL

**🇵🇰 Roman Urdu (Latinized Script)**
- [ ] UI in Roman script
- [ ] Urdu words written in Latin letters
- [ ] AI terms: "Masnooi Zehanat", "Machine Seekhna"
- [ ] LTR direction
- [ ] Definitions in Roman Urdu

---

### 3. **Test AI Terms Display** 📚

#### Go to "12 Core Concepts" Section
- [ ] Scroll to or click "12 Core Concepts" / "12 Buniyadi Concepts"
- [ ] ClosingAndDeeper section opens

#### Test Term Translations (Change language and verify):

**Key AI Terms to Test:**
1. "Artificial Intelligence"
2. "Machine Learning"
3. "Deep Learning"
4. "Neural Network"
5. "Transformer"
6. "Large Language Model (LLM)"
7. "Prompt"
8. "Hallucination"

For **EACH LANGUAGE**, verify:
- [ ] Term name appears in local language
- [ ] Definition appears in local language (not English!)
- [ ] Copy button works and copies the localized definition
- [ ] Search bar finds terms in local language

---

### 4. **Test Professional UI/UX** 🎨

#### Design Elements
- [ ] White background (#FFFFFF) throughout
- [ ] Orange buttons (#FF6B35) for CTAs
- [ ] Blue accent (#3B82F6) for secondary elements
- [ ] Professional shadows and spacing
- [ ] No ScrollProgressIndicator (removed)
- [ ] Smooth animations and transitions

#### Components
- [ ] Hero section: Compelling title and CTA
- [ ] FloatingNav: Clean navigation bar
- [ ] Curriculum Grid: Professional layout
- [ ] Cards: Proper spacing and alignment
- [ ] Buttons: Consistent styling

---

### 5. **Test Mobile Responsiveness** 📱

#### On Mobile/Tablet Screen Size
- [ ] Language selector appears in mobile menu
- [ ] Navigation items stack properly
- [ ] Cards reflow to single column
- [ ] Touch-friendly button sizes
- [ ] Text readable on small screens

---

### 6. **Test LocalStorage Persistence** 💾

#### Language Preference Storage
1. Select **Telugu** language
2. Scroll down to verify Telugu displays
3. **Refresh page** (F5 or Ctrl+R)
   - [ ] Page still shows Telugu (persisted from localStorage)
4. Select **Urdu** language
5. **Close browser tab** (or all browser windows)
6. Reopen `http://localhost:3000`
   - [ ] Page loads in Urdu (persisted across sessions)

---

### 7. **Test Direction Detection (RTL/LTR)** ➡️ ⬅️

#### Urdu (RTL Testing)
1. Change language to **Urdu** (اردو)
2. Inspect page direction:
   - [ ] Check browser DevTools > Elements
   - [ ] `<html dir="rtl">` should be set
   - [ ] Nav items align right
   - [ ] Text flows right-to-left
3. Change language to **English**
   - [ ] Check: `<html dir="ltr">`
   - [ ] Nav items align left
   - [ ] Text flows left-to-right

---

### 8. **Test Search Functionality** 🔍

#### Search AI Terms
1. Go to "12 Core Concepts" section
2. Find search box: "Search all 85+ terms..."
3. Type term name in current language:
   - [ ] Results appear
   - [ ] Definitions show in current language
   - [ ] Can toggle quiz mode
   - [ ] Can check/uncheck terms

---

### 9. **Test Quiz Mode** ❓

#### Interactive Learning
1. Go to any section
2. Click "QUIZ: OFF" button
3. [ ] Definitions hide
4. [ ] Prompt: "Can you define this concept?"
5. Click "Reveal Definition"
   - [ ] Definition shows in current language
6. [ ] Language-appropriate quiz text

---

### 10. **Test Copy Functionality** 📋

#### Copy Term with Definition
1. In 12 Core Concepts section
2. Hover over any term
3. Click copy icon
4. Paste somewhere (e.g., Notepad)
   - [ ] Format: "Term: Definition"
   - [ ] Definition is in current language (not English)

---

### 11. **Test Navigation** 🧭

#### FloatingNav Links
- [ ] Home: Scrolls to top
- [ ] Curriculum: Scrolls to curriculum section
- [ ] Lessons: Scrolls to lessons
- [ ] 12 Concepts: Scrolls to deeper concepts

#### Mobile Menu
- [ ] Menu opens/closes smoothly
- [ ] Language selector works in mobile menu
- [ ] Navigation items work on mobile

---

### 12. **Test Keyboard Shortcuts** ⌨️

(If available):
- [ ] Ctrl+K: Search
- [ ] Escape: Close modals
- [ ] Arrow keys: Navigate search results
- [ ] Enter: Select search result

---

## 🔴 **Critical Issues to Watch For**

### MUST NOT HAPPEN:
- ❌ English text appearing when Telugu/other language selected
- ❌ AI term definitions in English when language changed
- ❌ Urdu not appearing right-to-left (RTL)
- ❌ Broken styling or layout
- ❌ Console errors in browser DevTools
- ❌ Language not persisting after refresh
- ❌ Missing translations

### SHOULD HAPPEN:
- ✅ Complete language switch (UI + terms + definitions)
- ✅ All 8 languages work equally well
- ✅ Urdu flows right-to-left
- ✅ LocalStorage saves language choice
- ✅ No console errors
- ✅ Smooth animations and transitions
- ✅ Professional design system visible

---

## 📊 Test Results Template

```
Test Date: ______________
Tester: _______________
Browser: _______________
Device: _______________

Language Support:
- [ ] English: PASS / FAIL
- [ ] Hindi: PASS / FAIL
- [ ] Telugu: PASS / FAIL
- [ ] Marathi: PASS / FAIL
- [ ] Tamil: PASS / FAIL
- [ ] Hinglish: PASS / FAIL
- [ ] Urdu: PASS / FAIL
- [ ] Roman Urdu: PASS / FAIL

AI Terms Translation:
- [ ] English definitions: PASS / FAIL
- [ ] Hindi definitions: PASS / FAIL
- [ ] Telugu definitions: PASS / FAIL
- [ ] All other languages: PASS / FAIL

UI/UX:
- [ ] White background: PASS / FAIL
- [ ] Professional design: PASS / FAIL
- [ ] Responsive mobile: PASS / FAIL
- [ ] All animations smooth: PASS / FAIL

RTL Support:
- [ ] Urdu right-to-left: PASS / FAIL
- [ ] All other LTR: PASS / FAIL

LocalStorage:
- [ ] Language persists on refresh: PASS / FAIL
- [ ] Language persists on reopen: PASS / FAIL

Overall: PASS / FAIL

Notes:
_________________________________
_________________________________
```

---

## 🚀 How to Run Tests

### Start Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

### Open DevTools for Testing
```
F12 or Ctrl+Shift+I in browser
```

### Check Console for Errors
```
DevTools > Console tab
Should show: 0 errors
```

### Test LocalStorage
```
DevTools > Application > LocalStorage > http://localhost:3000
Key: clayverse_lang
Value: should change based on language selected
```

### Stop Server
```bash
Ctrl+C in terminal
```

---

## ✅ Success Criteria

**All tests pass when:**
1. ✅ All 8 languages switch completely (UI + terms + definitions)
2. ✅ Telugu translations display correctly (not English)
3. ✅ Urdu displays right-to-left (RTL)
4. ✅ Professional white design system visible
5. ✅ No console errors
6. ✅ Language persists across sessions
7. ✅ Mobile responsive
8. ✅ All animations smooth
9. ✅ Copy functionality works with localized text
10. ✅ Search finds terms in all languages

---

## 📞 Support

If you find any issues:
1. Note the exact issue and language
2. Check browser console for errors (F12)
3. Check localStorage (DevTools > Application)
4. Take screenshot
5. Report with details

---

**Happy Testing! 🎉**
