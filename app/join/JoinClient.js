'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const TRADE_OPTIONS = [
  { id: 'carpentry', label: 'Carpenter', labelHi: 'कारपेंटर', icon: '🪚' },
  { id: 'painting', label: 'Painter', labelHi: 'पेंटर', icon: '🎨' },
  { id: 'plumbing', label: 'Plumber', labelHi: 'प्लंबर', icon: '🔧' },
  { id: 'electrical', label: 'Electrician', labelHi: 'इलेक्ट्रीशियन', icon: '⚡' }
];

const LOCALITY_SUGGESTIONS = [
  'Whitefield',
  'Koramangala',
  'HSR Layout',
  'Indiranagar',
  'Electronic City',
  'Marathahalli',
  'Jayanagar',
  'Hebbal'
];

const EXPERIENCE_SUGGESTIONS = [
  { val: 2, label: '2 Years', labelHi: '2 साल' },
  { val: 5, label: '5 Years', labelHi: '5 साल' },
  { val: 8, label: '8 Years', labelHi: '8 साल' },
  { val: 12, label: '10+ Years', labelHi: '10+ साल' }
];

export default function JoinClient() {
  const [lang, setLang] = useState('hi'); // 'hi' (Hindi/Hinglish) or 'en' (English)
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'नमस्ते! 🙏 मैं कारपेंटरवाला का AI साथी हूँ। यहाँ कारीगरों को सीधे कस्टमर कॉल मिलते हैं वह भी 0% कमीशन पर!\n\nकृपया अपना नाम, काम (कारपेंटर, पेंटर, प्लंबर, इलेक्ट्रीशियन), इलाका और 10 अंकों का मोबाइल नंबर बोलकर या लिखकर बताएं।',
      contentEn:
        'Welcome! 🙏 I am Carpenterwala’s AI Assistant. Connect directly with customers across India with 0% commission.\n\nPlease speak or type your full name, trade (carpenter, painter, plumber, electrician), locality, and 10-digit mobile number.',
      timestamp: ''
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState('');

  // Extracted entities state
  const [currentData, setCurrentData] = useState({
    full_name: '',
    trade: '',
    city: '',
    locality: '',
    pincode: '',
    phone_number: '',
    experience_years: null
  });

  // Onboarding session state from API
  const [onboardingSession, setOnboardingSession] = useState(null);
  const [pollStatus, setPollStatus] = useState('IDLE'); // IDLE | POLLING | VERIFIED | EXPIRED | ERROR
  const [verifiedProfile, setVerifiedProfile] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const pollTimerRef = useRef(null);
  const handleSendMessageRef = useRef(null);
  const messagesRef = useRef(messages);
  const currentDataRef = useRef(currentData);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    currentDataRef.current = currentData;
  }, [currentData]);

  // Send message to AI Onboarding Chat API
  const handleSendMessage = useCallback(async (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend.trim() : inputMessage.trim();
    if (!text || isSending) return;

    setInputMessage('');
    setSpeechError('');
    setIsSending(true);

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messagesRef.current, userMsg];
    setMessages(updatedHistory);

    try {
      const res = await fetch('/api/ai-onboard-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          messages: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
          current_data: currentDataRef.current,
          lang
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process message.');
      }

      if (data.extracted_data) {
        setCurrentData((prev) => ({
          ...prev,
          ...data.extracted_data
        }));
      }

      const assistantMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        onboarding: data.onboarding || null
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If onboarding details are complete, initiate session & auto-polling
      if (data.onboarding && data.onboarding.session_token) {
        setOnboardingSession(data.onboarding);
        setPollStatus('POLLING');
      }
    } catch (err) {
      console.error('[Send Message] Error:', err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          lang === 'hi'
            ? 'माफ़ कीजिये, संदेश भेजने में समस्या हुई। कृपया दोबारा प्रयास करें।'
            : 'Sorry, there was an issue sending your message. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  }, [inputMessage, isSending, lang]);

  // Keep ref updated
  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  }, [handleSendMessage]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript, onboardingSession, pollStatus]);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setInterimTranscript('');
          const spoken = final.trim();
          if (spoken) {
            handleSendMessageRef.current?.(spoken);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('[WebSpeech API] Error:', event.error);
        setIsListening(false);
        setInterimTranscript('');

        if (event.error === 'not-allowed') {
          setSpeechError(
            lang === 'hi'
              ? 'कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति (Permission) दें।'
              : 'Please allow microphone access in your browser.'
          );
        } else if (event.error === 'no-speech') {
          setSpeechError(
            lang === 'hi'
              ? 'आवाज़ सुनाई नहीं दी। कृपया फिर से बोलें।'
              : 'No speech was detected. Please try again.'
          );
        } else {
          setSpeechError(
            lang === 'hi'
              ? 'माइक्रोफ़ोन त्रुटि। आप नीचे टाइप भी कर सकते हैं।'
              : 'Microphone error. You can also type below.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('[WebSpeech API] Init error:', err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [lang]);

  // Toggle Voice Recording
  const toggleSpeechRecognition = () => {
    setSpeechError('');
    const SpeechRecognition = typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

    if (!SpeechRecognition) {
      setSpeechError(
        lang === 'hi'
          ? 'आपके ब्राउज़र में वॉइस रिकग्निशन उपलब्ध नहीं है। कृपया टाइप करें।'
          : 'Voice recognition is not supported in this browser. Please type below.'
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      try {
        if (navigator?.vibrate) {
          navigator.vibrate(50);
        }
        if (recognitionRef.current) {
          recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('[Speech Start] Error:', err);
        try {
          recognitionRef.current?.abort();
          recognitionRef.current?.start();
        } catch (e2) {
          console.error('[Speech Retry] Failed:', e2);
        }
      }
    }
  };

  // Quick Chips Selection helper
  const handleQuickChipClick = (text) => {
    handleSendMessage(text);
  };

  // Background Auto-polling for Onboarding Session Status
  useEffect(() => {
    if (!onboardingSession?.session_token || pollStatus !== 'POLLING') {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/onboarding/status/${onboardingSession.session_token}`);
        if (!res.ok) return;

        const data = await res.json();

        if (data.session?.status === 'VERIFIED') {
          setPollStatus('VERIFIED');
          if (data.profile) {
            setVerifiedProfile(data.profile);
          }
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        } else if (data.session?.status === 'EXPIRED') {
          setPollStatus('EXPIRED');
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        }
      } catch (err) {
        console.warn('[Auto-Poll] Warning:', err);
      }
    };

    // Immediate initial check, then poll every 3 seconds
    checkStatus();
    pollTimerRef.current = setInterval(checkStatus, 3000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [onboardingSession?.session_token, pollStatus]);

  // Manual Status Check Trigger
  const handleManualCheckStatus = async () => {
    if (!onboardingSession?.session_token) return;
    try {
      const res = await fetch(`/api/onboarding/status/${onboardingSession.session_token}`);
      const data = await res.json();
      if (data.session?.status === 'VERIFIED') {
        setPollStatus('VERIFIED');
        if (data.profile) setVerifiedProfile(data.profile);
      } else {
        alert(
          lang === 'hi'
            ? 'दस्तावेज़ अभी अपलोड नहीं हुए हैं। कृपया लिंक पर जाकर आधार कार्ड की फ़ोटो अपलोड करें।'
            : 'Documents are not uploaded yet. Please tap the upload link to submit your Aadhaar card.'
        );
      }
    } catch (_) {}
  };

  // Field status badges calculation
  const hasName = Boolean(currentData.full_name && currentData.full_name.trim().length >= 2);
  const hasTrade = Boolean(currentData.trade);
  const hasLocality = Boolean(currentData.locality);
  const hasPhone = Boolean(currentData.phone_number && /^[6-9]\d{9}$/.test(currentData.phone_number));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF8F5',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-inter), sans-serif'
      }}
    >
      {/* Top Header */}
      <header
        style={{
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '0.85rem 1rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(194, 65, 12, 0.35)'
            }}
          >
            🪚
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Carpenterwala <span style={{ color: '#F97316' }}>AI Sahayak</span>
              </h1>
              <span
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid #22C55E',
                  color: '#4ADE80',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    display: 'inline-block'
                  }}
                />
                VOICE AI LIVE
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94A3B8' }}>
              0% Commission Direct Pro Onboarding • 2-Minute Voice Setup
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => setLang('hi')}
            style={{
              background: lang === 'hi' ? '#C2410C' : 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: lang === 'hi' ? '1.5px solid #F97316' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            🇮🇳 हिन्दी
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            style={{
              background: lang === 'en' ? '#C2410C' : 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: lang === 'en' ? '1.5px solid #F97316' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            English
          </button>
        </div>
      </header>

      {/* Trust & Live Entity Tracker Bar */}
      <div
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          gap: '0.5rem',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem' }}>
          <span style={{ fontWeight: 600, color: '#475569' }}>
            {lang === 'hi' ? 'जानकारी स्थिति:' : 'Captured Info:'}
          </span>
          <span
            style={{
              background: hasName ? '#DCFCE7' : '#F1F5F9',
              color: hasName ? '#166534' : '#64748B',
              padding: '3px 8px',
              borderRadius: '12px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            {hasName ? '✓ ' + currentData.full_name : '⏳ ' + (lang === 'hi' ? 'नाम' : 'Name')}
          </span>
          <span
            style={{
              background: hasTrade ? '#DCFCE7' : '#F1F5F9',
              color: hasTrade ? '#166534' : '#64748B',
              padding: '3px 8px',
              borderRadius: '12px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            {hasTrade
              ? '✓ ' + (currentData.trade.charAt(0).toUpperCase() + currentData.trade.slice(1))
              : '⏳ ' + (lang === 'hi' ? 'काम' : 'Trade')}
          </span>
          <span
            style={{
              background: hasLocality ? '#DCFCE7' : '#F1F5F9',
              color: hasLocality ? '#166534' : '#64748B',
              padding: '3px 8px',
              borderRadius: '12px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            {hasLocality
              ? '✓ ' + (currentData.locality || currentData.city)
              : '⏳ ' + (lang === 'hi' ? 'इलाका' : 'Location')}
          </span>
          <span
            style={{
              background: hasPhone ? '#DCFCE7' : '#F1F5F9',
              color: hasPhone ? '#166534' : '#64748B',
              padding: '3px 8px',
              borderRadius: '12px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            {hasPhone ? '✓ +91 ' + currentData.phone_number : '⏳ ' + (lang === 'hi' ? 'मोबाइल' : 'Mobile')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: '#C2410C', fontWeight: 700 }}>
          <span>✨ 0% Commission</span>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <main
        style={{
          flex: 1,
          maxWidth: '780px',
          width: '100%',
          margin: '0 auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingBottom: '140px'
        }}
      >
        {/* Messages List */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const content = lang === 'en' && msg.contentEn ? msg.contentEn : msg.content;

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  maxWidth: '88%',
                  flexDirection: isUser ? 'row-reverse' : 'row'
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isUser ? '#0F172A' : '#C2410C',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {isUser ? '👤' : '🤖'}
                </div>

                {/* Message Bubble */}
                <div
                  style={{
                    background: isUser ? '#0F172A' : '#FFFFFF',
                    color: isUser ? '#FFFFFF' : '#0F172A',
                    padding: '0.85rem 1.15rem',
                    borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
                    fontSize: '0.92rem',
                    lineHeight: 1.55,
                    border: isUser ? 'none' : '1px solid rgba(15, 23, 42, 0.08)',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {content}

                  {/* Inline Onboarding Handoff Card (Clickable Upload Link + QR Code) */}
                  {msg.onboarding && (
                    <div
                      style={{
                        marginTop: '1rem',
                        background: '#F0FDF4',
                        border: '2px solid #16A34A',
                        borderRadius: '16px',
                        padding: '1rem',
                        boxShadow: '0 6px 20px rgba(22, 163, 74, 0.12)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>🎉</span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#166534' }}>
                            {lang === 'hi'
                              ? 'आपकी 0% कमीशन प्रोफ़ाइल लिंक तैयार है!'
                              : 'Your 0% Commission Profile Link is Ready!'}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 600 }}>
                            {lang === 'hi' ? 'टोकन वैध: 60 मिनट' : 'Valid for 60 minutes'}
                          </span>
                        </div>
                      </div>

                      {/* Summary Grid */}
                      <div
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '10px',
                          padding: '0.65rem 0.85rem',
                          margin: '0.5rem 0 0.85rem',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                          gap: '0.4rem',
                          fontSize: '0.78rem',
                          border: '1px solid #DCFCE7'
                        }}
                      >
                        <div>
                          <strong style={{ color: '#64748B' }}>{lang === 'hi' ? 'नाम' : 'Name'}:</strong>{' '}
                          <span style={{ color: '#0F172A', fontWeight: 700 }}>
                            {msg.onboarding.session?.full_name || currentData.full_name}
                          </span>
                        </div>
                        <div>
                          <strong style={{ color: '#64748B' }}>{lang === 'hi' ? 'काम' : 'Trade'}:</strong>{' '}
                          <span style={{ color: '#0F172A', fontWeight: 700 }}>
                            {msg.onboarding.session?.trade || currentData.trade}
                          </span>
                        </div>
                        <div>
                          <strong style={{ color: '#64748B' }}>{lang === 'hi' ? 'मोबाइल' : 'Mobile'}:</strong>{' '}
                          <span style={{ color: '#0F172A', fontWeight: 700 }}>
                            +91 {msg.onboarding.session?.phone_number || currentData.phone_number}
                          </span>
                        </div>
                        <div>
                          <strong style={{ color: '#64748B' }}>{lang === 'hi' ? 'इलाका' : 'Location'}:</strong>{' '}
                          <span style={{ color: '#0F172A', fontWeight: 700 }}>
                            {[
                              msg.onboarding.session?.locality || currentData.locality,
                              msg.onboarding.session?.city || currentData.city
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Prominent 1-Tap Mobile Upload Button */}
                      <div style={{ marginBottom: '1rem' }}>
                        <Link
                          href={msg.onboarding.verify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                            color: '#FFFFFF',
                            padding: '0.9rem 1.25rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                            textAlign: 'center'
                          }}
                        >
                          <span>👉</span>
                          <span>
                            {lang === 'hi'
                              ? 'यहाँ टैप करके आधार कार्ड अपलोड करें'
                              : 'Tap Here to Upload Aadhaar Card (1-Tap)'}
                          </span>
                        </Link>
                        <p
                          style={{
                            margin: '0.35rem 0 0',
                            fontSize: '0.72rem',
                            color: '#166534',
                            textAlign: 'center'
                          }}
                        >
                          {lang === 'hi'
                            ? 'बिना किसी पासवर्ड या लॉगिन के सीधे खुलेगा • कैमरा से फ़ोटो लें'
                            : 'Opens instantly without login • Take photo directly from camera'}
                        </p>
                      </div>

                      {/* Desktop QR Code */}
                      <div
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          border: '1px solid #BBF7D0',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534' }}>
                          📱 {lang === 'hi' ? 'कंप्यूटर पर हैं? फ़ोन कैमरा से QR स्कैन करें:' : 'On Computer? Scan QR code with Phone Camera:'}
                        </div>
                        {msg.onboarding.qr_code_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={msg.onboarding.qr_code_url}
                            alt="Scan QR Code to Upload Documents"
                            style={{
                              width: '160px',
                              height: '160px',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                            }}
                          />
                        ) : null}
                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {msg.onboarding.verify_url}
                        </span>
                      </div>

                      {/* Live Auto-Polling Status Bar */}
                      <div
                        style={{
                          marginTop: '0.85rem',
                          padding: '0.75rem',
                          borderRadius: '10px',
                          background: pollStatus === 'VERIFIED' ? '#DCFCE7' : '#FEF3C7',
                          border:
                            pollStatus === 'VERIFIED'
                              ? '1.5px solid #22C55E'
                              : '1px solid #F59E0B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: pollStatus === 'VERIFIED' ? '#16A34A' : '#D97706',
                              display: 'inline-block',
                              animation:
                                pollStatus === 'POLLING' ? 'pulse 1.5s infinite' : 'none'
                            }}
                          />
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: pollStatus === 'VERIFIED' ? '#166534' : '#92400E'
                            }}
                          >
                            {pollStatus === 'VERIFIED'
                              ? (lang === 'hi' ? '✅ प्रोफ़ाइल सत्यापित हो गई!' : '✅ Profile 100% Verified!')
                              : pollStatus === 'EXPIRED'
                              ? (lang === 'hi' ? '⚠️ लिंक की अवधि समाप्त' : '⚠️ Link Expired')
                              : (lang === 'hi' ? '🔄 दस्तावेज़ अपलोड की प्रतीक्षा... (Auto-Checking)' : '🔄 Waiting for Document Upload... (Auto-Checking)')}
                          </span>
                        </div>

                        {pollStatus !== 'VERIFIED' && (
                          <button
                            type="button"
                            onClick={handleManualCheckStatus}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid #D97706',
                              color: '#B45309',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '4px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            {lang === 'hi' ? 'अभी चेक करें' : 'Check Now'}
                          </button>
                        )}
                      </div>

                      {/* Celebratory Banner if Verified */}
                      {pollStatus === 'VERIFIED' && (
                        <div
                          style={{
                            marginTop: '0.85rem',
                            padding: '1rem',
                            background: '#166534',
                            color: '#FFFFFF',
                            borderRadius: '12px',
                            textAlign: 'center'
                          }}
                        >
                          <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800 }}>
                            🎉 {lang === 'hi' ? 'मुबारक हो! आपकी प्रोफ़ाइल लाइव है!' : 'Congratulations! Your Profile is Live!'}
                          </h3>
                          <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#BBF7D0' }}>
                            {lang === 'hi'
                              ? 'अब ग्राहक आपको सीधे 0% कमीशन पर कॉल कर सकते हैं।'
                              : 'Customers in your area can now call you directly with 0% commission.'}
                          </p>
                          {verifiedProfile?.profile_url && (
                            <Link
                              href={verifiedProfile.profile_url}
                              target="_blank"
                              style={{
                                display: 'inline-block',
                                background: '#FFFFFF',
                                color: '#166534',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                textDecoration: 'none'
                              }}
                            >
                              👀 {lang === 'hi' ? 'अपनी प्रोफ़ाइल देखें' : 'View Your Public Profile'}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <span
                style={{
                  fontSize: '0.65rem',
                  color: '#94A3B8',
                  marginTop: '3px',
                  marginRight: isUser ? '40px' : '0',
                  marginLeft: isUser ? '0' : '40px'
                }}
              >
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Contextual Quick Suggestion Chips */}
        {!onboardingSession && (!hasTrade || !hasLocality || !currentData.experience_years) && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '0.85rem',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
              💡 {lang === 'hi' ? 'त्वरित विकल्प (टैप करें या नीचे माइक से बोलें):' : 'Quick Options (Tap or speak via mic):'}
            </div>

            {/* Trade Chips */}
            {!hasTrade && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {TRADE_OPTIONS.map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() =>
                      handleQuickChipClick(
                        lang === 'hi'
                          ? `मैं ${tr.labelHi} का काम करता हूँ`
                          : `I work as a ${tr.label}`
                      )
                    }
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#0F172A',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{tr.icon}</span>
                    <span>{lang === 'hi' ? tr.labelHi : tr.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Locality Chips */}
            {!hasLocality && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {LOCALITY_SUGGESTIONS.slice(0, 5).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() =>
                      handleQuickChipClick(
                        lang === 'hi' ? `मैं ${loc} इलाके में काम करता हूँ` : `I work in ${loc}`
                      )
                    }
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      borderRadius: '20px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    📍 {loc}
                  </button>
                ))}
              </div>
            )}

            {/* Experience Chips */}
            {!currentData.experience_years && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {EXPERIENCE_SUGGESTIONS.map((exp) => (
                  <button
                    key={exp.val}
                    type="button"
                    onClick={() =>
                      handleQuickChipClick(
                        lang === 'hi'
                          ? `मुझे ${exp.labelHi} का अनुभव है`
                          : `I have ${exp.label} experience`
                      )
                    }
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      borderRadius: '20px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    ⏱️ {lang === 'hi' ? exp.labelHi : exp.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Interim Speech Preview Bubble */}
        {interimTranscript && (
          <div
            style={{
              alignSelf: 'flex-end',
              background: 'rgba(234, 88, 12, 0.1)',
              border: '1.5px dashed #EA580C',
              color: '#9A3412',
              padding: '0.65rem 1rem',
              borderRadius: '16px',
              fontSize: '0.85rem',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🎙️</span>
            <span>{interimTranscript} ...</span>
          </div>
        )}

        {/* AI Typing / Sending Indicator */}
        {isSending && (
          <div
            style={{
              alignSelf: 'flex-start',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '0.6rem 1rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#64748B'
            }}
          >
            <span>🤖</span>
            <span>{lang === 'hi' ? 'AI सहायक सोच रहा है...' : 'AI Assistant is thinking...'}</span>
          </div>
        )}

        {/* Error notification if any */}
        {speechError && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              padding: '0.6rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              textAlign: 'center'
            }}
          >
            {speechError}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Floating Bottom Voice & Input Bar */}
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderTop: '1px solid rgba(15, 23, 42, 0.1)',
          padding: '0.75rem 1rem',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
          zIndex: 50
        }}
      >
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          {/* Main Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* LARGE VOICE MICROPHONE BUTTON */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: isListening
                  ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
                  : 'linear-gradient(135deg, #C2410C 0%, #EA580C 100%)',
                color: '#FFFFFF',
                border: isListening ? '3px solid #F87171' : 'none',
                boxShadow: isListening
                  ? '0 0 25px rgba(220, 38, 38, 0.6)'
                  : '0 6px 18px rgba(194, 65, 12, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>
                {isListening ? '⏹️' : '🎙️'}
              </span>
              <span
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 800,
                  marginTop: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {isListening ? (lang === 'hi' ? 'रोकें' : 'Stop') : (lang === 'hi' ? 'बोलें' : 'Speak')}
              </span>

              {/* Pulsing visual wave ring when listening */}
              {isListening && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    right: '-6px',
                    bottom: '-6px',
                    borderRadius: '50%',
                    border: '2px solid #EF4444',
                    animation: 'pulse 1.2s infinite'
                  }}
                />
              )}
            </button>

            {/* Text Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: '#F1F5F9',
                borderRadius: '24px',
                padding: '4px 6px 4px 14px',
                border: '1.5px solid #E2E8F0'
              }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isListening
                    ? lang === 'hi'
                      ? 'सुन रहे हैं... बोलिए...'
                      : 'Listening... please speak...'
                    : lang === 'hi'
                    ? 'यहाँ बोलें या लिखें (जैसे: रमेश, कारपेंटर...)'
                    : 'Speak or type details (e.g. Ramesh, Carpenter...)'
                }
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: '#0F172A',
                  padding: '6px 0'
                }}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: inputMessage.trim() ? '#0F172A' : '#CBD5E1',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  cursor: inputMessage.trim() ? 'pointer' : 'default',
                  transition: 'background 0.2s ease',
                  flexShrink: 0
                }}
              >
                ➤
              </button>
            </form>
          </div>

          {/* Sub-bar helper info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.68rem',
              color: '#64748B',
              padding: '0 4px'
            }}
          >
            <span>
              {isListening
                ? (lang === 'hi' ? '🔴 माइक्रोफ़ोन चालू है • स्पष्ट बोलें' : '🔴 Mic active • Speak clearly')
                : (lang === 'hi' ? '👆 बड़े माइक बटन को दबाकर बोलें' : '👆 Tap the large mic button to speak')}
            </span>
            <span>
              {lang === 'hi' ? 'सपोर्ट: en-IN | hi-IN' : 'Supports: en-IN | hi-IN'}
            </span>
          </div>
        </div>
      </footer>

      {/* Embedded CSS for pulsing animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0.98);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.98);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
