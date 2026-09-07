/**
 * Clay Personality System
 * Makes Clay an interactive, friendly talking AI instructor throughout Clayverse
 */

export interface ClayMessage {
  id: string;
  text: string;
  textLocalized?: Record<string, string>;
  emotion: 'happy' | 'thinking' | 'excited' | 'helpful' | 'encouraging' | 'confused';
  context: 'greeting' | 'explanation' | 'motivation' | 'celebration' | 'question' | 'warning' | 'tip';
  audioUrl?: string;
}

export type Language = 'en' | 'hi' | 'te' | 'mr' | 'ta' | 'ur' | 'roman_ur' | 'hinglish';

// Clay's greeting messages
export const CLAY_GREETINGS: Record<Language, string[]> = {
  en: [
    "Hey there! I'm Clay, your friendly AI instructor! Ready to learn together? 🤖✨",
    "Welcome back! I'm so excited to help you explore the world of AI today! 🚀",
    "Hello! I'm Clay, your AI buddy. Let's make learning fun and easy! 😊",
    "Hi friend! Ready for an amazing learning journey with Clay? Let's go! 💡",
  ],
  hi: [
    "नमस्ते! मैं क्ले हूँ, आपका दोस्ताना एआई शिक्षक! क्या सीखने के लिए तैयार हो? 🤖✨",
    "स्वागत है! मैं आज आपको एआई की दुनिया में मदद करने के लिए बहुत उत्सुक हूँ! 🚀",
    "नमस्ते! मैं क्ले हूँ, आपका एआई दोस्त। आइए सीखना मजेदार बनाएं! 😊",
  ],
  te: [
    "నమస్కారం! నేను క్లే, మీ స్నేహపూర్వక AI పాఠకుడు! నేర్చుకోవడానికి సిద్ధమైనారా? 🤖✨",
    "స్వాగతం! AI ప్రపంచాన్ని అన్వేషించడానికి నేను ఈ రోజు చాలా ఆసక్తితో ఉన్నాను! 🚀",
    "హలో! నేను క్లే, మీ AI స్నేహితుడు. నేర్చుకోవటం సరదాగా చేద్దాం! 😊",
  ],
  mr: [
    "नमस्कार! मी क्ले आहे, तुमचा मैत्रीपूर्ण AI शिक्षक! शिकण्यास तयार आहे? 🤖✨",
    "स्वागत आहे! मी आज तुम्हाला AI च्या जगातून मदत करण्यास खूप उत्सुक आहे! 🚀",
    "नमस्कार! मी क्ले आहे, तुमचा AI मित्र. शिकणे मजेदार बनवू! 😊",
  ],
  ta: [
    "வணக்கம்! நான் கிளே, உங்கள் நண்பர்களான AI பாடசாலை ஆசிரியர்! கற்கத் தயாரா? 🤖✨",
    "வரவேற்கிறோம்! நான் இன்று AI உலகை அன்வேஷிக்க மிகவும் உற்சாहமாக இருக்கிறேன்! 🚀",
    "வணக்கம்! நான் கிளே, உங்கள் AI நண்பர். கற்றலை சுவாரஸ்யமாக்குவோம்! 😊",
  ],
  ur: [
    "السلام علیکم! میں کلے ہوں، آپ کا دوستانہ AI اسکول ٹیچر! سیکھنے کے لیے تیار ہو؟ 🤖✨",
    "خوش آمدید! میں آج AI کی دنیا کو دریافت کرنے میں بہت پرجوش ہوں! 🚀",
    "ہیلو! میں کلے ہوں، آپ کا AI دوست۔ سیکھنا مزے دار بنائیں! 😊",
  ],
  roman_ur: [
    "Assalam-o-alaikum! Main Clay hoon, tumhara dost ane AI teacher! Seekhne ke liye tayyar ho? 🤖✨",
    "Khush aamideed! Main aaj AI ki duniya ko discover karne mein bohat excited hoon! 🚀",
    "Hello! Main Clay hoon, tumhara AI dost. Sekhna mazedaar banate hain! 😊",
  ],
  hinglish: [
    "Hey! Main Clay hoon, tumhara friendly AI instructor! Ready to learn together? 🤖✨",
    "Welcome! Mujhe aaj AI ki duniya explore karne mein bilkul excitement hai! 🚀",
    "Hi friend! Main Clay hoon, tumhara AI buddy. Seekhna fun banate hain! 😊",
  ],
};

