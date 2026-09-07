import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TalkingClaybot from './TalkingClaybot';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';

interface ClaybotIntroductionProps {
  className?: string;
  autoPlay?: boolean;
}

// AI-friendly translations for Claybot introduction
const claybotMessages: Record<string, Record<string, string>> = {
  en: {
    welcome: "Hello! I'm Clay, your AI learning companion! I'm here to help you understand artificial intelligence in a fun and easy way. Click on me to hear more!",
    whatIsAI: "Artificial Intelligence is like giving computers a brain! It helps machines learn from examples, make decisions, and solve problems just like humans do.",
    learning: "I'll explain complex AI concepts using simple examples. No complicated math, no confusing jargon - just clear, friendly explanations!",
    curious: "Curious about AI? Let's explore together! From neural networks to machine learning, I've got all the answers you need.",
  },
  hi: {
    welcome: "नमस्ते! मैं Clay हूँ, आपका AI सीखने का साथी! मैं आपको कृत्रिम बुद्धिमत्ता को मजेदार और आसान तरीके से समझने में मदद करने के लिए यहाँ हूँ। मुझ पर क्लिक करें!",
    whatIsAI: "कृत्रिम बुद्धिमत्ता कंप्यूटर को दिमाग देने जैसी है! यह मशीनों को उदाहरणों से सीखने, फैसले लेने और समस्याओं को हल करने में मदद करती है।",
    learning: "मैं जटिल AI अवधारणाओं को सरल उदाहरणों से समझाता हूँ। कोई जटिल गणित नहीं, कोई भ्रामक शब्दावली नहीं - बस स्पष्ट, मित्रवत व्याख्या!",
    curious: "AI के बारे में उत्सुक हैं? चलिए एक साथ खोज करते हैं! न्यूरल नेटवर्क से लेकर मशीन लर्निंग तक, मेरे पास सभी जवाब हैं।",
  },
  te: {
    welcome: "హలో! నేను క్లే, మీ AI నేర్చుకోవడం సహచరుడు! నేను కృత్రిమ బుద్ధిమత్తను సరళమైన మరియు సరదాగా నేర్చుకోవడానికి మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను.",
    whatIsAI: "కృత్రిమ బుద్ధిమత్త కంప్యూటర్‌కు మెదడు ఇచ్చినట్లుంటుంది! ఇది యంత్రాలను ఉదాహరణల నుండి నేర్చుకోవడానికి, నిర్ణయాలు తీసుకోవడానికి సహాయం చేస్తుంది.",
    learning: "నేను సంక్లిష్ట AI భావనలను సరళ ఉదాహరణలతో వివరిస్తాను. సంక్లిష్ట గణితం లేదు, గందరగోళ పదజాలం లేదు - కేవలం స్పష్టమైన, స్నేహపూర్వక వివరణలు!",
    curious: "AI గురించి ఆసక్తి ఉందా? కలిసి అన్వేషణ చేద్దాం! న్యూరల్ నెట్‌వర్క్‌ల నుండి మెషిన్ లర్నింగ్ వరకు, నాకు అన్ని సమాధానాలు ఉన్నాయి.",
  },
  mr: {
    welcome: "नमस्कार! मी Clay आहे, तुमचा AI शिक्षण सहचर! कृत्रिम बुद्धिमत्ता समजून घेण्यासाठी मी तुम्हाला मजेदार आणि सोपा मार्ग दाखवण्यासाठी येथे आहे। मुझ क्लिक करा!",
    whatIsAI: "कृत्रिम बुद्धिमत्ता हे संगणकाला मेंदू देणे सारखे आहे! हे मशीनला उदाहरणांपासून शिकणे, निर्णय घेणे आणि समस्या सोडवणे शिकवते.",
    learning: "मी जटिल AI संकल्पनांचे साधे उदाहरणांद्वारे स्पष्टीकरण करतो. कोणतेही क्लिष्ट गणित नाही, कोणतीही गोंधळलेली शब्दावली नाही - फक्त स्पष्ट, मैत्रीपूर्ण स्पष्टीकरण!",
    curious: "AI बद्दल कुतूहल आहे का? चला एकत्रितपणे अन्वेषण करूया! न्यूरल नेटवर्कपासून मशीन लर्निंगपर्यंत, माझ्याकडे सर्व उत्तरे आहेत।",
  },
  ta: {
    welcome: "வணக்கம்! நான் Clay, உங்கள் AI கற்றல் தோழி! செயற்கை நுண்ணறிவை재미있는மற்றும் எளிய வழியில் புரிந்துகொள்ள நான் உங்களுக்கு உதவ இங்கே உள்ளேன். என்னை கிளிக் செய்யுங்கள்!",
    whatIsAI: "செயற்கை நுண்ணறிவு என்பது கணினிக்கு மூளை கொடுப்பது போலாகும்! இது இயந்திரங்களுக்கு எடுத்துக்காட்டுகளிலிருந்து கற்க, முடிவுகளை எடுக்க உதவுகிறது.",
    learning: "நான் சிக்கலான AI கருத்துக்களை எளிய உदாহரணங்கள் மூலம் விளக்குகிறேன். சிக்கலான கணிதம் இல்லை, குழப்பமான சொல்லளவு இல்லை - வெறும் தெளிவான, நட்பு விளக்கங்கள்!",
    curious: "AI பற்றி ஆவலுடன் இருக்கிறீர்களா? ஒன்றாக ஆய்வு செய்வோம்! நியூரல் நெட்வொர்க்குகள் முதல் இயந்திர கற்றல் வரை, எனக்கு எல்லா பதிலுகளும் உள்ளன.",
  },
  ur: {
    welcome: "السلام علیکم! میں Clay ہوں، آپ کا AI سیکھنے کا ساتھی! مصنوعی ذہانت کو مزے دار اور آسان طریقے سے سمجھنے میں آپ کی مدد کے لیے یہاں ہوں۔ مجھے کلک کریں!",
    whatIsAI: "مصنوعی ذہانت کمپیوٹر کو دماغ دینے جیسی ہے! یہ مشینوں کو مثالوں سے سیکھنے، فیصلے لینے میں مدد دیتی ہے۔",
    learning: "میں پیچیدہ AI تصورات کو سادہ مثالوں سے سمجھاتا ہوں۔ کوئی پیچیدہ ریاضی نہیں، کوئی الجھن والی اصطلاحات نہیں - بس صاف، دوستانہ وضاحت!",
    curious: "کیا AI میں فضول ہیں؟ آئیے ایک ساتھ تلاش کریں! نیورل نیٹ ورک سے لے کر مشین لرننگ تک، میرے پاس سب جوابات ہیں۔",
  },
  roman_ur: {
    welcome: "Assalam-o-Alaikum! Main Clay hoon, tumhara AI seekhne ka saathi! Mausnooi zehanat ko maze dar aur aasan tarike se samjhne mein tum ki madad k liye yahan hoon. Mujhe click karo!",
    whatIsAI: "Mausnooi zehanat computer ko dimaag dene jaisi hai! Yeh masheeno ko misal se seekhne, faisale lene mein madad deti hai.",
    learning: "Main pechida AI tasawwur ko sada misal se samjhata hoon. Koi pechida riyaziat nahi, koi iljha wali istalahat nahi - bas saaf, dostana wazahat!",
    curious: "Kya AI mein fazoolu hain? Aaiye ek saath talash karein! Neural Network se le kar Machine Learning tak, mere paas sab jawabat hain.",
  },
  hinglish: {
    welcome: "Namaste! Main hoon Clay, aapka AI learning companion! Artificial intelligence ko fun aur easy way mein samjhne ke liye main yahan hoon. Mujhe click karo!",
    whatIsAI: "Artificial intelligence matlab computer ko brain dena! Yeh machines ko examples se sikhata hai, decisions lene mein madad karta hai.",
    learning: "Main complex AI concepts ko simple examples se explain karta hoon. Koi complicated math nahi, koi confusing words nahi - bas clear, friendly explanations!",
    curious: "Kya AI ke baare mein curious ho? Chalo sath mein explore karein! Neural networks se machine learning tak, mere paas sab answers hain.",
  },
};

