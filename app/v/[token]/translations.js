export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' }
];

export const ONBOARDING_TRANSLATIONS = {
  en: {
    langName: 'English',
    languagePrompt: 'Choose Your Language / अपनी भाषा चुनें:',
    zeroCommissionBadge: '0% COMMISSION • 100% DIRECT EARNINGS',
    welcomeTitle: 'Namaste, {name} Ji! 🙏',
    welcomeSubtitle: 'Your details are saved. Just tap below to upload your photos and activate your 0% commission profile.',
    prefilledTitle: 'Your Pre-Filled Profile Details',
    labelName: 'Name',
    labelTrade: 'Trade',
    labelLocation: 'Area / City',
    labelExperience: 'Experience',
    labelPhone: 'Mobile',
    yearsUnit: 'Years',
    yearUnit: 'Year',
    noLoginBadge: '🔓 No Login or Password Required • Direct Mobile Upload',
    step1Heading: '1. Mandatory KYC ID (Required)',
    step1Sub: 'Tap each card below to take a clear photo with your phone camera or select from gallery.',
    step2Heading: '2. Extra ID Proof (Optional — Boosts Trust)',
    step2Sub: 'Adding PAN, Driving Licence, or Police Verification helps you get more big-ticket customer jobs.',
    step3Heading: '3. Photos of Your Past Work (2 Photos)',
    step3Sub: 'Customers love seeing real work! Upload 2 photos of furniture, painting, plumbing, or repairs you have done.',
    requiredBadge: 'Required',
    optionalBadge: 'Optional',
    uploadedBadge: 'Uploaded ✓',
    compressingText: 'Compressing photo (<600KB) & uploading…',
    tapToUpload: '📷 Tap to Take Photo or Choose from Gallery',
    tapToChange: '🔄 Retake / Change Photo',
    compressedLabel: 'Auto-compressed:',
    cards: {
      aadhaar_front: {
        title: 'Aadhaar Card — Front Side',
        desc: 'Clear photo showing your Name, Photo, and 12-digit Aadhaar number.'
      },
      aadhaar_back: {
        title: 'Aadhaar Card — Back Side',
        desc: 'Clear photo showing your Address and QR code on the back.'
      },
      pan_front: {
        title: 'PAN Card',
        desc: 'Front side of your PAN Card (Optional).'
      },
      voter_driving_front: {
        title: 'Voter ID / Driving Licence',
        desc: 'Front photo of Voter ID or Driving Licence (Optional).'
      },
      police_verification: {
        title: 'Police Verification Certificate',
        desc: 'Upload if you have a police verification copy (Optional).'
      },
      work_photo_1: {
        title: 'Past Work Photo #1',
        desc: 'Photo of a completed job, site work, or repair project.'
      },
      work_photo_2: {
        title: 'Past Work Photo #2',
        desc: 'Another photo showcasing your skill and finish quality.'
      }
    },
    submitBtn: '✅ Submit & Activate 0% Commission Profile',
    submittingBtn: '⏳ Activating Your Verified Profile…',
    missingRequiredError: 'Please upload both Aadhaar Card Front and Aadhaar Card Back photos to activate your profile.',
    uploadFailedError: 'Photo upload failed. Please try again with a clear photo.',
    invalidFileTypeError: 'Only JPEG, PNG, and WebP photos are allowed (max 2MB).',
    fileTooLargeError: 'Photo size exceeds the 2MB limit. Please choose a JPEG, PNG, or WebP photo under 2MB.',
    securityNote: '🔒 Your ID documents are encrypted & stored in a private admin-only bucket. Never shared publicly.',
    loadingSession: 'Validating your secure onboarding link…',
    linkExpiredBadge: 'Link Expired (> 60 Mins)',
    expiredTitle: 'Link Expired — This Onboarding Link Has Expired',
    expiredSubtitle: 'For your security, magic upload links expire after 60 minutes. Please start a fresh onboarding chat to get a new link.',
    invalidTitle: 'Invalid Onboarding Link',
    invalidSubtitle: 'We could not find this onboarding session. Please check the link or start a new registration.',
    restartBtn: '🚀 Start Fresh Onboarding (/join)',
    successTitle: '🎉 Congratulations, {name} Ji!',
    successSubtitle: 'Your 0% Commission Verified Profile is Now Active!',
    successDesc: 'Homeowners in {location} can now find you and call you directly on your mobile or WhatsApp. You keep 100% of your earnings!',
    proCodeLabel: 'Your Unique Pro ID:',
    viewProfileBtn: '👤 View My Public Profile',
    whatsappShareBtn: '📲 Share My Profile on WhatsApp',
    goHomeBtn: '🏠 Go to Carpenterwala Home',
    trades: {
      carpentry: 'Carpenter (Woodwork)',
      painting: 'Painter',
      plumbing: 'Plumber',
      electrical: 'Electrician'
    }
  },
  hi: {
    langName: 'हिन्दी',
    languagePrompt: 'अपनी भाषा चुनें:',
    zeroCommissionBadge: '0% कमीशन • 100% सीधी कमाई',
    welcomeTitle: 'नमस्ते, {name} जी! 🙏',
    welcomeSubtitle: 'आपकी जानकारी सेव हो चुकी है। बस नीचे टैप करके अपनी फोटो अपलोड करें और अपना 0% कमीशन प्रोफाइल चालू करें।',
    prefilledTitle: 'आपकी दर्ज की गई जानकारी',
    labelName: 'नाम',
    labelTrade: 'काम / पेशा',
    labelLocation: 'इलाका / शहर',
    labelExperience: 'अनुभव',
    labelPhone: 'मोबाइल नंबर',
    yearsUnit: 'साल',
    yearUnit: 'साल',
    noLoginBadge: '🔓 कोई लॉगिन या पासवर्ड नहीं चाहिए • सीधा मोबाइल अपलोड',
    step1Heading: '1. ज़रूरी पहचान पत्र (आधार कार्ड)',
    step1Sub: 'नीचे दिए गए बड़े कार्ड पर टैप करें और कैमरे से साफ फोटो खींचें या गैलरी से चुनें।',
    step2Heading: '2. अन्य पहचान पत्र (वैकल्पिक — ज्यादा काम पाने के लिए)',
    step2Sub: 'पैन कार्ड, ड्राइविंग लाइसेंस या पुलिस वेरिफिकेशन जोड़ने से ग्राहकों का भरोसा बढ़ता है।',
    step3Heading: '3. आपके पुराने काम की 2 फोटो',
    step3Sub: 'ग्राहक आपके काम की फोटो देखकर जल्दी काम देते हैं! अपने किए हुए काम की 2 फोटो डालें।',
    requiredBadge: 'ज़रूरी (Required)',
    optionalBadge: 'वैकल्पिक (Optional)',
    uploadedBadge: 'अपलोड हो गया ✓',
    compressingText: 'फोटो छोटा (<600KB) करके अपलोड हो रहा है…',
    tapToUpload: '📷 फोटो खींचने या गैलरी से चुनने के लिए यहाँ दबाएं',
    tapToChange: '🔄 दूसरी फोटो बदलें',
    compressedLabel: 'फोटो साइज:',
    cards: {
      aadhaar_front: {
        title: 'आधार कार्ड — आगे का भाग (Front)',
        desc: 'आपका नाम, फोटो और 12 अंकों का आधार नंबर साफ दिखना चाहिए।'
      },
      aadhaar_back: {
        title: 'आधार कार्ड — पीछे का भाग (Back)',
        desc: 'पीछे का पता (Address) और QR कोड साफ दिखना चाहिए।'
      },
      pan_front: {
        title: 'पैन कार्ड (PAN Card)',
        desc: 'पैन कार्ड के आगे की साफ फोटो (वैकल्पिक)।'
      },
      voter_driving_front: {
        title: 'वोटर आईडी / ड्राइविंग लाइसेंस',
        desc: 'वोटर कार्ड या ड्राइविंग लाइसेंस की फोटो (वैकल्पिक)।'
      },
      police_verification: {
        title: 'पुलिस वेरिफिकेशन सर्टिफिकेट',
        desc: 'यदि आपके पास पुलिस वेरिफिकेशन है तो अपलोड करें (वैकल्पिक)।'
      },
      work_photo_1: {
        title: 'पुराने काम की फोटो #1',
        desc: 'आपके द्वारा किए गए फर्नीचर, पेंटिंग, प्लंबिंग या रिपेयर काम की फोटो।'
      },
      work_photo_2: {
        title: 'पुराने काम की फोटो #2',
        desc: 'आपके काम की फिनिशिंग दिखाने वाली दूसरी फोटो।'
      }
    },
    submitBtn: '✅ सबमिट करें और 0% कमीशन प्रोफाइल चालू करें',
    submittingBtn: '⏳ आपका प्रोफाइल चालू किया जा रहा है…',
    missingRequiredError: 'प्रोफाइल चालू करने के लिए कृपया आधार कार्ड के आगे (Front) और पीछे (Back) दोनों की फोटो अपलोड करें।',
    uploadFailedError: 'फोटो अपलोड नहीं हो पाई। कृपया दोबारा कोशिश करें।',
    invalidFileTypeError: 'केवल JPEG, PNG और WebP फोटो ही मान्य हैं (अधिकतम 2MB)।',
    fileTooLargeError: 'फोटो का साइज 2MB से अधिक है। कृपया 2MB से कम की JPEG, PNG या WebP फोटो चुनें।',
    securityNote: '🔒 आपके दस्तावेज़ पूरी तरह सुरक्षित हैं और किसी को सार्वजनिक रूप से नहीं दिखाए जाते।',
    loadingSession: 'आपका लिंक जांचा जा रहा है…',
    linkExpiredBadge: 'लिंक समाप्त (Link Expired > 60 मिनट)',
    expiredTitle: 'लिंक समाप्त हो गया है (Link Expired)',
    expiredSubtitle: 'सुरक्षा कारणों से यह लिंक 60 मिनट तक ही मान्य रहता है। नया लिंक पाने के लिए नीचे बटन दबाएं।',
    invalidTitle: 'अमान्य लिंक (Invalid Link)',
    invalidSubtitle: 'हमें यह सेशन नहीं मिला। कृपया लिंक जांचें या नया रजिस्ट्रेशन शुरू करें।',
    restartBtn: '🚀 नया रजिस्ट्रेशन शुरू करें (/join)',
    successTitle: '🎉 बधाई हो, {name} जी!',
    successSubtitle: 'आपका 0% कमीशन वेरिफाइड प्रोफाइल अब चालू हो गया है!',
    successDesc: 'अब {location} के ग्राहक सीधे आपके मोबाइल और व्हाट्सएप पर कॉल करेंगे। आपकी 100% कमाई पूरी आपकी होगी!',
    proCodeLabel: 'आपका प्रो आईडी (Pro Code):',
    viewProfileBtn: '👤 मेरा प्रोफाइल देखें',
    whatsappShareBtn: '📲 व्हाट्सएप पर शेयर करें',
    goHomeBtn: '🏠 होम पेज पर जाएं',
    trades: {
      carpentry: 'बढ़ई / कारपेंटर (Carpenter)',
      painting: 'पेंटर (Painter)',
      plumbing: 'प्लंबर (Plumber)',
      electrical: 'इलेक्ट्रीशियन (Electrician)'
    }
  },
  kn: {
    langName: 'ಕನ್ನಡ',
    languagePrompt: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    zeroCommissionBadge: '0% ಕಮಿಷನ್ • 100% ನೇರ ಗಳಿಕೆ',
    welcomeTitle: 'ನಮಸ್ಕಾರ, {name} ಅವರೇ! 🙏',
    welcomeSubtitle: 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ. ಕೆಳಗೆ ಟ್ಯಾಪ್ ಮಾಡಿ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ 0% ಕಮಿಷನ್ ಪ್ರೊಫೈಲ್ ಸಕ್ರಿಯಗೊಳಿಸಿ.',
    prefilledTitle: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ವಿವರಗಳು',
    labelName: 'ಹೆಸರು',
    labelTrade: 'ವೃತ್ತಿ / ಕೆಲಸ',
    labelLocation: 'ಪ್ರದೇಶ / ನಗರ',
    labelExperience: 'ಅನುಭವ',
    labelPhone: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    yearsUnit: 'ವರ್ಷಗಳು',
    yearUnit: 'ವರ್ಷ',
    noLoginBadge: '🔓 ಲಾಗಿನ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ • ನೇರ ಮೊಬೈಲ್ ಅಪ್‌ಲೋಡ್',
    step1Heading: '1. ಕಡ್ಡಾಯ ಗುರುತಿನ ಚೀಟಿ (ಆಧಾರ್ ಕಾರ್ಡ್)',
    step1Sub: 'ಫೋನ್ ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಲು ಅಥವಾ ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆ ಮಾಡಲು ಕೆಳಗಿನ ಕಾರ್ಡ್ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ.',
    step2Heading: '2. ಹೆಚ್ಚುವರಿ ಗುರುತಿನ ಚೀಟಿ (ಐಚ್ಛಿಕ — ಹೆಚ್ಚು ಕೆಲಸ ಪಡೆಯಲು)',
    step2Sub: 'ಪ್ಯಾನ್ ಕಾರ್ಡ್, ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್ ಅಥವಾ ಪೊಲೀಸ್ ವೆರಿಫಿಕೇಶನ್ ಸೇರಿಸುವುದರಿಂದ ಗ್ರಾಹಕರ ನಂಬಿಕೆ ಹೆಚ್ಚುತ್ತದೆ.',
    step3Heading: '3. ನಿಮ್ಮ ಹಿಂದಿನ ಕೆಲಸದ 2 ಫೋಟೋಗಳು',
    step3Sub: 'ನೀವು ಮಾಡಿದ ಕೆಲಸದ 2 ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಗ್ರಾಹಕರು ಕೆಲಸದ ಫೋಟೋ ನೋಡಿ ಬೇಗ ಕರೆ ಮಾಡುತ್ತಾರೆ!',
    requiredBadge: 'ಕಡ್ಡಾಯ (Required)',
    optionalBadge: 'ಐಚ್ಛಿಕ (Optional)',
    uploadedBadge: 'ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ ✓',
    compressingText: 'ಫೋಟೋ ಗಾತ್ರ ಕಡಿಮೆ ಮಾಡಿ (<600KB) ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ…',
    tapToUpload: '📷 ಫೋಟೋ ತೆಗೆಯಲು ಅಥವಾ ಗ್ಯಾಲರಿಯಿಂದ ಆರಿಸಲು ಇಲ್ಲಿ ಟ್ಯಾಪ್ ಮಾಡಿ',
    tapToChange: '🔄 ಫೋಟೋ ಬದಲಾಯಿಸಿ',
    compressedLabel: 'ಫೋಟೋ ಗಾತ್ರ:',
    cards: {
      aadhaar_front: {
        title: 'ಆಧಾರ್ ಕಾರ್ಡ್ — ಮುಂಭಾಗ (Front)',
        desc: 'ನಿಮ್ಮ ಹೆಸರು, ಫೋಟೋ ಮತ್ತು 12 ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಬೇಕು.'
      },
      aadhaar_back: {
        title: 'ಆಧಾರ್ ಕಾರ್ಡ್ — ಹಿಂಭಾಗ (Back)',
        desc: 'ನಿಮ್ಮ ವಿಳಾಸ ಮತ್ತು QR ಕೋಡ್ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಬೇಕು.'
      },
      pan_front: {
        title: 'ಪ್ಯಾನ್ ಕಾರ್ಡ್ (PAN Card)',
        desc: 'ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಮುಂಭಾಗದ ಫೋಟೋ (ಐಚ್ಛಿಕ).'
      },
      voter_driving_front: {
        title: 'ವೋಟರ್ ಐಡಿ / ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್',
        desc: 'ವೋಟರ್ ಐಡಿ ಅಥವಾ ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್ ಫೋಟೋ (ಐಚ್ಛಿಕ).'
      },
      police_verification: {
        title: 'ಪೊಲೀಸ್ ವೆರಿಫಿಕೇಶನ್ ಪ್ರಮಾಣಪತ್ರ',
        desc: 'ಪೊಲೀಸ್ ಪರಿಶೀಲನಾ ಪತ್ರ ಇದ್ದರೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಐಚ್ಛಿಕ).'
      },
      work_photo_1: {
        title: 'ಹಿಂದಿನ ಕೆಲಸದ ಫೋಟೋ #1',
        desc: 'ನೀವು ಮಾಡಿದ ಮರದ ಕೆಲಸ, ಪೇಂಟಿಂಗ್, ಪ್ಲಂಬಿಂಗ್ ಅಥವಾ ರಿಪೇರಿ ಫೋಟೋ.'
      },
      work_photo_2: {
        title: 'ಹಿಂದಿನ ಕೆಲಸದ ಫೋಟೋ #2',
        desc: 'ನಿಮ್ಮ ಕೆಲಸದ ಗುಣಮಟ್ಟ ತೋರಿಸುವ ಮತ್ತೊಂದು ಫೋಟೋ.'
      }
    },
    submitBtn: '✅ ಸಲ್ಲಿಸಿ & 0% ಕಮಿಷನ್ ಪ್ರೊಫೈಲ್ ಸಕ್ರಿಯಗೊಳಿಸಿ',
    submittingBtn: '⏳ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗುತ್ತಿದೆ…',
    missingRequiredError: 'ದಯವಿಟ್ಟು ಆಧಾರ್ ಕಾರ್ಡ್ ಮುಂಭಾಗ ಮತ್ತು ಹಿಂಭಾಗದ ಎರಡೂ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    uploadFailedError: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    invalidFileTypeError: 'ಕೇವಲ JPEG, PNG ಮತ್ತು WebP ಫೋಟೋಗಳನ್ನು ಮಾತ್ರ ಅನುಮತಿಸಲಾಗಿದೆ (ಗರಿಷ್ಠ 2MB).',
    fileTooLargeError: 'ಫೋಟೋ ಗಾತ್ರ 2MB ಮೀರಿದೆ. ದಯವಿಟ್ಟು 2MB ಒಳಗಿನ ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ.',
    securityNote: '🔒 ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಸಾರ್ವಜನಿಕವಾಗಿ ತೋರಿಸಲಾಗುವುದಿಲ್ಲ.',
    loadingSession: 'ನಿಮ್ಮ ಆನ್‌ಬೋರ್ಡಿಂಗ್ ಲಿಂಕ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…',
    linkExpiredBadge: 'ಲಿಂಕ್ ಅವಧಿ ಮುಗಿದಿದೆ (Link Expired > 60 ನಿಮಿಷ)',
    expiredTitle: 'ಲಿಂಕ್ ಅವಧಿ ಮುಗಿದಿದೆ (Link Expired)',
    expiredSubtitle: 'ಭದ್ರತಾ ಕಾರಣಗಳಿಗಾಗಿ ಈ ಲಿಂಕ್ 60 ನಿಮಿಷಗಳವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ. ಹೊಸ ಲಿಂಕ್ ಪಡೆಯಲು ಕೆಳಗೆ ಟ್ಯಾಪ್ ಮಾಡಿ.',
    invalidTitle: 'ಅಮಾನ್ಯ ಲಿಂಕ್ (Invalid Link)',
    invalidSubtitle: 'ಈ ಸೆಷನ್ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಲಿಂಕ್ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಹೊಸ ನೋಂದಣಿ ಪ್ರಾರಂಭಿಸಿ.',
    restartBtn: '🚀 ಹೊಸ ನೋಂದಣಿ ಪ್ರಾರಂಭಿಸಿ (/join)',
    successTitle: '🎉 ಅಭಿನಂದನೆಗಳು, {name} ಅವರೇ!',
    successSubtitle: 'ನಿಮ್ಮ 0% ಕಮಿಷನ್ ಪರಿಶೀಲಿಸಿದ ಪ್ರೊಫೈಲ್ ಈಗ ಸಕ್ರಿಯವಾಗಿದೆ!',
    successDesc: '{location} ನಲ್ಲಿರುವ ಗ್ರಾಹಕರು ಈಗ ನಿಮಗೆ ನೇರವಾಗಿ ಫೋನ್ ಅಥವಾ WhatsApp ಕರೆ ಮಾಡಬಹುದು. 100% ಸಂಪೂರ್ಣ ಗಳಿಕೆ ನಿಮ್ಮದೇ!',
    proCodeLabel: 'ನಿಮ್ಮ ಪ್ರೊ ಕೋಡ್ (Pro ID):',
    viewProfileBtn: '👤 ನನ್ನ ಪ್ರೊಫೈಲ್ ನೋಡಿ',
    whatsappShareBtn: '📲 WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ',
    goHomeBtn: '🏠 ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ',
    trades: {
      carpentry: 'ಕಾರ್ಪೆಂಟರ್ / ಬಡಗಿ (Carpenter)',
      painting: 'ಪೇಂಟರ್ (Painter)',
      plumbing: 'ಪ್ಲಂಬರ್ (Plumber)',
      electrical: 'ಎಲೆಕ್ಟ್ರೀಷಿಯನ್ (Electrician)'
    }
  },
  ta: {
    langName: 'தமிழ்',
    languagePrompt: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:',
    zeroCommissionBadge: '0% கமிஷன் • 100% நேரடி வருமானம்',
    welcomeTitle: 'வணக்கம், {name} அவர்களே! 🙏',
    welcomeSubtitle: 'உங்கள் விவரங்கள் சேமிக்கப்பட்டன. கீழே தட்டி புகைப்படங்களை பதிவேற்றி உங்கள் 0% கமிஷன் சுயவிவரத்தை தொடங்கவும்.',
    prefilledTitle: 'உங்கள் சுயவிவர விவரங்கள்',
    labelName: 'பெயர்',
    labelTrade: 'தொழில்',
    labelLocation: 'பகுதி / நகரம்',
    labelExperience: 'அனுபவம்',
    labelPhone: 'மொபைல் எண்',
    yearsUnit: 'ஆண்டுகள்',
    yearUnit: 'ஆண்டு',
    noLoginBadge: '🔓 லாகின் அல்லது பாஸ்வேர்ட் தேவையில்லை • நேரடி மொபைல் பதிவேற்றம்',
    step1Heading: '1. கட்டாய அடையாள அட்டை (ஆதார் அட்டை)',
    step1Sub: 'உங்கள் போன் கேமரா மூலம் தெளிவான புகைப்படம் எடுக்க அல்லது கேலரியில் இருந்து தேர்வு செய்ய கீழே தட்டவும்.',
    step2Heading: '2. கூடுதல் அடையாள அட்டை (விருப்பத்திற்குரியது)',
    step2Sub: 'பான் கார்டு, டிரைவிங் லைசென்ஸ் அல்லது போலீஸ் சரிபார்ப்பு சேர்ப்பது வாடிக்கையாளர் நம்பிக்கையை அதிகரிக்கும்.',
    step3Heading: '3. நீங்கள் செய்த வேலையின் 2 புகைப்படங்கள்',
    step3Sub: 'நீங்கள் செய்த தச்சு, பெயிண்டிங், பிளம்பிங் அல்லது எலக்ட்ரிக்கல் வேலையின் 2 புகைப்படங்களை பதிவேற்றவும்.',
    requiredBadge: 'கட்டாயம் (Required)',
    optionalBadge: 'விருப்பம் (Optional)',
    uploadedBadge: 'பதிவேற்றப்பட்டது ✓',
    compressingText: 'புகைப்படம் சுருக்கப்பட்டு (<600KB) பதிவேற்றப்படுகிறது…',
    tapToUpload: '📷 புகைப்படம் எடுக்க / கேலரியில் தேர்வு செய்ய தட்டவும்',
    tapToChange: '🔄 புகைப்படத்தை மாற்றவும்',
    compressedLabel: 'அளவு:',
    cards: {
      aadhaar_front: {
        title: 'ஆதார் அட்டை — முன்பக்கம் (Front)',
        desc: 'உங்கள் பெயர், புகைப்படம் மற்றும் 12 இலக்க ஆதார் எண் தெளிவாகத் தெரிய வேண்டும்.'
      },
      aadhaar_back: {
        title: 'ஆதார் அட்டை — பின்பக்கம் (Back)',
        desc: 'உங்கள் முகவரி மற்றும் QR குறியீடு தெளிவாகத் தெரிய வேண்டும்.'
      },
      pan_front: {
        title: 'பான் கார்டு (PAN Card)',
        desc: 'பான் கார்டின் முன்பக்க புகைப்படம் (விருப்பம்).'
      },
      voter_driving_front: {
        title: 'வாக்காளர் அட்டை / ஓட்டுநர் உரிமம்',
        desc: 'Voter ID அல்லது Driving Licence புகைப்படம் (விருப்பம்).'
      },
      police_verification: {
        title: 'போலீஸ் சரிபார்ப்பு சான்றிதழ்',
        desc: 'போலீஸ் சரிபார்ப்பு சான்றிதழ் இருந்தால் பதிவேற்றவும் (விருப்பம்).'
      },
      work_photo_1: {
        title: 'செய்த வேலையின் புகைப்படம் #1',
        desc: 'நீங்கள் முடித்த வேலையின் தெளிவான புகைப்படம்.'
      },
      work_photo_2: {
        title: 'செய்த வேலையின் புகைப்படம் #2',
        desc: 'உங்கள் பணித்திறனைக் காட்டும் மற்றொரு புகைப்படம்.'
      }
    },
    submitBtn: '✅ சமர்ப்பித்து 0% கமிஷன் சுயவிவரத்தைத் தொடங்கவும்',
    submittingBtn: '⏳ உங்கள் சுயவிவரம் செயல்படுத்தப்படுகிறது…',
    missingRequiredError: 'தயவுசெய்து ஆதார் அட்டையின் முன்பக்கம் மற்றும் பின்பக்கம் ஆகிய இரண்டு புகைப்படங்களையும் பதிவேற்றவும்.',
    uploadFailedError: 'புகைப்படம் பதிவேற்றுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.',
    invalidFileTypeError: 'JPEG, PNG மற்றும் WebP புகைப்படங்கள் மட்டுமே அனுமதிக்கப்படுகின்றன (அதிகபட்சம் 2MB).',
    fileTooLargeError: 'புகைப்பட அளவு 2MB-ஐ விட அதிகமாக உள்ளது. 2MB-க்குள் உள்ள புகைப்படத்தைத் தேர்ந்தெடுக்கவும்.',
    securityNote: '🔒 உங்கள் ஆவணங்கள் பாதுகாப்பாக வைக்கப்படும், பொதுவில் காட்டப்படாது.',
    loadingSession: 'உங்கள் இணைப்பு சரிபார்க்கப்படுகிறது…',
    linkExpiredBadge: 'இணைப்பு காலாவதியானது (Link Expired > 60 நிமிடம்)',
    expiredTitle: 'இணைப்பு காலாவதியாகிவிட்டது (Link Expired)',
    expiredSubtitle: 'பாதுகாப்பு காரணங்களுக்காக இந்த இணைப்பு 60 நிமிடங்களுக்கு மட்டுமே செல்லுபடியாகும். புதிய இணைப்பைப் பெற கீழே தட்டவும்.',
    invalidTitle: 'தவறான இணைப்பு (Invalid Link)',
    invalidSubtitle: 'இந்தப் பதிவு விவரம் கிடைக்கவில்லை. புதிய பதிவைத் தொடங்கவும்.',
    restartBtn: '🚀 புதிய பதிவைத் தொடங்கவும் (/join)',
    successTitle: '🎉 வாழ்த்துக்கள், {name} அவர்களே!',
    successSubtitle: 'உங்கள் 0% கமிஷன் சரிபார்க்கப்பட்ட சுயவிவரம் இப்போது செயல்பாட்டில் உள்ளது!',
    successDesc: '{location} பகுதியிலுள்ள வாடிக்கையாளர்கள் இப்போது உங்களை நேரடியாக மொபைல் அல்லது WhatsApp மூலம் அழைக்கலாம். 100% வருமானம் உங்களுக்கே!',
    proCodeLabel: 'உங்கள் ப்ரோ குறியீடு (Pro ID):',
    viewProfileBtn: '👤 எனது சுயவிவரத்தைப் பார்க்கவும்',
    whatsappShareBtn: '📲 WhatsApp-ல் பகிரவும்',
    goHomeBtn: '🏠 முகப்புப் பக்கத்திற்குச் செல்லவும்',
    trades: {
      carpentry: 'தச்சர் / கார்பெண்டர் (Carpenter)',
      painting: 'பெயிண்டர் (Painter)',
      plumbing: 'பிளம்பர் (Plumber)',
      electrical: 'எலக்ட்ரீஷியன் (Electrician)'
    }
  },
  te: {
    langName: 'తెలుగు',
    languagePrompt: 'మీ భాషను ఎంచుకోండి:',
    zeroCommissionBadge: '0% కమీషన్ • 100% నేరుగా మీ సంపాదన',
    welcomeTitle: 'నమస్కారం, {name} గారు! 🙏',
    welcomeSubtitle: 'మీ వివరాలు సేవ్ చేయబడ్డాయి. క్రింద నొక్కి మీ ఫోటోలను అప్‌లోడ్ చేసి, 0% కమీషన్ ప్రొఫైల్‌ను ఆక్టివేట్ చేయండి.',
    prefilledTitle: 'మీ ప్రొఫైల్ వివరాలు',
    labelName: 'పేరు',
    labelTrade: 'వృత్తి / పని',
    labelLocation: 'ప్రాంతం / నగరం',
    labelExperience: 'అనుభవం',
    labelPhone: 'మొబైల్ నంబర్',
    yearsUnit: 'సంవత్సరాలు',
    yearUnit: 'సంవత్సరం',
    noLoginBadge: '🔓 లాగిన్ లేదా పాస్‌వర్డ్ అవసరం లేదు • నేరుగా మొబైల్ అప్‌లోడ్',
    step1Heading: '1. తప్పనిసరి గుర్తింపు కార్డు (ఆధార్ కార్డు)',
    step1Sub: 'ఫోన్ కెమెరాతో స్పష్టమైన ఫోటో తీయడానికి లేదా గ్యాలరీ నుండి ఎంచుకోవడానికి క్రింది కార్డుపై నొక్కండి.',
    step2Heading: '2. అదనపు గుర్తింపు కార్డు (ఐచ్ఛికం — ఎక్కువ పనుల కోసం)',
    step2Sub: 'పాన్ కార్డు, డ్రైవింగ్ లైసెన్స్ లేదా పోలీస్ వెరిఫికేషన్ జోడించడం వల్ల కస్టమర్ల నమ్మకం పెరుగుతుంది.',
    step3Heading: '3. మీరు చేసిన పాత పని యొక్క 2 ఫోటోలు',
    step3Sub: 'మీరు చేసిన ఫర్నిచర్, పెయింటింగ్, ప్లంబింగ్ లేదా రిపేర్ పని యొక్క 2 ఫోటోలను అప్‌లోడ్ చేయండి.',
    requiredBadge: 'తప్పనిసరి (Required)',
    optionalBadge: 'ఐచ్ఛికం (Optional)',
    uploadedBadge: 'అప్‌లోడ్ అయింది ✓',
    compressingText: 'ఫోటో సైజు తగ్గించి (<600KB) అప్‌లోడ్ అవుతోంది…',
    tapToUpload: '📷 ఫోటో తీయడానికి లేదా గ్యాలరీ నుండి ఎంచుకోవడానికి ఇక్కడ నొక్కండి',
    tapToChange: '🔄 ఫోటో మార్చండి',
    compressedLabel: 'ఫోటో సైజు:',
    cards: {
      aadhaar_front: {
        title: 'ఆధార్ కార్డు — ముందు భాగం (Front)',
        desc: 'మీ పేరు, ఫోటో మరియు 12 అంకెల ఆధార్ నంబర్ స్పష్టంగా కనిపించాలి.'
      },
      aadhaar_back: {
        title: 'ఆధార్ కార్డు — వెనుక భాగం (Back)',
        desc: 'మీ చిరునామా (Address) మరియు QR కోడ్ స్పష్టంగా కనిపించాలి.'
      },
      pan_front: {
        title: 'పాన్ కార్డు (PAN Card)',
        desc: 'పాన్ కార్డు ముందు భాగం ఫోటో (ఐచ్ఛికం).'
      },
      voter_driving_front: {
        title: 'ఓటర్ ఐడి / డ్రైవింగ్ లైసెన్స్',
        desc: 'ఓటర్ కార్డు లేదా డ్రైవింగ్ లైసెన్స్ ఫోటో (ఐచ్ఛికం).'
      },
      police_verification: {
        title: 'పోలీస్ వెరిఫికేషన్ సర్టిఫికేట్',
        desc: 'పోలీస్ వెరిఫికేషన్ కాపీ ఉంటే అప్‌లోడ్ చేయండి (ఐచ్ఛికం).'
      },
      work_photo_1: {
        title: 'మీ పని ఫోటో #1',
        desc: 'మీరు పూర్తి చేసిన పని యొక్క స్పష్టమైన ఫోటో.'
      },
      work_photo_2: {
        title: 'మీ పని ఫోటో #2',
        desc: 'మీ పని నాణ్యతను చూపే మరొక ఫోటో.'
      }
    },
    submitBtn: '✅ సబ్మిట్ చేయండి & 0% కమీషన్ ప్రొఫైల్ ఆక్టివేట్ చేయండి',
    submittingBtn: '⏳ మీ ప్రొఫైల్ ఆక్టివేట్ అవుతోంది…',
    missingRequiredError: 'దయచేసి ఆధార్ కార్డు ముందు (Front) మరియు వెనుక (Back) రెండు ఫోటోలను అప్‌లోడ్ చేయండి.',
    uploadFailedError: 'ఫోటో అప్‌లోడ్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    invalidFileTypeError: 'JPEG, PNG మరియు WebP ఫోటోలు మాత్రమే అనుమతించబడతాయి (గరిష్టంగా 2MB).',
    fileTooLargeError: 'ఫోటో సైజు 2MB కంటే ఎక్కువగా ఉంది. దయచేసి 2MB లోపు ఫోటోను ఎంచుకోండి.',
    securityNote: '🔒 మీ ఐడి పత్రాలు సురక్షితంగా దాచబడతాయి మరియు బయట ఎవరికీ కనిపించవు.',
    loadingSession: 'మీ లింక్ తనిఖీ చేయబడుతోంది…',
    linkExpiredBadge: 'లింక్ గడువు ముగిసింది (Link Expired > 60 నిమిషాలు)',
    expiredTitle: 'లింక్ గడువు ముగిసింది (Link Expired)',
    expiredSubtitle: 'భద్రతా కారణాల వల్ల ఈ లింక్ 60 నిమిషాలు మాత్రమే పనిచేస్తుంది. కొత్త లింక్ కోసం క్రింద నొక్కండి.',
    invalidTitle: 'చెల్లని లింక్ (Invalid Link)',
    invalidSubtitle: 'ఈ సెషన్ కనుగొనబడలేదు. దయచేసి కొత్త రిజిస్ట్రేషన్ ప్రారంభించండి.',
    restartBtn: '🚀 కొత్త రిజిస్ట్రేషన్ ప్రారంభించండి (/join)',
    successTitle: '🎉 అభినందనలు, {name} గారు!',
    successSubtitle: 'మీ 0% కమీషన్ ధృవీకరించబడిన ప్రొఫైల్ ఇప్పుడు ఆక్టివేట్ అయింది!',
    successDesc: '{location} లోని కస్టమర్లు ఇప్పుడు నేరుగా మీ మొబైల్ లేదా WhatsApp కు కాల్ చేయగలరు. 100% సంపాదన మీదే!',
    proCodeLabel: 'మీ ప్రో కోడ్ (Pro ID):',
    viewProfileBtn: '👤 నా ప్రొఫైల్ చూడండి',
    whatsappShareBtn: '📲 WhatsApp లో షేర్ చేయండి',
    goHomeBtn: '🏠 హోమ్ పేజీకి వెళ్లండి',
    trades: {
      carpentry: 'కార్పెంటర్ / వడ్రంగి (Carpenter)',
      painting: 'పెయింటర్ (Painter)',
      plumbing: 'ప్లంబర్ (Plumber)',
      electrical: 'ఎలక్ట్రీషియన్ (Electrician)'
    }
  },
  mr: {
    langName: 'मराठी',
    languagePrompt: 'तुमची भाषा निवडा:',
    zeroCommissionBadge: '0% कमिशन • 100% थेट कमाई',
    welcomeTitle: 'नमस्कार, {name} जी! 🙏',
    welcomeSubtitle: 'तुमची माहिती सेव्ह झाली आहे. खाली टॅप करून तुमचे फोटो अपलोड करा आणि तुमचे 0% कमिशन प्रोफाइल सुरू करा.',
    prefilledTitle: 'तुमची नोंदवलेली माहिती',
    labelName: 'नाव',
    labelTrade: 'काम / व्यवसाय',
    labelLocation: 'परिसर / शहर',
    labelExperience: 'अनुभव',
    labelPhone: 'मोबाईल नंबर',
    yearsUnit: 'वर्षे',
    yearUnit: 'वर्ष',
    noLoginBadge: '🔓 लॉगिन किंवा पासवर्डची गरज नाही • थेट मोबाईल अपलोड',
    step1Heading: '1. आवश्यक ओळखपत्र (आधार कार्ड)',
    step1Sub: 'मोबाईल कॅमेऱ्याने स्पष्ट फोटो काढण्यासाठी किंवा गॅलरीतून निवडण्यासाठी खालील कार्डवर टॅप करा.',
    step2Heading: '2. इतर ओळखपत्र (ऐच्छिक — जास्त काम मिळवण्यासाठी)',
    step2Sub: 'पॅन कार्ड, ड्रायव्हिंग लायसन्स किंवा पोलीस व्हेरिफिकेशन जोडल्यास ग्राहकांचा विश्वास वाढतो.',
    step3Heading: '3. तुमच्या कामाचे 2 फोटो',
    step3Sub: 'तुम्ही केलेल्या फर्निचर, पेंटिंग, प्लंबिंग किंवा दुरुस्ती कामाचे 2 फोटो अपलोड करा.',
    requiredBadge: 'आवश्यक (Required)',
    optionalBadge: 'ऐच्छिक (Optional)',
    uploadedBadge: 'अपलोड झाले ✓',
    compressingText: 'फोटो रिसाईज (<600KB) करून अपलोड होत आहे…',
    tapToUpload: '📷 फोटो काढण्यासाठी किंवा गॅलरीतून निवडण्यासाठी येथे दाबा',
    tapToChange: '🔄 दुसरा फोटो बदला',
    compressedLabel: 'फोटो साईज:',
    cards: {
      aadhaar_front: {
        title: 'आधार कार्ड — पुढील बाजू (Front)',
        desc: 'तुमचे नाव, फोटो आणि 12 अंकी आधार नंबर स्पष्ट दिसला पाहिजे.'
      },
      aadhaar_back: {
        title: 'आधार कार्ड — मागील बाजू (Back)',
        desc: 'मागील बाजूचा पत्ता (Address) आणि QR कोड स्पष्ट दिसला पाहिजे.'
      },
      pan_front: {
        title: 'पॅन कार्ड (PAN Card)',
        desc: 'पॅन कार्डच्या पुढील बाजूचा फोटो (ऐच्छिक).'
      },
      voter_driving_front: {
        title: 'मतदान ओळखपत्र / ड्रायव्हिंग लायसन्स',
        desc: 'Voter ID किंवा Driving Licence चा फोटो (ऐच्छिक).'
      },
      police_verification: {
        title: 'पोलीस व्हेरिफिकेशन प्रमाणपत्र',
        desc: 'पोलीस व्हेरिफिकेशन असल्यास अपलोड करा (ऐच्छिक).'
      },
      work_photo_1: {
        title: 'कामाचा फोटो #1',
        desc: 'तुम्ही पूर्ण केलेल्या कामाचा स्पष्ट फोटो.'
      },
      work_photo_2: {
        title: 'कामाचा फोटो #2',
        desc: 'तुमच्या कामाची गुणवत्ता दाखवणारा दुसरा फोटो.'
      }
    },
    submitBtn: '✅ सबमिट करा आणि 0% कमिशन प्रोफाइल सुरू करा',
    submittingBtn: '⏳ तुमचे प्रोफाइल सुरू केले जात आहे…',
    missingRequiredError: 'कृपया प्रोफाइल सुरू करण्यासाठी आधार कार्डच्या पुढील (Front) आणि मागील (Back) दोन्ही बाजूंचे फोटो अपलोड करा.',
    uploadFailedError: 'फोटो अपलोड झाला नाही. कृपया पुन्हा प्रयत्न करा.',
    invalidFileTypeError: 'केवळ JPEG, PNG आणि WebP फोटो स्वीकारले जातात (कमाल 2MB).',
    fileTooLargeError: 'फोटोची साईज 2MB पेक्षा जास्त आहे. कृपया 2MB पेक्षा कमी साईजचा फोटो निवडा.',
    securityNote: '🔒 तुमची कागदपत्रे पूर्णपणे सुरक्षित आहेत आणि सार्वजनिकरित्या कोणालाही दाखवली जात नाहीत.',
    loadingSession: 'तुमची लिंक तपासली जात आहे…',
    linkExpiredBadge: 'लिंक कालबाह्य (Link Expired > 60 मिनिटे)',
    expiredTitle: 'ही लिंक कालबाह्य झाली आहे (Link Expired)',
    expiredSubtitle: 'सुरक्षेसाठी ही लिंक 60 मिनिटांसाठीच वैध असते. नवीन लिंक मिळवण्यासाठी खालील बटण दाबा.',
    invalidTitle: 'अवैध लिंक (Invalid Link)',
    invalidSubtitle: 'हे सेशन सापडले नाही. कृपया नवीन नोंदणी सुरू करा.',
    restartBtn: '🚀 नवीन नोंदणी सुरू करा (/join)',
    successTitle: '🎉 अभिनंदन, {name} जी!',
    successSubtitle: 'तुमचे 0% कमिशन व्हेरिफाईड प्रोफाइल आता सुरू झाले आहे!',
    successDesc: '{location} मधील ग्राहक आता थेट तुमच्या मोबाईल किंवा WhatsApp वर कॉल करू शकतात. 100% कमाई तुमचीच!',
    proCodeLabel: 'तुमचा प्रो आयडी (Pro Code):',
    viewProfileBtn: '👤 माझे प्रोफाइल पहा',
    whatsappShareBtn: '📲 WhatsApp वर शेअर करा',
    goHomeBtn: '🏠 होम पेजवर जा',
    trades: {
      carpentry: 'सुतार / कारपेंटर (Carpenter)',
      painting: 'पेंटर (Painter)',
      plumbing: 'प्लंबर (Plumber)',
      electrical: 'इलेक्ट्रिशियन (Electrician)'
    }
  },
  bn: {
    langName: 'বাংলা',
    languagePrompt: 'আপনার ভাষা বেছে নিন:',
    zeroCommissionBadge: '0% কমিশন • 100% সরাসরি আয়',
    welcomeTitle: 'নমস্কার, {name} জি! 🙏',
    welcomeSubtitle: 'আপনার তথ্য সেভ করা হয়েছে। নিচে ট্যাপ করে ছবি আপলোড করুন এবং আপনার 0% কমিশন প্রোফাইল চালু করুন।',
    prefilledTitle: 'আপনার প্রোফাইল তথ্য',
    labelName: 'নাম',
    labelTrade: 'পেশা / কাজ',
    labelLocation: 'এলাকা / শহর',
    labelExperience: 'অভিজ্ঞতা',
    labelPhone: 'মোবাইল নম্বর',
    yearsUnit: 'বছর',
    yearUnit: 'বছর',
    noLoginBadge: '🔓 কোনো লগইন বা পাসওয়ার্ড লাগবে না • সরাসরি মোবাইল আপলোড',
    step1Heading: '1. আবশ্যক পরিচয়পত্র (আধার কার্ড)',
    step1Sub: 'ফোনের ক্যামেরা দিয়ে স্পষ্ট ছবি তুলতে বা গ্যালারি থেকে বেছে নিতে নিচের কার্ডে ট্যাপ করুন।',
    step2Heading: '2. অতিরিক্ত পরিচয়পত্র (ঐচ্ছিক — বেশি কাজ পাওয়ার জন্য)',
    step2Sub: 'প্যান কার্ড, ড্রাইভিং লাইসেন্স বা পুলিশ ভেরিফিকেশন দিলে গ্রাহকদের আস্থা বাড়ে।',
    step3Heading: '3. আপনার আগের কাজের ২টি ছবি',
    step3Sub: 'আপনার করা ফার্নিচার, পেইন্টিং, প্লাম্বিং বা রিপেয়ার কাজের ২টি ছবি আপলোড করুন।',
    requiredBadge: 'আবশ্যক (Required)',
    optionalBadge: 'ঐচ্ছিক (Optional)',
    uploadedBadge: 'আপলোড হয়েছে ✓',
    compressingText: 'ছবি ছোট (<600KB) করে আপলোড হচ্ছে…',
    tapToUpload: '📷 ছবি তুলতে বা গ্যালারি থেকে বেছে নিতে এখানে চাপুন',
    tapToChange: '🔄 ছবি পরিবর্তন করুন',
    compressedLabel: 'ছবির সাইজ:',
    cards: {
      aadhaar_front: {
        title: 'আধার কার্ড — সামনের দিক (Front)',
        desc: 'আপনার নাম, ছবি এবং ১২ সংখ্যার আধার নম্বর স্পষ্ট দেখা যাওয়া চাই।'
      },
      aadhaar_back: {
        title: 'আধার কার্ড — পেছনের দিক (Back)',
        desc: 'পেছনের ঠিকানা (Address) এবং QR কোড স্পষ্ট দেখা যাওয়া চাই।'
      },
      pan_front: {
        title: 'প্যান কার্ড (PAN Card)',
        desc: 'প্যান কার্ডের সামনের দিকের ছবি (ঐচ্ছিক)।'
      },
      voter_driving_front: {
        title: 'ভোটার আইডি / ড্রাইভিং লাইসেন্স',
        desc: 'ভোটার কার্ড বা ড্রাইভিং লাইসেন্সের ছবি (ঐচ্ছিক)।'
      },
      police_verification: {
        title: 'পুলিশ ভেরিফিকেশন সার্টিফিকেট',
        desc: 'পুলিশ ভেরিফিকেশন থাকলে আপলোড করুন (ঐচ্ছিক)।'
      },
      work_photo_1: {
        title: 'আগের কাজের ছবি #1',
        desc: 'আপনার করা যেকোনো কাজের একটি স্পষ্ট ছবি।'
      },
      work_photo_2: {
        title: 'আগের কাজের ছবি #2',
        desc: 'আপনার কাজের ফিনিশিং দেখানোর জন্য আরেকটি ছবি।'
      }
    },
    submitBtn: '✅ সাবমিট করুন ও 0% কমিশন প্রোফাইল চালু করুন',
    submittingBtn: '⏳ আপনার প্রোফাইল চালু করা হচ্ছে…',
    missingRequiredError: 'প্রোফাইল চালু করতে অনুগ্রহ করে আধার কার্ডের সামনের (Front) এবং পেছনের (Back) দুটি ছবিই আপলোড করুন।',
    uploadFailedError: 'ছবি আপলোড হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
    invalidFileTypeError: 'শুধুমাত্র JPEG, PNG এবং WebP ছবি অনুমোদিত (সর্বোচ্চ 2MB)।',
    fileTooLargeError: 'ছবির সাইজ 2MB-এর বেশি। অনুগ্রহ করে 2MB-এর কম সাইজের ছবি বেছে নিন।',
    securityNote: '🔒 আপনার নথিপত্র সম্পূর্ণ সুরক্ষিত এবং প্রকাশ্যে কাউকে দেখানো হয় না।',
    loadingSession: 'আপনার লিঙ্ক যাচাই করা হচ্ছে…',
    linkExpiredBadge: 'লিঙ্কের মেয়াদ শেষ (Link Expired > ৬০ মিনিট)',
    expiredTitle: 'লিঙ্কের মেয়াদ শেষ হয়ে গেছে (Link Expired)',
    expiredSubtitle: 'নিরাপত্তার কারণে এই লিঙ্কটি ৬০ মিনিটের জন্য বৈধ থাকে। নতুন লিঙ্ক পেতে নিচে ট্যাপ করুন।',
    invalidTitle: 'অবৈধ লিঙ্ক (Invalid Link)',
    invalidSubtitle: 'এই সেশনটি পাওয়া যায়নি। অনুগ্রহ করে নতুন রেজিস্ট্রেশন শুরু করুন।',
    restartBtn: '🚀 নতুন রেজিস্ট্রেশন শুরু করুন (/join)',
    successTitle: '🎉 অভিনন্দন, {name} জি!',
    successSubtitle: 'আপনার 0% কমিশন ভেরিফায়েড প্রোফাইল এখন চালু হয়ে গেছে!',
    successDesc: '{location}-এর গ্রাহকরা এখন সরাসরি আপনার মোবাইল বা WhatsApp-এ কল করতে পারবেন। আপনার ১০০% আয় সম্পূর্ণ আপনার!',
    proCodeLabel: 'আপনার প্রো আইডি (Pro Code):',
    viewProfileBtn: '👤 আমার প্রোফাইল দেখুন',
    whatsappShareBtn: '📲 WhatsApp-এ শেয়ার করুন',
    goHomeBtn: '🏠 হোম পেজে যান',
    trades: {
      carpentry: 'ছুতোর / কার্পেন্টার (Carpenter)',
      painting: 'পেইন্টার (Painter)',
      plumbing: 'প্লাম্বার (Plumber)',
      electrical: 'ইলেকট্রিশিয়ান (Electrician)'
    }
  }
};