// Clay's encouragement messages
export const CLAY_ENCOURAGEMENT: Record<Language, string[]> = {
  en: [
    "You're doing amazing! Keep going! 🌟",
    "That's the spirit! I knew you could do it! 💪",
    "Fantastic progress! You're becoming an AI expert! 🚀",
    "Wow! You really get this! Keep rocking! 🎉",
    "I'm so proud of you! You're learning so fast! 📈",
  ],
  hi: [
    "तुम शानदार कर रहे हो! आगे बढ़ते रहो! 🌟",
    "यही सही रवैया है! मुझे पता था तुम कर सकते हो! 💪",
    "शानदार प्रगति! तुम एक AI विशेषज्ञ बन रहे हो! 🚀",
    "वाह! तुम सच में समझ रहे हो! आगे बढ़ते रहो! 🎉",
  ],
  te: [
    "మీరు అద్భుతంగా చేస్తున్నారు! ముందుకు సాగండి! 🌟",
    "అదే సరైన మనోభావం! మీరు చేయగలరని నాకు తెలుసు! 💪",
    "అద్భుత పురోగతి! మీరు AI నిపుణుడు అవుతున్నారు! 🚀",
  ],
  mr: [
    "तुम अद्भुत काम कर रहे आहे! पुढे व्या! 🌟",
    "हीच सोबत मनोवृत्ती! मला माहिती होती की तुम करू शकतात! 💪",
    "शानदार प्रगती! तुम AI तज्ञ बनत आहे! 🚀",
  ],
  ta: [
    "நீங்கள் அருமையாகச் செய்கிறீர்கள்! முன்னால் செல்லுங்கள்! 🌟",
    "அதுவே சரியான மனோபாவம்! நீங்கள் செய்யமுடியும் என்று எனக்குத் தெரியும்! 💪",
    "சிறப்பான முன்னேற்றம்! நீங்கள் AI நிபுணர் ஆகிறீர்கள்! 🚀",
  ],
  ur: [
    "آپ بہترین کام کر رہے ہیں! آگے بڑھتے رہیں! 🌟",
    "یہی صحیح رویہ ہے! مجھے معلوم تھا کہ آپ کر سکتے ہیں! 💪",
    "شاندار ترقی! آپ ایک AI ماہر بن رہے ہیں! 🚀",
  ],
  roman_ur: [
    "Aap bahut acha kar rahe ho! Aage badho! 🌟",
    "Yeh sahi approach hai! Mujhe pata tha aap kar sakte ho! 💪",
    "Shandaar tarakki! Aap AI expert ban rahe ho! 🚀",
  ],
  hinglish: [
    "Tum fantastic kar rahe ho! Aage chalte raho! 🌟",
    "That's the spirit! Mujhe pata tha tu kar payega! 💪",
    "Amazing progress! Tu AI expert ban raha hai! 🚀",
  ],
};

// Clay's tips and tricks
export const CLAY_TIPS: Record<Language, string[]> = {
  en: [
    "💡 Tip: Take notes while learning - it helps your brain remember better!",
    "💡 Pro Tip: Pause videos and try to explain concepts in your own words!",
    "💡 Quick Tip: Practice examples after theory to really understand!",
    "💡 Insider Tip: AI is based on simple math - don't get intimidated!",
    "💡 Learning Tip: Review topics regularly to reinforce your knowledge!",
  ],
  hi: [
    "💡 सुझाव: सीखते समय नोट्स लें - यह आपके मस्तिष्क को याद रखने में मदद करता है!",
    "💡 प्रो सुझाव: वीडियो को रोकें और अवधारणाओं को अपने शब्दों में समझाने का प्रयास करें!",
    "💡 त्वरित सुझाव: वास्तव में समझने के लिए सिद्धांत के बाद उदाहरणों का अभ्यास करें!",
    "💡 अंदरूनी सुझाव: एआई सरल गणित पर आधारित है - डरो मत!",
  ],
  te: [
    "💡 సూచన: నేర్చుకుంటున్నప్పుడు నోట్‌లు తీయండి - ఇది మీ మెదడును గుర్తుంచుకోవడానికి సహాయపడుతుంది!",
    "💡 ప్రో సూచన: వీడియోలను పాజ్ చేసి, భావనలను మీ స్వంత పదాలలో వివరించటానికి ప్రయత్నించండి!",
  ],
  mr: [],
  ta: [],
  ur: [],
  roman_ur: [],
  hinglish: [],
};

// Clay's celebration messages
export const CLAY_CELEBRATIONS: Record<Language, string[]> = {
  en: [
    "🎉 Awesome! You completed this lesson!",
    "🚀 Incredible! You're on a learning streak!",
    "⭐ Fantastic! You're becoming an AI master!",
    "🏆 Champion! You crushed that lesson!",
    "💫 Brilliant! Your AI knowledge is growing!",
  ],
  hi: [
    "🎉 शानदार! आपने यह पाठ पूरा किया!",
    "🚀 अविश्वसनीय! आप सीखने के मूड में हैं!",
    "⭐ शानदार! आप एक AI मास्टर बन रहे हैं!",
    "🏆 चैंपियन! आपने उस पाठ को शानदार तरीके से किया!",
  ],
  te: [
    "🎉 అద్భుతం! మీరు ఈ పాఠాన్ని పూర్తి చేసారు!",
    "🚀 అదృశ్యమైనది! మీరు నేర్చుకోవడానికి ఉంచారు!",
  ],
  mr: [],
  ta: [],
  ur: [],
  roman_ur: [],
  hinglish: [],
};

/**
 * Get a random greeting message from Clay
 */
export function getClayGreeting(language: Language): ClayMessage {
  const messages = CLAY_GREETINGS[language] || CLAY_GREETINGS.en;
  const text = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: `greeting-${Date.now()}`,
    text,
    emotion: 'happy',
    context: 'greeting',
  };
}

/**
 * Get a random encouragement message from Clay
 */
export function getClayEncouragement(language: Language): ClayMessage {
  const messages = CLAY_ENCOURAGEMENT[language] || CLAY_ENCOURAGEMENT.en;
  const text = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: `encouragement-${Date.now()}`,
    text,
    emotion: 'encouraging',
    context: 'motivation',
  };
}

/**
 * Get a random tip from Clay
 */
export function getClayTip(language: Language): ClayMessage {
  const tips = CLAY_TIPS[language] || CLAY_TIPS.en;
  const text = tips[Math.floor(Math.random() * tips.length)];

  return {
    id: `tip-${Date.now()}`,
    text,
    emotion: 'thinking',
    context: 'tip',
  };
}

/**
 * Get a random celebration message from Clay
 */
export function getClayACelebration(language: Language): ClayMessage {
  const messages = CLAY_CELEBRATIONS[language] || CLAY_CELEBRATIONS.en;
  const text = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: `celebration-${Date.now()}`,
    text,
    emotion: 'excited',
    context: 'celebration',
  };
}

export default {
  getClayGreeting,
  getClayEncouragement,
  getClayTip,
  getClayACelebration,
};
