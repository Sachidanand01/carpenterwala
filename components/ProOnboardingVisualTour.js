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
      te: 'తమిళనాడు పోలీస్ పోర్టల్‌ను సందర్శించి జాబ్ వెరిఫικేషన్ ఎంచుకోండి.'
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
      en: 'Step 1: Service Pro Email & Email OTP Signup',
      hi: 'चरण 1: सर्विस प्रो ईमेल आईडी और ईमेल (Email) OTP से फ्री साइनअप',
      kn: 'ಹಂತ 1: ಸರ್ವಿಸ್ ಪ್ರೋ ಇಮೇಲ್ ಮತ್ತು ಇಮೇಲ್ OTP ಲಾಗಿನ್',
      ta: 'படி 1: சேவை புரோ மின்னஞ்சல் மற்றும் மின்னஞ்சல் OTP பதிவு',
      te: 'దశ 1: సర్వీస్ ప్రో ఈమెయిల్ & ఈమెయిల్ OTP సైన్ అప్'
    },
    subtitle: {
      en: 'Free registration for Carpenters, Painters, Electricians, Plumbers & Handymen',
      hi: 'कारपेंटर, पेंटर, इलेक्ट्रिशियन, प्लंबर और तकनीशियनों के लिए 100% फ्री रजिस्ट्रेशन',
      kn: 'ಕಾರ್ಪೆಂಟರ್, ಪೇಂಟರ್, ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಪ್ಲಂಬರ್‌ಗಳಿಗೆ ಉಚಿತ ನೋಂದಣಿ',
      ta: 'கார்பெண்டர், பெயிண்டர், எலக்ட்ரீஷியன், பிளம்பர்களுக்கு இலவச பதிவு',
      te: 'కార్పెంటర్, పెయింటర్, ఎలక్ట్రీషియన్, ప్లంబర్ల కోసం ఉచిత రిజిస్ట్రేషన్'
    },
    mockup: {
      header: 'Carpenterwala Service Pro App',
      screenTitle: 'Professional Registration',
      elements: [
        { label: 'Email Address', value: 'servicepro@gmail.com', type: 'input' },
        { label: 'Phone Number', value: '+91 98765 43210', type: 'input' },
        { label: 'Enter 6-Digit Email OTP', value: '8 • 3 • 1 • 9 • 5 • 2', type: 'otp' },
        { label: 'Verify & Continue', value: 'VERIFY EMAIL OTP ➔', type: 'button' }
      ],
      badge: '100% Free Service Pro Signup'
    },
    details: {
      en: 'Enter your Email Address and Mobile Number on carpenterwala.com/pro/login. You will receive a 6-digit Verification OTP code directly in your Email inbox. Free for all trade technicians!',
      hi: 'carpenterwala.com/pro/login पर अपना ईमेल आईडी और मोबाइल नंबर दर्ज करें। आपके ईमेल इनबॉक्स पर 6 अंकों का वेरिफिकेशन OTP कोड आएगा। सभी ट्रेड तकनीशियनों के लिए 100% फ्री!',
      kn: 'carpenterwala.com/pro/login ನಲ್ಲಿ ನಿಮ್ಮ ಇಮೇಲ್ ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ. 6-ಅಂಕಿಯ OTP ಪಡೆಯಿರಿ. ಎಲ್ಲಾ ಟ್ರೇಡ್ ವೃತ್ತಿಪರರಿಗೆ ಉಚಿತ!',
      ta: 'carpenterwala.com/pro/login இல் உங்கள் மின்னஞ்சல் மற்றும் மொபைல் எண்ணை உள்ளிட்டு 6 இலக்க OTP பெறவும்.',
      te: 'carpenterwala.com/pro/login లో మీ ఈమెయిల్ మరియు మొబైల్ సంఖ్య నమోదు చేసి 6 అంకెల OTP పొందండి.'
    }
  },
  2: {
    title: {
      en: 'Step 2: Select Service Trade & Specialty Skills',
      hi: 'चरण 2: अपना सर्विस ट्रेड (Carpentry, Painting, Electrical, Plumbing) चुनें',
      kn: 'ಹಂತ 2: ಸೇವಾ ವೃತ್ತಿ ಮತ್ತು ಕೌಶಲ್ಯಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      ta: 'படி 2: உங்கள் சேவை தொழில் மற்றும் திறன்கள்',
      te: 'దశ 2: మీ సర్వీస్ ట్రేడ్ & నైపుణ్యాల ఎంపಿಕ'
    },
    subtitle: {
      en: 'Choose your trade: Carpenter, Painter, Electrician, Plumber, or Handyman',
      hi: 'अपना काम चुनें: कारपेंटर, पेंटर, इलेक्ट्रिशियन, प्लंबर या हैंड्रीमैन',
      kn: 'ನಿಮ್ಮ ವೃತ್ತಿ ಆಯ್ಕೆಮಾಡಿ: ಕಾರ್ಪೆಂಟರ್, ಪೇಂಟರ್, ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಪ್ಲಂಬರ್',
      ta: 'உங்கள் தொழிலைத் தேர்ந்தெடுக்கவும்: கார்பெண்டர், பெயிண்டர், எலக்ட்ரீஷியன், பிளம்பர்',
      te: 'మీ రంగాన్ని ఎంచుకోండి: కార్పెంటర్, పెయింటర్, ఎలక్ట్రీషియన్, ప్లంబర్'
    },
    mockup: {
      header: 'Trade & Skill Profile',
      screenTitle: 'Select Primary Service Category',
      elements: [
        { label: 'Primary Trade', value: '✓ Carpentry / Painting / Electrical', type: 'select' },
        { label: 'Years of Experience', value: '5+ Years Experience', type: 'select' },
        { label: 'Save & Next', value: 'SAVE & CONTINUE ➔', type: 'button' }
      ],
      badge: 'All Service Trades Allowed'
    },
    details: {
      en: 'Select your primary trade category (Carpentry, Painting, Electrical, Plumbing, Appliance Repair, or Handyman services), enter your work experience, and list your specialty skills.',
      hi: 'अपनी मुख्य ट्रेड श्रेणी (कारपेंटरी, पेंटिंग, इलेक्ट्रिकल, प्लंबिंग, उपकरण मरम्मत, या हैंड्रीमैन सेवाएं) चुनें, अपना अनुभव और खास हुनर दर्ज करें।',
      kn: 'ನಿಮ್ಮ ಮುಖ್ಯ ಸೇವಾ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಕಾರ್ಪೆಂಟ್ರಿ, ಪೇಂಟಿಂಗ್, ಎಲೆಕ್ಟ್ರಿಕಲ್, ಪ್ಲಂಬಿಂಗ್) ಮತ್ತು ನಿಮ್ಮ ಅನುಭವವನ್ನು ನಮೂದಿಸಿ.',
      ta: 'உங்கள் முதன்மை சேவை வகையைத் தேர்ந்தெடுக்கவும் (கார்பெண்டரி, பெயிண்டிங், எலக்ட்ரிக்கல், பிளம்பிங்).',
      te: 'మీ ప్రధాన సర్వీస్ కేటగిరీని ఎంచుకోండి (కార్పెంట్రీ, పెయింటింగ్, ఎలక్ట్రికల్, ప్లంబింగ్).'
    }
  },
  3: {
    title: {
      en: 'Step 3: Service City & Local Area Hubs',
      hi: 'चरण 3: अपना शहर और सेवा क्षेत्र (Service Hub) चुनें',
      kn: 'ಹಂತ 3: ಸೇವಾ ನಗರ ಮತ್ತು ಸ್ಥಳೀಯ ಪ್ರದೇಶಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      ta: 'படி 3: சேவை நகரம் மற்றும் உள்ளூர் மண்டலம்',
      te: 'దశ 3: సర్వీస్ నగరం & ప్రాంతాలు'
    },
    subtitle: {
      en: 'Get direct customer job inquiries in your local operating city',
      hi: 'अपने शहर और आसपास के इलाकों में direct ग्राहक कॉल और ऑर्डर पाएं',
      kn: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ನಗರ ಮತ್ತು ಪ್ರದೇಶಗಳಲ್ಲಿ ನೇರ ಗ್ರಾಹಕ ಕರೆಗಳನ್ನು ಪಡೆಯಿರಿ',
      ta: 'உங்கள் உள்ளூர் நகரத்தில் நேரடி வாடிக்கையாளர் அழைப்புகளைப் பெறுங்கள்',
      te: 'మీ స్థానిక నగరంలో నేరుగా కస్టమರ್ ఫోన్ కాల్స్ పొందండి'
    },
    mockup: {
      header: 'Location & Service Radius',
      screenTitle: 'Select Operational City',
      elements: [
        { label: 'Operational City', value: 'Bangalore / Delhi / Mumbai / Pune', type: 'select' },
        { label: 'Active Service Hubs', value: '✓ Koramangala  ✓ Whitefield  ✓ HSR Layout', type: 'tags' },
        { label: 'Service Radius', value: 'Within 15 km Radius', type: 'select' }
      ],
      badge: 'Direct Customer Calls'
    },
    details: {
      en: 'Select your operational city (Bangalore, Delhi NCR, Mumbai, Pune, Chennai, Hyderabad, etc.) and choose the specific neighborhoods where you want to receive direct customer work inquiries.',
      hi: 'अपना कार्य शहर (बैंगलोर, दिल्ली एनसीआर, मुंबई, पुणे, चेन्नई, हैदराबाद आदि) और वे इलाके चुनें जहाँ आप सीधे ग्राहकों से काम पाना चाहते हैं।',
      kn: 'ನಿಮ್ಮ ಕೆಲಸದ ನಗರ ಮತ್ತು ಪ್ರದೇಶಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಬೆಂಗಳೂರು, ದೆಹಲಿ, ಮುಂಬೈ, ಪುಣೆ, ಚೆನ್ನೈ).',
      ta: 'உங்கள் பணி நகரம் மற்றும் பகுதிகளைத் தேர்ந்தெடுக்கவும் (பெங்களூரு, டெல்லி, மும்பை, சென்னை).',
      te: 'మీ పని నగరం మరియు ప్రాంతాలను ఎంచుకోండి (బెంగళూరు, ఢిల్లీ, ముంబై, చెన్నై).'
    }
  },
  4: {
    title: {
      en: 'Step 4: KYC Identity Verification',
      hi: 'चरण 4: पहचान पत्र (KYC) अपलोड करें',
      kn: 'ಹಂತ 4: ಆಧಾರ್ ಮತ್ತು ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಪರಿಶೀಲನೆ',
      ta: 'படி 4: அடையாள ஆவணங்கள் சரிபார்ப்பு',
      te: 'దశ 4: గురింపు కార్డుల (KYC) అప్‌లోడ్'
    },
    subtitle: {
      en: 'Upload Aadhaar & PAN Card to earn the "Verified Pro" badge',
      hi: 'आधार और पैन कार्ड से Verified Badge पाएं और ग्राहकों का भरोसा जीतें',
      kn: 'ಆಧಾರ್ ಮತ್ತು ಪ್ಯಾನ್ ಕಾರ್ಡ್‌ನಿಂದ ಪರಿಶೀಲಿಸಿದ ಬ್ಯಾಡ್ಜ್ ಪಡೆಯಿರಿ',
      ta: 'ஆதார் மற்றும் பேன் கார்டு மூலம் சரிபார்க்கப்பட்ட பேட்ஜ் பெறுங்கள்',
      te: 'ఆధార్ మరియు పాన్ కార్డ్‌తో వెరిఫైడ్ బ్యాಡ್జ్ పొందండి'
    },
    mockup: {
      header: 'KYC Identity Verification',
      screenTitle: 'Identity Verification',
      elements: [
        { label: 'Aadhaar Card Front', value: '✓ aadhaar_front.jpg Uploaded', type: 'uploaded' },
        { label: 'Aadhaar Card Back', value: '✓ aadhaar_back.jpg Uploaded', type: 'uploaded' },
        { label: 'PAN Card / Voter ID', value: '✓ pan_card.jpg Uploaded', type: 'uploaded' }
      ],
      badge: 'Verified Service Pro'
    },
    details: {
      en: 'Upload clear photos of your Aadhaar Card (front and back) and PAN Card or Voter ID. Your documents remain completely private and secure on our encrypted system.',
      hi: 'अपने आधार कार्ड (आगे और पीछे का हिस्सा) और पैन कार्ड की साफ़ तस्वीरें अपलोड करें। आपके दस्तावेज पूरी तरह से सुरक्षित रहते हैं।',
      kn: 'ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಪ್ಯಾನ್ ಕಾರ್ಡ್‌ನ ಸ್ಪಷ್ಟ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ನಿಮ್ಮ ದಾಖಲೆಗಳು ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.',
      ta: 'உங்கள் ஆதார் கார்டு மற்றும் பேன் கார்டின் தெளிவான புகைப்படங்களைப் பதிவேற்றுங்கள்.',
      te: 'మీ ఆధార్ కార్డ్ మరియు పాన్ కార్డ్ యొక్క స్పష్టమైన ఫోటోలను అప్‌లోడ్ చేయండి.'
    }
  },
  5: {
    title: {
      en: 'Step 5: Online State Police Verification (PCC)',
      hi: 'चरण 5: ऑनलाइन पुलिस वेरिफिकेशन प्रमाण पत्र',
      kn: 'ಹಂತ 5: ಆನ್‌ಲೈನ್ ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ (PCC)',
      ta: 'படி 5: ஆன்லைன் காவல் துறை சான்றிதழ்',
      te: 'దశ 5: ఆన్‌లైన్ పోలీస్ వెరిఫಿಕೇషన్ (PCC)'
    },
    subtitle: {
      en: 'Apply online from any Indian state portal to get 5x more customer calls',
      hi: 'किसी भी राज्य पुलिस पोर्टल से ऑनलाइन आवेदन करें और 5 गुना ज्यादा ग्राहक पाएं',
      kn: 'ಯಾವುದೇ ರಾಜ್ಯ ಪೊಲೀಸ್ ಪೋರ್ಟಲ್‌ನಿಂದ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
      ta: 'எந்தவொரு மாநில காவல்துறை போர்ட்டலிலும் ஆன்லைனில் விண்ணப்பிக்கவும்',
      te: 'ఏదైనా రాష్ట్ర పోలీస్ పోర్టల్ నుండి ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి'
    },
    mockup: {
      header: 'Police Clearance Certificate',
      screenTitle: 'Upload PCC Document',
      elements: [
        { label: 'State PCC Document', value: '✓ police_verification.pdf Uploaded', type: 'uploaded' },
        { label: 'Verification Badge Status', value: '🛡️ Safety Verified Service Pro', type: 'badge' },
        { label: 'Continue Profile', value: 'PROCEED TO PORTFOLIO ➔', type: 'button' }
      ],
      badge: '5x Customer Bookings'
    },
    details: {
      en: 'Uploading a Police Clearance Certificate (PCC) earns you the "Safety Verified Pro" badge. Select your state from our interactive tool below to get direct official portal links (UPCOP, RTPS Bihar, Seva Sindhu Karnataka, Aaple Sarkar Maharashtra, Delhi Police PCC).',
      hi: 'पुलिस वेरिफिकेशन सर्टिफिकेट (PCC) अपलोड करने से आपको "Safety Verified Pro" बैज मिलता है। नीचे दिए गए टूल से अपने राज्य का सरकारी पोर्टल लिंक पाएं।',
      kn: 'ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ ಪ್ರಮಾಣಪತ್ರ (PCC) ಅಪ್‌ಲೋಡ್ ಮಾಡುವುದರಿಂದ "Safety Verified Pro" ಬ್ಯಾಡ್ಜ್ ಲಭಿಸುತ್ತದೆ. ಕೆಳಗಿನ ಟೂಲ್‌ನಿಂದ ನಿಮ್ಮ ರಾಜ್ಯದ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ಆಯ್ಕೆಮಾಡಿ.',
      ta: 'காவல் துறை சான்றிதழ் (PCC) பதிவேற்றுவது "Safety Verified Pro" பேட்ஜைப் பெற உதவும்.',
      te: 'పోలీస్ వెరిఫికేషన్ సర్టిఫికేట్ (PCC) అప్‌లోడ్ చేయడం వలన "Safety Verified Pro" బ్యాడ్జ్ లభిస్తుంది.'
    }
  },
  6: {
    title: {
      en: 'Step 6: Work Photos & Profile Going Live!',
      hi: 'चरण 6: काम की फोटो अपलोड करें और प्रोफाइल Live करें!',
      kn: 'ಹಂತ 6: ಕೆಲಸದ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಪ್ರೊಫೈಲ್ ಲೈವ್ ಮಾಡಿ!',
      ta: 'படி 6: புகைப்படங்கள் பதிவேற்றி நேரலைக்குச் செல்லுங்கள்!',
      te: 'దశ 6: పని ఫోటోలు అప్‌లోడ్ చేసి లైవ్‌లోకి వెళ్ళండి!'
    },
    subtitle: {
      en: 'Showcase your work and start receiving direct customer calls with 0% commission',
      hi: 'अपने काम की फोटो दिखाएं और बिना किसी कमीशन सीधे ग्राहक पाएं',
      kn: 'ನಿಮ್ಮ ಅತ್ಯುತ್ತಮ ಕೆಲಸದ ಚಿತ್ರಗಳನ್ನು ತೋರಿಸಿ ಮತ್ತು 0% ಕಮಿಷನ್‌ನೊಂದಿಗೆ ನೇರ ಫೋನ್ ಕರೆಗಳನ್ನು ಸ್ವೀಕರಿಸಿ',
      ta: '0% கமிஷனுடன் நேரடி அழைப்புகளைப் பெறத் தொடங்குங்கள்',
      te: '0% కమిషన్‌తో నేరుగా కస్టమర్ ఫోన్ కాల్స్ పొందడం ప్రారంభించండి'
    },
    mockup: {
      header: 'Live Service Pro Directory',
      screenTitle: 'Profile Status: LIVE',
      elements: [
        { label: 'Work Portfolio', value: '📷 4 Project Photos Uploaded', type: 'uploaded' },
        { label: 'Direct Call Button', value: '📞 Call Service Pro Direct (Active)', type: 'button' },
        { label: 'Commission Rate', value: '0% Commission (Keep 100% Earnings)', type: 'badge' }
      ],
      badge: 'Profile 100% Live'
    },
    details: {
      en: 'Upload 3 to 5 photos of your past completed service jobs. Click "Submit Profile" to go live on the Carpenterwala Service Pro Directory and start getting direct customer calls with ZERO commission fees!',
      hi: 'अपने पिछले काम की 3 से 5 तस्वीरें अपलोड करें। "सबमिट प्रोफाइल" पर क्लिक करें और बिना किसी कमीशन सीधे ग्राहकों से फोन कॉल पाना शुरू करें!',
      kn: 'ನಿಮ್ಮ 3 ರಿಂದ 5 ಕೆಲಸದ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು 0% ಕಮಿಷನ್‌ನೊಂದಿಗೆ ನೇರ ಫೋನ್ ಕರೆಗಳನ್ನು ಪಡೆಯಿರಿ!',
      ta: 'உங்கள் வேலைகளின் 3 முதல் 5 புகைப்படங்களைப் பதிவேற்றி நேரடியாக வாடிக்கையாளர் அழைப்புகளைப் பெறுங்கள்!',
      te: 'మీ 3 నుండి 5 పని ఫోటోలను అప్‌లోడ్ చేసి నేరుగా కస్టమర్ ఫోన్ కాల్స్ పొందండి!'
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
            Service Pro Registration Guide
          </div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            🛠️ Carpenterwala Service Pro Registration Tour
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
                🚀 START FREE SERVICE PRO REGISTRATION
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
