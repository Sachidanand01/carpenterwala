'use client';
import { useState, useEffect, useRef } from 'react';

const TOUR_DATA = {
  1: [
    {
      target: null,
      title: {
        en: "👋 Welcome to Carpenterwala!",
        hi: "👋 कारपेंटरवाला में आपका स्वागत है!",
        ka: "👋 ಕಾರ್ಪೆಂಟರ್ವಾಲಾಗೆ ಸುಸ್ವಾಗತ!"
      },
      desc: {
        en: "Let's complete your profile in 3 simple steps so Bengaluru customers can book your services. Click 'Start Guide' to begin.",
        hi: "आइए 3 आसान चरणों में आपकी प्रोफाइल पूरी करें ताकि बेंगलुरु के ग्राहक आपको काम दे सकें। शुरू करने के लिए 'आगे बढ़ें' पर क्लिक करें।",
        ka: "ಬೆಂಗಳೂರು ಗ್ರಾಹಕರು ನಿಮ್ಮ ಸೇವೆಗಳನ್ನು ಬುಕ್ ಮಾಡಲು 3 ಸರಳ ಹಂತಗಳಲ್ಲಿ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸೋಣ. ಪ್ರಾರಂಭಿಸಲು 'ಮುಂದೆ' ಕ್ಲಿಕ್ ಮಾಡಿ."
      }
    },
    {
      target: "tour-phone",
      title: {
        en: "📞 Verify Mobile Number",
        hi: "📞 मोबाइल नंबर दर्ज करें",
        ka: "📞 மொಬೈಲ್ ಸಂಖ್ಯೆ ಪರಿಶೀಲಿಸಿ"
      },
      desc: {
        en: "Enter your 10-digit mobile number. We will send you new job leads on this number. It remains private.",
        hi: "अपना 10-अंकों का मोबाइल नंबर दर्ज करें। हम इसी नंबर पर आपको नए काम के ऑर्डर भेजेंगे। यह गुप्त रहेगा।",
        ka: "ನಿಮ್ಮ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ. ಈ ಸಂಖ್ಯೆಗೆ ನಾವು ನಿಮಗೆ ಹೊಸ ಕೆಲಸದ ಲೀಡ್‌ಗಳನ್ನು ಕಳಿಸುತ್ತೇವೆ. ಇದು ಸುರಕ್ಷಿತವಾಗಿರಲಿದೆ."
      }
    },
    {
      target: "tour-experience",
      title: {
        en: "⏳ Years of Experience",
        hi: "⏳ काम का अनुभव",
        ka: "⏳ ಅನುಭವದ ವರ್ಷಗಳು"
      },
      desc: {
        en: "Enter how many years you have been working (e.g. 5 Years). Customers trust experienced pros!",
        hi: "लिखें कि आपको कितने साल का काम का अनुभव है (जैसे: 5 Years)। ग्राहक अनुभवी लोगों को पसंद करते हैं।",
        ka: "ನೀವು ಎಷ್ಟು ವರ್ಷಗಳಿಂದ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ ಎಂದು ಬರೆಯಿರಿ (ಉದಾಹರಣೆಗೆ 5 ವರ್ಷಗಳು). ಗ್ರಾಹಕರು ಅನುಭವಿ ಪ್ರೊಗಳನ್ನು ನಂಬುತ್ತಾರೆ!"
      }
    },
    {
      target: "tour-address",
      title: {
        en: "🏠 Current Address",
        hi: "🏠 आपका पता",
        ka: "🏠 ಪ್ರಸ್ತುತ ವಿಳಾಸ"
      },
      desc: {
        en: "Enter your home or shop address. This helps us find jobs close to you. Customers will not see this address.",
        hi: "अपना घर या दुकान का पता दर्ज करें। इससे हमें आपके पास के काम ढूंढने में मदद मिलेगी। ग्राहक यह पता नहीं देख पाएंगे।",
        ka: "ನಿಮ್ಮ ಮನೆ ಅಥವಾ ಅಂಗಡಿ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ. ಇದು ನಿಮ್ಮ ಹತ್ತಿರದ ಕೆಲಸಗಳನ್ನು ಹುಡುಕಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಗ್ರಾಹಕರು ಈ ವಿಳಾಸವನ್ನು ನೋಡುವುದಿಲ್ಲ."
      }
    },
    {
      target: "tour-about",
      title: {
        en: "👤 About Me",
        hi: "👤 मेरे बारे में",
        ka: "👤 ನನ್ನ ಬಗ್ಗೆ"
      },
      desc: {
        en: "Tell customers about your specialties, quality of work, and working style in 1-2 lines.",
        hi: "ग्राहकों को अपनी खासियत, काम की क्वालिटी और काम करने के तरीके के बारे में 1-2 लाइनों में बताएं।",
        ka: "ಗ್ರಾಹಕರಿಗೆ ನಿಮ್ಮ ಪರಿಣತಿ, ಕೆಲಸದ ಗುಣಮಟ್ಟ ಮತ್ತು ಕೆಲಸದ ಶೈಲಿಯ ಬಗ್ಗೆ 1-2 ಸಾಲುಗಳಲ್ಲಿ ತಿಳಿಸಿ."
      }
    },
    {
      target: "tour-skills",
      title: {
        en: "🔨 Skills & Specialties",
        hi: "🔨 हुनर और कौशल",
        ka: "🔨 ಕೌಶಲ್ಯಗಳು ಮತ್ತು ಪರಿಣತಿಗಳು"
      },
      desc: {
        en: "Write your skills separated by commas. (e.g., Sofa repairs, Modular kitchen, Wooden polish)",
        hi: "कोमा (,) लगाकर अपने हुनर लिखें। (जैसे: सोफा रिपेयर, मॉडलर किचन, पॉलिश)",
        ka: "ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ಅರ್ಧವಿರಾಮಚಿಹ್ನೆಯಿಂದ (,) ಬೇರ್ಪಡಿಸಿ ಬರೆಯಿರಿ. (ಉದಾಹರಣೆಗೆ: ಸೋಫಾ ರಿಪೇರಿ, ಮಾಡ್ಯುಲರ್ ಅಡುಗೆಮನೆ, ವುಡನ್ ಪಾಲಿಶ್)"
      }
    },
    {
      target: "tour-next-btn",
      title: {
        en: "➡️ Go to Next Step",
        hi: "➡️ अगले चरण पर जाएं",
        ka: "➡️ ಮುಂದಿನ ಹಂತಕ್ಕೆ ಹೋಗಿ"
      },
      desc: {
        en: "Click here to save this step and proceed to uploading your documents.",
        hi: "अपनी जानकारी सहेजने के लिए यहाँ क्लिक करें और दस्तावेज़ अपलोड करने के अगले चरण पर जाएँ।",
        ka: "ಈ ಹಂತವನ್ನು ಉಳಿಸಲು ಮತ್ತು ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ."
      }
    }
  ],
  2: [
    {
      target: null,
      title: {
        en: "🆔 Upload Identity Documents",
        hi: "🆔 पहचान पत्र अपलोड करें",
        ka: "🆔 ಗುರುತಿನ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ"
      },
      desc: {
        en: "Please upload clear pictures of your Aadhaar and PAN Card. This is important to verify your profile safety.",
        hi: "कृपया अपने आधार और पैन कार्ड की साफ़ तस्वीरें अपलोड करें। आपकी प्रोफ़ाइल सुरक्षा के लिए यह आवश्यक है।",
        ka: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಧಾರ್ ಮತ್ತು ಪ್ಯಾನ್ ಕಾರ್ಡ್‌ನ ಸ್ಪಷ್ಟ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪರಿಶೀಲನೆಗೆ ಇದು ಮುಖ್ಯವಾಗಿದೆ."
      }
    },
    {
      target: "tour-aadhaar-front",
      title: {
        en: "📇 Aadhaar Front Side",
        hi: "📇 आधार का अगला हिस्सा",
        ka: "📇 ಆಧಾರ್ ಮುಂಭಾಗ"
      },
      desc: {
        en: "Click here to take a photo or upload the FRONT side of your Aadhaar card.",
        hi: "अपने आधार कार्ड के अगले हिस्से की फोटो खींचने या अपलोड करने के लिए यहाँ क्लिक करें।",
        ka: "ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್‌ನ ಮುಂಭಾಗದ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ."
      }
    },
    {
      target: "tour-aadhaar-back",
      title: {
        en: "📇 Aadhaar Back Side",
        hi: "📇 आधार का पिछला हिस्सा",
        ka: "📇 ಆಧಾರ್ ಹಿಂಭಾಗ"
      },
      desc: {
        en: "Click here to upload the BACK side of your Aadhaar card showing your address details.",
        hi: "पता विवरण दिखाने वाले अपने आधार कार्ड के पिछले हिस्से को अपलोड करने के लिए यहाँ क्लिक करें।",
        ka: "ನಿಮ್ಮ ವಿಳಾಸದ ವಿವರಗಳನ್ನು ಹೊಂದಿರುವ ಆಧಾರ್ ಕಾರ್ಡ್‌ನ ಹಿಂಭಾಗದ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ."
      }
    },
    {
      target: "tour-pan-front",
      title: {
        en: "💳 PAN Card Front Side",
        hi: "💳 पैन कार्ड का अगला हिस्सा",
        ka: "💳 ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಮುಂಭಾಗ"
      },
      desc: {
        en: "Click here to upload the front side of your PAN Card. Make sure details are clearly readable.",
        hi: "अपने पैन कार्ड का अगला हिस्सा अपलोड करने के लिए यहाँ क्लिक करें। सुनिश्चित करें कि नाम और नंबर साफ़ दिख रहे हों।",
        ka: "ನಿಮ್ಮ ಪ್ಯಾನ್ ಕಾರ್ಡ್‌ನ ಮುಂಭಾಗದ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ. ವಿವರಗಳು ಸ್ಪಷ್ಟವಾಗಿರಲಿ."
      }
    },
    {
      target: "tour-next-btn",
      title: {
        en: "➡️ Save & Continue",
        hi: "➡️ सहेजें और आगे बढ़ें",
        ka: "➡️ ಉಳಿಸಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ"
      },
      desc: {
        en: "Click here to save your ID documents and move to the background check upload step.",
        hi: "अपने पहचान पत्रों को सहेजने और बैकग्राउंड वेरिफिकेशन पर जाने के लिए यहाँ क्लिक करें।",
        ka: "ನಿಮ್ಮ ಗುರುತಿನ ದಾಖಲೆಗಳನ್ನು ಉಳಿಸಲು ಮತ್ತು ಮುಂದಿನ ಹಂತಕ್ಕೆ ಹೋಗಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ."
      }
    }
  ],
  3: [
    {
      target: null,
      title: {
        en: "🛡️ Trust & Safety Checks",
        hi: "🛡️ भरोसा और सुरक्षा जांच",
        ka: "🛡️ ವಿಶ್ವಾಸಾರ್ಹತೆ ಮತ್ತು ಸುರಕ್ಷತೆ ಪರಿಶೀಲನೆ"
      },
      desc: {
        en: "Upload your photo and police certificate. This helps customers trust you and gives you more work.",
        hi: "अपनी फोटो and पुलिस वेरिफिकेशन अपलोड करें। इससे ग्राहकों का आप पर भरोसा बढ़ेगा और अधिक काम मिलेगा।",
        ka: "ನಿಮ್ಮ ಭಾವಚಿತ್ರ ಮತ್ತು ಪೊಲೀಸ್ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಇದು ಗ್ರಾಹಕರು ನಿಮ್ಮನ್ನು ನಂಬಲು ಮತ್ತು ಹೆಚ್ಚಿನ ಕೆಲಸ ಪಡೆಯಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ."
      }
    },
    {
      target: "tour-avatar",
      title: {
        en: "👤 Public Profile Photo",
        hi: "👤 प्रोफाइल फोटो",
        ka: "👤 ಸಾರ್ವಜನಿಕ ಪ್ರೊಫೈಲ್ ಭಾವಚಿತ್ರ"
      },
      desc: {
        en: "Upload a clear, smiling picture of yourself. Customers see this photo when booking you.",
        hi: "अपनी एक साफ़ और मुस्कुराती हुई तस्वीर अपलोड करें। ग्राहक बुकिंग करते समय इसी फोटो को देखते हैं।",
        ka: "ನಿಮ್ಮ ಸ್ಪಷ್ಟ ಮತ್ತು ಮುಗುಳ್ನಗುವಿನ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಗ್ರಾಹಕರು ಬುಕ್ಕಿಂಗ್ ಮಾಡುವಾಗ ಈ ಭಾವಚಿತ್ರವನ್ನು ನೋಡುತ್ತಾರೆ."
      }
    },
    {
      target: "tour-voter-front",
      title: {
        en: "🪪 Voter ID or Driving License",
        hi: "🪪 वोटर आईडी या ड्राइविंग लाइसेंस",
        ka: "🪪 ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ ಅಥವಾ ಚಾಲನಾ ಪರವಾನಗಿ"
      },
      desc: {
        en: "Upload the front scan of your Voter Card or Driving License for second address verification.",
        hi: "पते के दूसरे प्रमाण के लिए अपनी वोटर आईडी या ड्राइविंग लाइसेंस का अगला हिस्सा अपलोड करें।",
        ka: "ದ್ವಿತೀಯ ವಿಳಾಸ ಪರಿಶೀಲನೆಗಾಗಿ ನಿಮ್ಮ ಮತದಾರರ ಚೀಟಿ ಅಥವಾ ಚಾಲನಾ ಪರವಾನಗಿಯ ಮುಂಭಾಗದ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
      }
    },
    {
      target: "tour-police",
      title: {
        en: "👮 Police Verification Certificate",
        hi: "👮 पुलिस वेरिफिकेशन प्रमाण पत्र",
        ka: "👮 ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ ಪ್ರಮಾಣಪತ್ರ"
      },
      desc: {
        en: "Upload a copy of your police verification certificate. This is mandatory to verify you as a trusted professional.",
        hi: "अपने पुलिस वेरिफिकेशन प्रमाण पत्र की एक कॉपी अपलोड करें। सुरक्षित और भरोसेमंद लिस्टिंग के लिए यह अनिवार्य है।",
        ka: "ನಿಮ್ಮ ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ ಪ್ರಮಾಣಪತ್ರದ ಪ್ರತಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ನಂಬಿಕಸ್ಥ ವೃತ್ತಿಪರರಾಗಿ ಪರಿಶೀಲಿಸಲು ಇದು ಕಡ್ಡಾಯವಾಗಿದೆ."
      }
    },
    {
      target: "tour-next-btn",
      title: {
        en: "➡️ Save & Go to Review",
        hi: "➡️ सहेजें और समीक्षा करें",
        ka: "➡️ ಉಳಿಸಿ ಮತ್ತು ಪರಿಶೀಲನೆಗೆ ಹೋಗಿ"
      },
      desc: {
        en: "Click here to proceed to the final review step.",
        hi: "अंतिम समीक्षा चरण पर जाने के लिए यहाँ क्लिक करें।",
        ka: "ಅಂತಿಮ ಪರಿಶೀಲನಾ ಹಂತಕ್ಕೆ ಹೋಗಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ."
      }
    }
  ],
  4: [
    {
      target: "tour-summary",
      title: {
        en: "🔎 Review Your Details",
        hi: "🔎 अपनी जानकारी जांचें",
        ka: "🔎 ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ"
      },
      desc: {
        en: "Check if your name, mobile, address, and skills are correct. Click 'Previous Step' at the bottom to fix any mistake.",
        hi: "जांचें कि आपका नाम, मोबाइल, पता और हुनर सही हैं या नहीं। सुधार करने के लिए नीचे 'Previous Step' पर क्लिक करें।",
        ka: "ನಿಮ್ಮ ಹೆಸರು, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ, ವಿಳಾಸ ಮತ್ತು ಕೌಶಲ್ಯಗಳು ಸರಿಯಾಗಿವೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ. ಯಾವುದೇ ತಪ್ಪುಗಳಿದ್ದರೆ ಸರಿಪಡಿಸಲು ಕೆಳಭಾಗದ 'ಹಿಂದಿನ ಹಂತ' ಕ್ಲಿಕ್ ಮಾಡಿ."
      }
    },
    {
      target: "tour-submit",
      title: {
        en: "🚀 Submit Profile",
        hi: "🚀 प्रोफाइल सबमिट करें",
        ka: "🚀 ಪ್ರೊಫೈಲ್ ಸಲ್ಲಿಸಿ"
      },
      desc: {
        en: "Click this button to submit your profile. Our team will verify your documents and activate your listing within 24 hours!",
        hi: "अपनी प्रोफाइल सबमिट करने के लिए यहाँ क्लिक करें। हमारी टीम आपके दस्तावेजों की जांच कर 24 घंटे में आपकी प्रोफाइल सक्रिय कर देगी!",
        ka: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸಲ್ಲಿಸಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ. ನಮ್ಮ ತಂಡವು ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ 24 ಗಂಟೆಗಳಲ್ಲಿ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುತ್ತದೆ!"
      }
    }
  ]
};

