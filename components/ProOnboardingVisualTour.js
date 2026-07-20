'use client';

import { useState } from 'react';
import Link from 'next/link';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' }
];

const POLICE_VERIFICATION_DATA = {
  up: {
    state: 'Uttar Pradesh (UP)',
    portal: 'https://uppolice.gov.in',
    appName: 'UPCOP App (Android & iOS)',
    fee: '₹50',
    time: '10–15 Days',
    steps: {
      en: 'Download UPCOP App → Click Citizen Services → Select Character Certificate → Pay ₹50 via UPI → Local police station verifies address → Download certificate.',
      hi: 'UPCOP ऐप डाउनलोड करें → नागरिक सेवाएं चुनें → चरित्र प्रमाण पत्र पर क्लिक करें → UPI से ₹50 शुल्क भरें → पुलिस स्टेशन सत्यापन के बाद डाउनलोड करें।',
      kn: 'UPCOP ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ → ಸಿಟಿಜನ್ ಸರ್ವೀಸಸ್ ಆಯ್ಕೆಮಾಡಿ → ಕ್ಯಾರಕ್ಟರ್ ಸರ್ಟಿಫಿಕೇಟ್ ಕ್ಲಿಕ್ ಮಾಡಿ → ₹50 ಪಾವತಿಸಿ.',
      ta: 'UPCOP செயலியைப் பதிவிறக்கவும் → குடிமக்கள் சேவைகள் → சான்றொப்பச் சான்றிதழ் → ₹50 கட்டணம் செலுத்துங்கள்.',
      te: 'UPCOP యాప్ డౌన్‌లోడ్ చేసుకోండి → సిటిజన్ సర్వీసెస్ ఎంచుకోండి → క్యారెక్టర్ సర్టిఫికెట్ క్లిక్ చేయండి → ₹50 చెల్లించండి.'
    }
  },
  bihar: {
    state: 'Bihar',
    portal: 'https://serviceonline.bihar.gov.in',
    appName: 'RTPS Bihar Portal',
    fee: 'Nominal / Free',
    time: '14 Days',
    steps: {
      en: 'Visit RTPS Bihar (serviceonline.bihar.gov.in) → Home Department → Issue of Character Certificate → Submit OTP & Address → Collect from local Thana.',
      hi: 'RTPS बिहार पोर्टल पर जाएं → गृह विभाग सेवाएं → चरित्र प्रमाण पत्र निर्गमन चुनें → ओटीपी और पता भरें → स्थानीय थाने से प्रमाण पत्र प्राप्त करें।',
      kn: 'RTPS ಬಿಹಾರ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ → ಗೃಹ ಇಲಾಖೆ ಸೇವೆಗಳು → ಕ್ಯಾರಕ್ಟರ್ ಸರ್ಟಿಫಿಕೇಟ್ ಅಪ್ಲೈ ಮಾಡಿ.',
      ta: 'RTPS பீகார் போர்ட்டலுக்குச் செல்லவும் → உள்துறை சேவைகள் → சான்றிதழ் விண்ணப்பிக்கவும்.',
      te: 'RTPS బీహార్ పోర్టల్‌ను సందర్శించండి → హోమ్ డిపార్ట్‌మెంట్ సేవల నుండి సర్టిఫికెట్ దరఖాస్తు చేసుకోండి.'
    }
  },
  karnataka: {
    state: 'Karnataka (Bangalore)',
    portal: 'https://sevasindhuservices.karnataka.gov.in',
    appName: 'Seva Sindhu / KSP App',
    fee: '₹50',
    time: '7–10 Days',
    steps: {
      en: 'Visit Seva Sindhu Portal → Police Verification Certificate (PCC) → Login with Aadhaar → Upload Karnataka address proof / Rent agreement → Download online.',
      hi: 'सेवा सिंधु पोर्टल पर जाएं → पुलिस सत्यापन प्रमाण पत्र (PCC) चुनें → आधार से लॉगिन करें → कर्नाटक का पता प्रमाण अपलोड करें।',
      kn: 'ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ → ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ ಪ್ರಮಾಣಪತ್ರ (PCC) → ಆಧಾರ್ ಲಾಗಿನ್ ಮಾಡಿ → ವಿಳಾಸ ಪುರಾವೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
      ta: 'சேவா சிந்து போர்ட்டலை பார்வையிடவும் → காவல் துறை சரிபார்ப்பு சான்றிதழ் (PCC) → ஆதார் மூலம் உள்நுழைக.',
      te: 'సేవా సింధు పోర్టల్‌ను సందర్శించండి → పోలీస్ వెరిఫికేషన్ సర్టిఫికేట్ (PCC) ఎంచుకోండి → ఆధార్‌తో లాగిన్ అవ్వండి.'
    }
  },
  maharashtra: {
    state: 'Maharashtra (Mumbai / Pune)',
    portal: 'https://pcs.mahaonline.gov.in',
    appName: 'Aaple Sarkar Portal',
    fee: '₹100',
    time: '10–14 Days',
    steps: {
      en: 'Go to Aaple Sarkar (pcs.mahaonline.gov.in) → Character Certificate Application → Select District & Police Station → Upload photo/ID → Download digital PCC.',
      hi: 'आपले सरकार पोर्टल पर जाएं → चरित्र प्रमाण पत्र आवेदन → अपना जिला और पुलिस थाना चुनें → आईडी अपलोड करें।',
      kn: 'ಆಪ್ಲೆ ಸರ್ಕಾರ್ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ → ಕ್ಯಾರಕ್ಟರ್ ಸರ್ಟಿಫಿಕೇಟ್ ಅಪ್ಲಿಕೇಶನ್ ಆಯ್ಕೆಮಾಡಿ.',
      ta: 'ஆப்லே சர்க்கார் போர்ட்டலுக்குச் சென்று மாவட்டக் காவல் நிலையத்தைத் தேர்ந்தெடுக்கவும்.',
      te: 'ఆప్లే సర్కార్ పోర్టల్‌లో క్యారెక్టర్ సర్టిఫికెట్ అప్లికేషన్‌ను ఎంచుకోండి.'
    }
  },
  delhi: {
    state: 'Delhi NCR',
    portal: 'https://pcc.delhipolice.gov.in',
    appName: 'Delhi Police PCC Portal',
    fee: '₹250',
    time: '7 Days',
    steps: {
      en: 'Register on Delhi Police PCC Portal → Fill online application form → Pay ₹250 online → Police verification complete → Download digitally signed PCC.',
      hi: 'दिल्ली पुलिस PCC पोर्टल पर रजिस्ट्रेशन करें → फॉर्म भरें → ₹250 फीस दें → वेरिफिकेशन पूरा होने पर सर्टिफिकेट डाउनलोड करें।',
      kn: 'ದೆಹಲಿ ಪೊಲೀಸ್ PCC ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿ → ₹250 ಶುಲ್ಕ ಪಾವತಿಸಿ → PCC ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
      ta: 'டெல்லி காவல்துறை PCC போர்ட்டலில் பதிவு செய்து ₹250 ஆன்லைனில் செலுத்துங்கள்.',
      te: 'ఢిల్లీ పోలీస్ PCC పోర్టల్‌లో రిజిస్టర్ అయి ₹250 ఆన్‌లైన్‌లో చెల్లించండి.'
    }
  },
  tn: {
    state: 'Tamil Nadu (Chennai)',
    portal: 'https://eservices.tnpolice.gov.in',
    appName: 'TN Police Citizen Portal',
    fee: '₹500',
    time: '10 Days',
    steps: {
      en: 'Visit TN Police Citizen Portal → Verification Services → Select Self/Job Verification → Upload Aadhaar & Photo → Download verified report.',
      hi: 'तमिलनाडु पुलिस पोर्टल पर जाएं → वेरिफिकेशन सर्विसेज चुनें → जॉब वेरिफिकेशन फॉर्म भरें → सर्टिफिकेट पाएं।',
      kn: 'ತಮಿಳುನಾಡು ಪೊಲೀಸ್ ಸಿಟಿಜನ್ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ → ಪರಿಶೀಲನೆ ಸೇವೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      ta: 'தமிழ்நாடு காவல் துறை குடிமக்கள் போர்ட்டலுக்குச் செல்லவும் → சரிபார்ப்பு சேவைகள் → ஆவணங்களைப் பதிவேற்றவும்.',
      te: 'తమిళనాడు పోలీస్ పోర్టల్‌ను సందర్శించి జాబ్ వెరిఫికేషన్ ఎంచుకోండి.'
    }
  },
  ts: {
    state: 'Telangana (Hyderabad)',
    portal: 'https://www.tspolice.gov.in',
    appName: 'MeeSeva / HawkEye App',
    fee: '₹250',
    time: '7 Days',
    steps: {
      en: 'Go to Telangana Police Portal / MeeSeva → Apply for PCC → Upload photo & address proof → Download verified certificate.',
      hi: 'तेलंगाना पुलिस / मीसेवा पोर्टल पर जाएं → PCC आवेदन करें → फोटो और पता दस्तावेज अपलोड करें।',
      kn: 'ತೆಲಂಗಾಣ ಪೊಲೀಸ್ / ಮೀಸೇವಾ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ PCC ಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.',
      ta: 'தெலுங்கானா காவல்துறை / மீசேவா போர்ட்டலில் PCC விண்ணப்பிக்கவும்.',
      te: 'తెలంగాణ పోలీస్ / మీసేవ పోర్టల్‌లో PCC దరఖాస్తు చేసుకోండి → ఆన్‌లైన్ సర్టిఫికెట్ పొందండి.'
    }
  }
};