export default function ClaybotIntroduction({
  className = '',
  autoPlay = true,
}: ClaybotIntroductionProps) {
  const { lang, t } = useLanguageMultilingual();
  const [selectedMessage, setSelectedMessage] = useState<keyof typeof claybotMessages['en']>('welcome');
  const currentMessage = claybotMessages[lang as keyof typeof claybotMessages]?.[selectedMessage] || 
                        claybotMessages.en[selectedMessage];

  return (
    <div className={`w-full py-12 ${className}`}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Meet Clay, Your AI Guide 🤖
          </h2>
          <p className="text-gray-600">
            Click on Clay to hear explanations in your language
          </p>
        </div>

        {/* Claybot */}
        <div className="flex justify-center mb-8">
          <TalkingClaybot 
            size={180}
            defaultMessage={currentMessage}
            autoPlay={autoPlay}
          />
        </div>

        {/* Message Selection Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {(['welcome', 'whatIsAI', 'learning', 'curious'] as const).map((key) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMessage(key)}
              className={`p-3 rounded-lg font-semibold text-sm transition-all ${
                selectedMessage === key
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {key === 'welcome' && '👋 Welcome'}
              {key === 'whatIsAI' && '🧠 What is AI?'}
              {key === 'learning' && '📚 Learning'}
              {key === 'curious' && '🔍 Curious?'}
            </motion.button>
          ))}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-lg border border-orange-200"
        >
          <h3 className="font-semibold text-gray-900 mb-2">💡 Try Me Out!</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Click on me to hear explanations</li>
            <li>✓ Change your language to hear translations</li>
            <li>✓ Click different buttons to hear different topics</li>
            <li>✓ Works in all 8 supported languages</li>
          </ul>
        </motion.div>

        {/* Feature Badges */}
        <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-3 text-center">
          {['🎤 Voice', '🌍 8 Languages', '🎯 Clear', '😊 Friendly', '📚 Educational', '⚡ Interactive'].map((feature, i) => (
            <div key={i} className="text-xs font-semibold text-gray-600 bg-white p-2 rounded-lg border border-gray-200">
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