export default function ProGuidedTour({ onboardStep, onComplete, isActive, setIsActive }) {
  const [lang, setLang] = useState('en'); // en, hi, ka
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState(null);

  const steps = TOUR_DATA[onboardStep] || [];
  const currentStep = steps[currentIndex];

  // Reset tour index when the wizard page step changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [onboardStep]);

  // Handle local storage to get language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('pro_tour_lang');
    if (savedLang) setLang(savedLang);
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('pro_tour_lang', newLang);
  };

  // Update spotlight rect position based on targeted DOM element
  const updateSpotlight = () => {
    if (!isActive || !currentStep || !currentStep.target) {
      setSpotlightRect(null);
      return;
    }

    const el = document.getElementById(currentStep.target);
    if (el) {
      // Scroll target into center view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Calculate coordinates after scroll/layout settling
      setTimeout(() => {
        const rect = el.getBoundingClientRect();
        setSpotlightRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }, 150);
    } else {
      setSpotlightRect(null);
    }
  };

  useEffect(() => {
    updateSpotlight();

    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight);

    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
    };
  }, [currentIndex, onboardStep, isActive]);

  if (!isActive || steps.length === 0) return null;

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // End of this wizard step's tour
      setIsActive(false);
      if (onboardStep === 4 && onComplete) {
        onComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    localStorage.setItem('pro_tour_dismissed', 'true');
  };

  const hasTarget = !!currentStep.target;

  return (
    <>
      {/* Dark Backdrop overlay */}
      {hasTarget && spotlightRect ? (
        // Draw spotlight borders
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9990,
          pointerEvents: 'none',
        }}>
          {/* Spotlight cutout border */}
          <div style={{
            position: 'fixed',
            top: spotlightRect.top - 6,
            left: spotlightRect.left - 6,
            width: spotlightRect.width + 12,
            height: spotlightRect.height + 12,
            borderRadius: '12px',
            boxShadow: '0 0 0 99999px rgba(15, 23, 42, 0.82)',
            border: '3px solid var(--accent)',
            zIndex: 9991,
            pointerEvents: 'none',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      ) : (
        // Standard full-page dark background overlay
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(3px)',
          zIndex: 9990,
          pointerEvents: 'auto',
          transition: 'all 0.3s ease'
        }} onClick={handleNext} />
      )}

      {/* Floating Tour Guide / Instructions Box */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '540px',
        background: 'rgba(23, 37, 84, 0.95)', // Deep blue-tinted card for contrast
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
        zIndex: 9995,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: 'white',
      }}>
        {/* Helper Header & Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.8rem' }}>👷‍♂️</span>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {lang === 'en' && 'Profile Helper'}
                {lang === 'hi' && 'प्रोफाइल सहायक'}
                {lang === 'ka' && 'ಪ್ರೊಫೈಲ್ ಸಹಾಯ'}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                {lang === 'en' && `Step ${onboardStep} of 4 · Info ${currentIndex + 1}/${steps.length}`}
                {lang === 'hi' && `चरण ${onboardStep}/4 · जानकारी ${currentIndex + 1}/${steps.length}`}
                {lang === 'ka' && `ಹಂತ ${onboardStep}/4 · ಮಾಹಿತಿ ${currentIndex + 1}/${steps.length}`}
              </div>
            </div>
          </div>

          {/* Languages Selector */}
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2px' }}>
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'ka', label: 'ಕನ್ನಡ (Kan)' }
            ].map(l => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  background: lang === l.code ? 'var(--accent)' : 'transparent',
                  color: lang === l.code ? '#0f172a' : 'rgba(255,255,255,0.8)',
                  transition: 'all 0.2s',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Instruction Message */}
        <div style={{ minHeight: '60px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>
            {currentStep.title[lang]}
          </h4>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.9 }}>
            {currentStep.desc[lang]}
          </p>
        </div>

        {/* Controls footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600,
              textDecoration: 'underline',
              padding: '0.5rem 0',
            }}
          >
            {lang === 'en' && 'Skip Guide'}
            {lang === 'hi' && 'गाइड बंद करें'}
            {lang === 'ka' && 'ಸಹಾಯ ಮುಚ್ಚಿ'}
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentIndex > 0 && (
              <button
                onClick={handleBack}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                ← {lang === 'en' && 'Back'}
                {lang === 'hi' && 'पीछे'}
                {lang === 'ka' && 'ಹಿಂದೆ'}
              </button>
            )}

            <button
              onClick={handleNext}
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {currentIndex < steps.length - 1 ? (
                <>
                  {lang === 'en' && 'Got It / Next →'}
                  {lang === 'hi' && 'समझ गए / आगे →'}
                  {lang === 'ka' && 'ಅರ್ಥವಾಯಿತು / ಮುಂದೆ →'}
                </>
              ) : (
                <>
                  {lang === 'en' && 'Close Guide ✓'}
                  {lang === 'hi' && 'गाइड समाप्त ✓'}
                  {lang === 'ka' && 'ಸಹಾಯ ಮುಗಿಸಿ ✓'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