const STEPS_DATA = {
  1: {
    title: {
      en: 'Step 1: Email Address & Email OTP Login',
      hi: 'चरण 1: ईमेल आईडी और ईमेल (Email) OTP से लॉगिन',
      kn: 'ಹಂತ 1: ಇಮೇಲ್ ವಿಳಾಸ ಮತ್ತು ಇಮೇಲ್ OTP ಲಾಗಿನ್',
      ta: 'படி 1: மின்னஞ்சல் முகவரி மற்றும் மின்னஞ்சல் OTP உள்நுழைவு',
      te: 'దశ 1: ఈమెయిల్ అడ్రస్ & ఈమెయిల్ OTP లాగిన్'
    },
    subtitle: {
      en: 'Quick 10-second signup via Email OTP verification',
      hi: 'ईमेल पर आए OTP से सिर्फ 10 सेकंड में आसान रजिस्ट्रेशन',
      kn: 'ಇಮೇಲ್ OTP ಮೂಲಕ ಕೇವಲ 10 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸುಲಭ ಲಾಗಿನ್',
      ta: 'மின்னஞ்சல் OTP மூலம் 10 வினாடிகளில் பதிவு செய்யுங்கள்',
      te: 'ఈమెయిల్ OTP ద్వారా 10 సెకన్లలో వేగవంతమైన సైన్ అప్'
    },
    mockup: {
      header: 'Carpenterwala Partner App',
      screenTitle: 'Professional Registration',
      elements: [
        { label: 'Email Address', value: 'artisan@gmail.com', type: 'input' },
        { label: 'Phone Number', value: '+91 98765 43210', type: 'input' },
        { label: 'Enter Email OTP Code', value: '7 • 4 • 2 • 9 • 1 • 8', type: 'otp' },
        { label: 'Verify & Continue', value: 'VERIFY EMAIL OTP ➔', type: 'button' }
      ],
      badge: '100% Free Email Signup'
    },
    details: {
      en: 'Enter your Email Address and Phone Number on carpenterwala.com/pro/login. You will receive a 6-digit Verification OTP code directly in your Email inbox. Simply enter the Email OTP code to verify and proceed!',
      hi: 'carpenterwala.com/pro/login पर अपना ईमेल आईडी और मोबाइल नंबर दर्ज करें। आपके ईमेल इनबॉक्स पर 6 अंकों का वेरिफिकेशन OTP कोड आएगा। बस ईमेल OTP दर्ज करके आगे बढ़ें!',
      kn: 'carpenterwala.com/pro/login ನಲ್ಲಿ ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ. ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ 6-ಅಂಕಿಯ ಪರಿಶೀಲನಾ OTP ಕೋಡ್ ಬರುತ್ತದೆ. ಇಮೇಲ್ OTP ನಮೂದಿಸಿ ಮುಂದುವರಿಯಿರಿ.',
      ta: 'carpenterwala.com/pro/login இல் உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும். உங்கள் மின்னஞ்சலுக்கு 6 இலக்க OTP குறியீடு வரும்.',
      te: 'carpenterwala.com/pro/login లో మీ ఈమెయిల్ అడ్రస్ నమోదు చేయండి. మీ ఈమెయిల్‌కు 6 అంకెల OTP కోడ్ వస్తుంది. ఈమెయిల్ OTP ఎంటర్ చేసి కొనసాగండి.'
    }
  },
  2: {
    title: {
      en: 'Step 2: Experience & Specialty Skills',
      hi: 'चरण 2: अनुभव और काम का हुनर चुनें',
      kn: 'ಹಂತ 2: ಅನುಭವ ಮತ್ತು ಕೌಶಲ್ಯಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      ta: 'படி 2: அனுபவம் மற்றும் கைவினைத் திறன்கள்',
      te: 'దశ 2: అనుభవం & నైపుణ్యాల ఎంపిక'
    },
    subtitle: {
      en: 'Tell customers what you specialize in to get matching leads',
      hi: 'अपनी खासियत दर्ज करें ताकि आपको सही काम के ऑर्डर मिल सकें',
      kn: 'ನಿಮಗೆ ಸೂಕ್ತವಾದ ಕೆಲಸದ ಲೀಡ್‌ಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ನಮೂದಿಸಿ',
      ta: 'சரியான வேலை ஆர்டர்களைப் பெற உங்கள் திறன்களைத் தேர்ந்தெடுக்கவும்',
      te: 'సరైన వర్క్ ఆర్డర్‌లను పొందడానికి మీ నైపుణ్యాలను ఎంచుకోండి'
    },
    mockup: {
      header: 'Skill & Experience Profile',
      screenTitle: 'Select Your Expertise',
      elements: [
        { label: 'Years of Experience', value: '7 Years Experience', type: 'select' },
        { label: 'Specialties', value: '✓ Modular Kitchen  ✓ Wardrobe  ✓ Door Locks', type: 'tags' },
        { label: 'Save & Next', value: 'SAVE & CONTINUE ➔', type: 'button' }
      ],
      badge: 'High Match Leads'
    },
    details: {
      en: 'Select your total work experience (e.g. 5 Years, 10 Years) and choose your specific carpentry skills: Modular kitchen fitting, wardrobe assembly, door lock repair, furniture polishing, or sofa repair.',
      hi: 'अपना कुल काम का अनुभव (जैसे 5 साल, 10 साल) दर्ज करें और अपनी खासियतें चुनें: मॉडुलर किचन, अलमारी फिटिंग, डोर लॉक रिपेयर, फर्नीचर पॉलिश या सोफा मरम्मत।',
      kn: 'ನಿಮ್ಮ ಒಟ್ಟು ಕೆಲಸದ ಅನುಭವ ಮತ್ತು ಕೌಶಲ್ಯಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ: ಮಾಡ್ಯುಲರ್ ಕಿಚನ್, ವಾರ್ಡ್ರೋಬ್ ಫಿಟ್ಟಿಂಗ್, ಡೋರ್ ಲಾಕ್ ರಿಪೇರಿ, ಫರ್ನಿಚರ್ ಪಾಲಿಶ್.',
      ta: 'உங்கள் பணி அனுபவம் மற்றும் திறன்களைத் தேர்ந்தெடுக்கவும்: மாடுலர் கிச்சன், வார்ட்ரோப் பொருத்துதல், கதவு பூட்டு பழுது.',
      te: 'మీ పని అనుభవం మరియు నైపుణ్యాలను ఎంచుకోండి: మోడ్యులర్ కిచెన్, వార్డ్‌రోబ్ ఫిట్టింగ్, డోర్ లాక్ రిపేర్.'
    }
  },
  3: {
    title: {
      en: 'Step 3: Work City & Area Radius',
      hi: 'चरण 3: अपना शहर और कार्य क्षेत्र (Area) चुनें',
      kn: 'ಹಂತ 3: ನಿಮ್ಮ ನಗರ ಮತ್ತು ಕೆಲಸದ ಪ್ರದೇಶ ಆಯ್ಕೆಮಾಡಿ',
      ta: 'படி 3: உங்கள் நகரம் மற்றும் பணி மண்டலம்',
      te: 'దశ 3: మీ నగరం & పని ప్రాంతం'
    },
    subtitle: {
      en: 'Get work orders directly in your current metro city',
      hi: 'अपने नजदीकी इलाकों में direct ग्राहक बुकिंग पाएं',
      kn: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಪ್ರದೇಶಗಳಲ್ಲಿ ನೇರ ಗ್ರಾಹಕ ಬುಕ್ಕಿಂಗ್ ಪಡೆಯಿರಿ',
      ta: 'உங்கள் அருகிலுள்ள பகுதிகளில் நேரடி வாடிக்கையாளர் ஆர்டர்களைப் பெறுங்கள்',
      te: 'మీ దగ్గరలోని ప్రాంతాలలో నేరుగా కస్టమర్ ఆర్డర్‌లను పొందండి'
    },
    mockup: {
      header: 'Location & Service Radius',
      screenTitle: 'Select Service City',
      elements: [
        { label: 'City', value: 'Bangalore (Bengaluru)', type: 'select' },
        { label: 'Active Hubs', value: '✓ Whitefield  ✓ Koramangala  ✓ HSR Layout  ✓ Thanisandra', type: 'tags' },
        { label: 'Travel Radius', value: 'Within 15 km Radius', type: 'select' }
      ],
      badge: 'Local Customer Leads'
    },
    details: {
      en: 'Whether you migrated to Bangalore, Delhi NCR, Mumbai, Pune, or Chennai, select your current operational metro city and local hubs (e.g. Koramangala, Whitefield, Indiranagar, HSR Layout).',
      hi: 'चाहे आप बैंगलोर, दिल्ली एनसीआर, मुंबई, पुणे या चेन्नई में काम कर रहे हों, अपना वर्तमान शहर और पास के इलाके (जैसे कोरमंगला, व्हाइटफील्ड, एचएसआर लेआउट) चुनें।',
      kn: 'ನೀವು ಬೆಂಗಳೂರು, ದೆಹಲಿ, ಮುಂಬೈ, ಪುಣೆ ಅಥವಾ ಚೆನ್ನೈನಲ್ಲಿದ್ದರೆ, ನಿಮ್ಮ ಪ್ರಸ್ತುತ ನಗರ ಮತ್ತು ಹತ್ತಿರದ ಪ್ರದೇಶಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      ta: 'நீங்கள் பெங்களூரு, டெல்லி, மும்பை, பூனே அல்லது சென்னையில் இருந்தால், உங்கள் தற்போதைய நகரத்தைத் தேர்ந்தெடுக்கவும்.',
      te: 'మీరు బెంగళూరు, ఢిల్లీ, ముంబై, పూణే లేదా చెన్నైలో ఉంటే, మీ ప్రస్తుత నగరాన్ని ఎంచుకోండి.'
    }
  },
  4: {
    title: {
      en: 'Step 4: KYC Document Verification',
      hi: 'चरण 4: पहचान पत्र (KYC) अपलोड करें',
      kn: 'ಹಂತ 4: ಆಧಾರ್ ಮತ್ತು ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಅಪ್‌ಲೋಡ್',
      ta: 'படி 4: அடையாள ஆவணங்கள் பதிவேற்றம்',
      te: 'దశ 4: గురింపు కార్డుల (KYC) అప్‌లోడ్'
    },
    subtitle: {
      en: 'Earn customer trust with Aadhaar & PAN verification',
      hi: 'आधार और पैन कार्ड से Verified Badge पाएं और ग्राहकों का भरोसा जीतें',
      kn: 'ಆಧಾರ್ ಮತ್ತು ಪ್ಯಾನ್ ಕಾರ್ಡ್‌ನಿಂದ ಪರಿಶೀಲಿಸಿದ ಬ್ಯಾಡ್ಜ್ ಪಡೆಯಿರಿ',
      ta: 'ஆதார் மற்றும் பேன் கார்டு மூலம் சரிபார்க்கப்பட்ட பேட்ஜ் பெறுங்கள்',
      te: 'ఆధార్ మరియు పాన్ కార్డ్‌తో వెరిఫైడ్ బ్యాడ్జ్ పొందండి'
    },
    mockup: {
      header: 'KYC Document Verification',
      screenTitle: 'Identity Verification',
      elements: [
        { label: 'Aadhaar Card Front', value: '✓ aadhaar_front.jpg Uploaded', type: 'uploaded' },
        { label: 'Aadhaar Card Back', value: '✓ aadhaar_back.jpg Uploaded', type: 'uploaded' },
        { label: 'PAN Card / Voter ID', value: '✓ pan_card.jpg Uploaded', type: 'uploaded' }
      ],
      badge: 'Verified Professional'
    },
    details: {
      en: 'Upload clear photos of your Aadhaar card (front and back) along with your PAN Card or Voter ID. Your documents are completely secure and used only for safety verification.',
      hi: 'अपने आधार कार्ड (आगे और पीछे का हिस्सा) और पैन कार्ड की साफ़ तस्वीरें अपलोड करें। आपके दस्तावेज पूरी तरह से सुरक्षित रहते हैं और केवल सत्यापन के लिए उपयोग किए जाते हैं।',
      kn: 'ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಪ್ಯಾನ್ ಕಾರ್ಡ್‌ನ ಸ್ಪಷ್ಟ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ನಿಮ್ಮ ದಾಖಲೆಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.',
      ta: 'உங்கள் ஆதார் கார்டு மற்றும் பேன் கார்டின் தெளிவான புகைப்படங்களைப் பதிவேற்றுங்கள். உங்கள் ஆவணங்கள் பாதுகாப்பானவை.',
      te: 'మీ ఆధార్ కార్డ్ మరియు పాన్ కార్డ్ యొక్క స్పష్టమైన ఫోటోలను అప్‌లోడ్ చేయండి. మీ పత్రాలు సురక్షితంగా ఉంటాయి.'
    }
  },
  5: {
    title: {
      en: 'Step 5: State Online Police Verification (PCC)',
      hi: 'चरण 5: ऑनलाइन पुलिस वेरिफिकेशन प्रमाण पत्र',
      kn: 'ಹಂತ 5: ಆನ್‌ಲೈನ್ ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ (PCC)',
      ta: 'படி 5: ஆன்லைன் காவல் துறை சான்றிதழ்',
      te: 'దశ 5: ఆన్‌లైన్ పోలీస్ వెరిఫికేషన్ (PCC)'
    },
    subtitle: {
      en: 'Apply online from your home state (UP/Bihar) or current metro city',
      hi: 'अपने गृह राज्य (UP/बिहार) या वर्तमान शहर के पोर्टल से ऑनलाइन आवेदन करें',
      kn: 'ನಿಮ್ಮ ಸ್ವಂತ ರಾಜ್ಯ ಅಥವಾ ಪ್ರಸ್ತುತ ನಗರದ ಪೋರ್ಟಲ್‌ನಿಂದ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
      ta: 'உங்கள் சொந்த மாநிலம் அல்லது தற்போதைய நகர போர்ட்டலில் விண்ணப்பிக்கவும்',
      te: 'మీ సొంత రాష్ట్రం లేదా ప్రస్తుత నగర పోర్టల్ నుండి ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి'
    },
    mockup: {
      header: 'Police Clearance Certificate',
      screenTitle: 'Upload PCC Document',
      elements: [
        { label: 'State PCC Document', value: '✓ police_verification.pdf Uploaded', type: 'uploaded' },
        { label: 'Verification Badge Status', value: '🛡️ Safety Verified Professional', type: 'badge' },
        { label: 'Continue Profile', value: 'PROCEED TO PORTFOLIO ➔', type: 'button' }
      ],
      badge: '5x Direct Calls'
    },
    details: {
      en: 'Having a Police Clearance Certificate (PCC) boosts your profile ranking and unlocks 5x more customer bookings. You can apply online via UPCOP (UP), RTPS Bihar, Seva Sindhu (Karnataka), Aaple Sarkar (Maharashtra), or Delhi Police PCC portal.',
      hi: 'पुलिस वेरिफिकेशन सर्टिफिकेट (PCC) होने से आपकी प्रोफाइल सबसे ऊपर दिखती है और 5 गुना ज्यादा ग्राहक काम देते हैं। आप UPCOP (UP), RTPS बिहार, सेवा सिंधु (कर्नाटक), या दिल्ली पुलिस पोर्टल से ऑनलाइन बनवा सकते हैं।',
      kn: 'ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ ಪ್ರಮಾಣಪತ್ರ (PCC) ಹೊಂದಿದ್ದರೆ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಉನ್ನತ ಸ್ಥಾನ ಪಡೆಯುತ್ತದೆ ಮತ್ತು 5 ಪಟ್ಟು ಹೆಚ್ಚು ಗ್ರಾಹಕ ಬುಕ್ಕಿಂಗ್ ಲಭಿಸುತ್ತದೆ.',
      ta: 'காவல் துறை சான்றிதழ் (PCC) வைத்திருப்பது 5 மடங்கு கூடுதல் வாடிக்கையாளர் ஆர்டர்களைப் பெற உதவும்.',
      te: 'పోలీస్ వెరిఫికేషన్ సర్టిఫికేట్ (PCC) ఉండటం వలన 5 రెట్లు ఎక్కువ కస్టమర్ బుకింగ్‌లు లభిస్తాయి.'
    }
  },
  6: {
    title: {
      en: 'Step 6: Work Portfolio Photos & Going Live!',
      hi: 'चरण 6: काम की फोटो अपलोड करें और प्रोफाइल Live करें!',
      kn: 'ಹಂತ 6: ಕೆಲಸದ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಪ್ರೊಫೈಲ್ ಲೈವ್ ಮಾಡಿ!',
      ta: 'படி 6: புகைப்படங்கள் பதிவேற்றி நேரலைக்குச் செல்லுங்கள்!',
      te: 'దశ 6: పని ఫోటోలు అప్‌లోడ్ చేసి లైవ్‌లోకి వెళ్ళండి!'
    },
    subtitle: {
      en: 'Showcase your craftsmanship and start receiving direct calls',
      hi: 'अपने बनाए फर्नीचर/काम की फोटो दिखाएं और बिना कमीशन सीधे ग्राहक पाएं',
      kn: 'ನಿಮ್ಮ ಅತ್ಯುತ್ತಮ ಕೆಲಸದ ಚಿತ್ರಗಳನ್ನು ತೋರಿಸಿ ಮತ್ತು ನೇರ ಫೋನ್ ಕರೆಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ಪ್ರಾರಂಭಿಸಿ',
      ta: 'உங்கள் வேலைப் படங்களைக் காட்டி நேரடி அழைப்புகளைப் பெறத் தொடங்குங்கள்',
      te: 'మీ పని ఫోటోలను చూపించి నేరుగా ఫోన్ కాల్స్ పొందడం ప్రారంభించండి'
    },
    mockup: {
      header: 'Live Craftsman Directory',
      screenTitle: 'Profile Status: LIVE',
      elements: [
        { label: 'Portfolio Uploaded', value: '📷 4 Work Photos Uploaded', type: 'uploaded' },
        { label: 'Direct Call Button', value: '📞 Call Artisan Direct (Active)', type: 'button' },
        { label: 'Commission Rate', value: '0% Commission (Keep 100% Earnings)', type: 'badge' }
      ],
      badge: 'Profile 100% Live'
    },
    details: {
      en: 'Upload 3 to 5 clear photos of your finished carpentry work (modular kitchens, wardrobes, lock repair, polishing). Click "Submit Profile" to get listed on Carpenterwala directory and start getting direct customer calls!',
      hi: 'अपने किए गए काम की 3 से 5 तस्वीरें अपलोड करें (मॉडुलर किचन, अलमारी, लॉक रिपेयर)। "सबमिट प्रोफाइल" पर क्लिक करें और बिना किसी ठेकेदार कमीशन के सीधे ग्राहकों से फोन कॉल पाएं!',
      kn: 'ನಿಮ್ಮ ಕೆಲಸದ 3 ರಿಂದ 5 ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಕಾರ್ಪೆಂಟರ್‍ವಾಲಾ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಲೈವ್ ಆಗಿ ನೇರ ಗ್ರಾಹಕ ಕರೆಗಳನ್ನು ಪಡೆಯಿರಿ!',
      ta: 'உங்கள் வேலைப்பாடுகளின் 3 முதல் 5 புகைப்படங்களைப் பதிவேற்றுங்கள். நேரடியாக வாடிக்கையாளர் அழைப்புகளைப் பெறுங்கள்!',
      te: 'మీ పని యొక్క 3 నుండి 5 ఫోటోలను అప్‌లోడ్ చేయండి. నేరుగా కస్టమర్ ఫోన్ కాల్స్ పొందడం ప్రారంభించండి!'
    }
  }
};

export default function ProOnboardingVisualTour() {
  const [activeStep, setActiveStep] = useState(1);
  const [lang, setLang] = useState('en');
  const [selectedState, setSelectedState] = useState('up');

  const currentStep = STEPS_DATA[activeStep];
  const currentStatePolice = POLICE_VERIFICATION_DATA[selectedState];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#f8fafc',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      margin: '2.5rem 0'
    }}>
      {/* Header & Language Switcher */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '6px'
          }}>
            Interactive Tour Widget
          </div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            🔨 Carpenterwala Registration Visual Tour
          </h3>
        </div>

        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>🌐 Language:</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: '#334155',
              color: '#fff',
              border: '1px solid #475569',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          <span>Step {activeStep} of 6</span>
          <span style={{ fontWeight: 600, color: '#f59e0b' }}>{Math.round((activeStep / 6) * 100)}% Complete</span>
        </div>
        <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(activeStep / 6) * 100}%`,
            background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Step Tabs Nav */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '2rem',
        scrollbarWidth: 'thin'
      }}>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => setActiveStep(num)}
            style={{
              flex: '0 0 auto',
              background: activeStep === num ? '#3b82f6' : '#1e293b',
              color: activeStep === num ? '#fff' : '#94a3b8',
              border: activeStep === num ? '1px solid #60a5fa' : '1px solid #334155',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Step {num}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Grid: Mobile Snap Mockup (Left) + Detailed Contents (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        alignItems: 'center'
      }}>
        {/* LEFT: Realistic Mobile Screen Snap Mockup */}
        <div style={{
          background: '#020617',
          borderRadius: '30px',
          border: '4px solid #334155',
          padding: '16px',
          boxShadow: '0 15px 30px rgba(0,0,0,0.6)',
          maxWidth: '360px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Phone Notch & Speaker */}
          <div style={{ width: '80px', height: '14px', background: '#334155', borderRadius: '10px', margin: '0 auto 16px' }} />
          
          {/* Screen Container */}
          <div style={{
            background: '#0f172a',
            borderRadius: '18px',
            border: '1px solid #1e293b',
            padding: '16px',
            color: '#fff'
          }}>
            {/* Screen Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3b82f6' }}>🔨 CARPENTERWALA</span>
              <span style={{ fontSize: '0.65rem', background: '#10b981', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                {currentStep.mockup.badge}
              </span>
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
              {currentStep.mockup.screenTitle}
            </div>

            {/* Screen Dynamic Elements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {currentStep.mockup.elements.map((el, idx) => (
                <div key={idx} style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>{el.label}</div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: el.type === 'button' ? 800 : 600,
                    color: el.type === 'button' ? '#38bdf8' : el.type === 'uploaded' ? '#4ade80' : '#f8fafc'
                  }}>
                    {el.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated Live Action Banner */}
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px dashed #3b82f6', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '0.7rem', color: '#93c5fd' }}>
              📲 Real-time Partner Portal Sync
            </div>
          </div>
        </div>

        {/* RIGHT: Step Descriptions & Guidance */}
        <div>
          <h4 style={{ fontSize: '1.35rem', margin: '0 0 8px 0', color: '#38bdf8' }}>
            {currentStep.title[lang] || currentStep.title['en']}
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '1rem', fontStyle: 'italic' }}>
            "{currentStep.subtitle[lang] || currentStep.subtitle['en']}"
          </p>

          <div style={{
            background: '#1e293b',
            borderLeft: '4px solid #3b82f6',
            padding: '1.25rem',
            borderRadius: '0 12px 12px 0',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
            fontSize: '0.95rem'
          }}>
            {currentStep.details[lang] || currentStep.details['en']}
          </div>

          {/* Special State Police Verification Search Tool on Step 5 */}
          {activeStep === 5 && (
            <div style={{
              background: '#020617',
              border: '1px solid #334155',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>👮</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f59e0b' }}>
                  State Police Verification Portal Guide
                </span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Select Home State / Current Metro State:
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  <option value="up">Uttar Pradesh (UP) - UPCOP App</option>
                  <option value="bihar">Bihar - RTPS Bihar Portal</option>
                  <option value="karnataka">Karnataka (Bangalore) - Seva Sindhu</option>
                  <option value="maharashtra">Maharashtra (Mumbai/Pune) - Aaple Sarkar</option>
                  <option value="delhi">Delhi NCR - Delhi Police PCC</option>
                  <option value="tn">Tamil Nadu (Chennai) - TN Police Portal</option>
                  <option value="ts">Telangana (Hyderabad) - MeeSeva</option>
                </select>
              </div>

              {currentStatePolice && (
                <div style={{ fontSize: '0.85rem', background: '#0f172a', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>{currentStatePolice.appName}</span>
                    <span style={{ color: '#4ade80' }}>Fee: {currentStatePolice.fee} | Est: {currentStatePolice.time}</span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', color: '#cbd5e1', lineHeight: 1.4 }}>
                    {currentStatePolice.steps[lang] || currentStatePolice.steps['en']}
                  </p>
                  <a
                    href={currentStatePolice.portal}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Open Official Portal ({currentStatePolice.portal}) ➔
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Navigation & CTA Controls */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                style={{
                  background: '#334155',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                ⬅️ Previous Step
              </button>
            )}

            {activeStep < 6 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                style={{
                  background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                }}
              >
                Next Step ({activeStep + 1}/6) ➔
              </button>
            ) : (
              <Link
                href="/pro/login"
                style={{
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                🚀 START FREE REGISTRATION NOW
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
