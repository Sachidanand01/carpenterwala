import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'बैंगलोर में कारीगर बनें: 0% कमीशन पर कारपेंटर, पेंटर, प्लंबर, इलेक्ट्रीशियन काम पाएं | Carpenterwala',
  description: 'बैंगलोर में कारपेंटर, पेंटर, प्लंबर और इलेक्ट्रीशियन के लिए सबसे भरोसेमंद डिजिटल प्लेटफॉर्म। 0% कमीशन, ग्राहक से सीधा भुगतान और 100% कमाई अपनी जेब में। आज ही फ्री रजिस्टर करें।',
  alternates: {
    canonical: 'https://carpenterwala.com/pro/hindi',
    languages: {
      'hi': 'https://carpenterwala.com/pro/hindi',
      'en': 'https://carpenterwala.com/pro/login',
      'x-default': 'https://carpenterwala.com/pro/login',
    },
  },
  openGraph: {
    title: 'बैंगलोर में 0% कमीशन पर सीधे ग्राहक से काम पाएं | Carpenterwala Pro',
    description: 'कारपेंटर, पेंटर, प्लंबर, इलेक्ट्रीशियन भाईयों के लिए: कोई ऐप कमीशन नहीं, पूरा पैसा आपका।',
    url: 'https://carpenterwala.com/pro/hindi',
    siteName: 'Carpenterwala',
    images: [
      {
        url: '/images/pro-campaign-hi.jpg',
        width: 1200,
        height: 630,
        alt: 'Carpenterwala Hindi Pro Registration',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
};

export default function HindiProPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'क्या Carpenterwala पर रजिस्टर करने का कोई शुल्क या कमीशन है?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'नहीं, Carpenterwala पर रजिस्ट्रेशन 100% फ्री है और हम किसी भी काम पर 0% कमीशन लेते हैं। ग्राहक जो भी पैसा देता है, वह पूरा आपकी जेब में जाता है।',
        },
      },
      {
        '@type': 'Question',
        'name': 'ग्राहक से भुगतान (Payment) कैसे मिलता है?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'काम पूरा होते ही ग्राहक आपको सीधे कैश या आपके व्यक्तिगत PhonePe, Google Pay या Paytm UPI पर तुरंत भुगतान करता है। कंपनी पैसे नहीं रोकती।',
        },
      },
      {
        '@type': 'Question',
        'name': 'रजिस्ट्रेशन के लिए किन दस्तावेजों की जरूरत होती है?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'आपको केवल अपना मोबाइल नंबर (ओटीपी वेरिफिकेशन के लिए), आधार कार्ड और अपने काम का अनुभव बताना होता है।',
        },
      },
      {
        '@type': 'Question',
        'name': 'बैंगलोर के किन इलाकों में काम मिलता है?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'कोरमंगला, इंदिरानगर, व्हाइटफील्ड, एचएसआर लेआउट, थानिसांद्रा, जयनगर, जेपी नगर, बेलंदूर, मराठाहल्ली, हेब्बाल, सरजापुर रोड, इलेक्ट्रॉनिक सिटी और येलहंका सहित पूरे बैंगलोर में काम उपलब्ध है।',
        },
      },
    ],
  };

  return (
    <div style={{ background: '#0B1120', color: '#F8FAFC', minHeight: '100vh', paddingBottom: '5rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Banner Section */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, #0B1120 100%)',
        padding: '3.5rem 1.5rem 2.5rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(234, 88, 12, 0.15)',
            border: '1px solid rgba(234, 88, 12, 0.4)',
            color: '#FB923C',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            <span>🔥 0% कमीशन — 100% सीधी कमाई</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: '800',
            lineHeight: '1.25',
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
            color: '#FFFFFF'
          }}>
            बैंगलोर में कारीगर भाईयों के लिए:<br />
            <span style={{
              background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EAB308 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              बिना किसी कमीशन के सीधे ग्राहक से काम पाएं!
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
            color: '#94A3B8',
            maxWidth: '700px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            अन्य ऐप की तरह 25% से 30% कमीशन गंवाने की जरूरत नहीं। Carpenterwala पर अपनी फ्री प्रोफाइल बनाएं, सीधे ग्राहक से फोन पर बात करें और काम खत्म होते ही तुरंत पूरा भुगतान पाएं।
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/pro/login?lang=hi"
              style={{
                background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
                color: '#FFFFFF',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1.15rem',
                textDecoration: 'none',
                boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.5)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>🚀 अभी फ्री रजिस्टर करें</span>
              <span>→</span>
            </Link>

            <Link
              href="/pro/login?lang=hi"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#F8FAFC',
                padding: '1rem 1.75rem',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1.05rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              पहले से रजिस्टर्ड हैं? साइन इन करें
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Comparison Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              अन्य कंपनियों और Carpenterwala में क्या अंतर है?
            </h2>
            <p style={{ color: '#94A3B8' }}>देखें कि आप हर महीने ₹15,000 से ₹25,000 ज्यादा कैसे बचा सकते हैं:</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Other Apps */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '16px',
              padding: '1.75rem'
            }}>
              <div style={{ color: '#EF4444', fontWeight: '700', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>❌ अन्य एग्रीगेटर ऐप्स</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#CBD5E1', fontSize: '0.95rem' }}>
                <li>❌ <strong>20% से 30% कमीशन कटौती:</strong> ₹10,000 के काम पर ₹3,000 कंपनी रख लेती है।</li>
                <li>❌ <strong>देरी से पेमेंट:</strong> पैसे कंपनी के वॉलेट में हफ्ते भर फंसे रहते हैं।</li>
                <li>❌ <strong>कड़े नियम और पेनल्टी:</strong> जरा सी देर होने पर आईडी ब्लॉक या जुर्माना।</li>
                <li>❌ <strong>ग्राहक से बात करने पर रोक:</strong> अपनी मर्जी से रेट तय नहीं कर सकते।</li>
              </ul>
            </div>

            {/* Carpenterwala */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '2px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '16px',
              padding: '1.75rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '20px',
                background: '#22C55E',
                color: '#0B1120',
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px'
              }}>
                कारीगरों की पहली पसंद
              </div>
              <div style={{ color: '#22C55E', fontWeight: '700', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✅ Carpenterwala प्लेटफॉर्म</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#F1F5F9', fontSize: '0.95rem' }}>
                <li>✅ <strong>0% कमीशन:</strong> ₹10,000 का काम यानी पूरा ₹10,000 आपकी जेब में।</li>
                <li>✅ <strong>तुरंत भुगतान:</strong> काम खत्म होते ही ग्राहक से सीधे कैश या UPI लें।</li>
                <li>✅ <strong>सीधा ग्राहक संपर्क:</strong> ग्राहक का फोन सीधे आपके पास आता है।</li>
                <li>✅ <strong>पूर्ण स्वतंत्रता:</strong> अपनी सुविधा और इलाके के अनुसार काम चुनें।</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4 Trades Supported */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              हम इन 4 क्षेत्रों के कुशल कारीगरों का स्वागत करते हैं:
            </h2>
            <p style={{ color: '#94A3B8' }}>अगर आपके पास नीचे दिए गए किसी भी काम का अनुभव है, तो आप तुरंत जुड़ सकते हैं:</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🪚</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>कारपेंटर (बढ़ई)</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>डोर लॉक फिटिंग, मॉड्यूलर किचन, वार्डरोब असेंबली, बेड और टेबल रिपेयर।</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎨</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>पेंटर (पुट्टी व पेंट)</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>आंतरिक व बाहरी दीवार पुट्टी, रोलर पेंटिंग, वॉटरप्रूफिंग, टेक्सचर वॉल।</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔧</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>प्लंबर (नल व पाइप)</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>पाइप लीकेज, नल व शावर रिप्लेसमेंट, वॉटर हीटर फिटिंग, वॉटर टैंक सफाई।</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>इलेक्ट्रीशियन (बिजली)</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>स्विचबोर्ड वायरिंग, एमसीबी ट्रिप ठीक करना, पंखा फिटिंग, इनवर्टर कनेक्शन।</p>
            </div>
          </div>
        </section>

        {/* 4 Simple Steps to Join */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
          padding: '2.5rem 1.75rem',
          marginBottom: '4rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              जुड़ने की आसान 4-स्टेप प्रक्रिया
            </h2>
            <p style={{ color: '#94A3B8' }}>2 मिनट में अपना अकाउंट बनाएं और सीधे कॉल पाना शुरू करें:</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', background: '#EA580C', color: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', marginBottom: '1rem' }}>1</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.4rem' }}>विवरण भरें</h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>अपना नाम, मोबाइल नंबर और अपनी ट्रेड (हुनर) दर्ज करें।</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', background: '#EA580C', color: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', marginBottom: '1rem' }}>2</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.4rem' }}>ओटीपी वेरिफिकेशन</h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>आपके फोन पर आया 6-अंकों का ओटीपी दर्ज करके नंबर सत्यापित करें।</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', background: '#EA580C', color: '#FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', marginBottom: '1rem' }}>3</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.4rem' }}>आधार सत्यापन</h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>ग्राहक के विश्वास के लिए आधार और बुनियादी पुलिस वेरिफिकेशन पूरा करें।</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', background: '#22C55E', color: '#0B1120', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', marginBottom: '1rem' }}>4</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.4rem' }}>सीधे काम पाएं</h3>
              <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>बैंगलोर के नजदीकी सोसायटियों से सीधे फोन कॉल प्राप्त करें और कमाएं।</p>
            </div>
          </div>
        </section>

        {/* Localities in Bangalore */}
        <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '1rem' }}>
            पूरे बैंगलोर में काम उपलब्ध है:
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
            आप जिस इलाके में रहते हैं, उसी इलाके के 5 से 8 किलोमीटर के दायरे में काम चुन सकते हैं:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {[
              'कोरमंगला (Koramangala)',
              'इंदिरानगर (Indiranagar)',
              'व्हाइटफील्ड (Whitefield)',
              'एचएसआर लेआउट (HSR Layout)',
              'थानिसांद्रा (Thanisandra)',
              'जयनगर (Jayanagar)',
              'जेपी नगर (JP Nagar)',
              'बेलंदूर (Bellandur)',
              'मराठाहल्ली (Marathahalli)',
              'हेब्बाल (Hebbal)',
              'सरजापुर रोड (Sarjapur Road)',
              'इलेक्ट्रॉनिक सिटी (Electronic City)',
              'येलहंका (Yelahanka)'
            ].map((loc, idx) => (
              <span key={idx} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                color: '#E2E8F0'
              }}>
                📍 {loc}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              अक्सर पूछे जाने वाले सवाल (FAQs)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.4rem' }}>
                प्र. क्या मुझे जॉइन करने के लिए पैसे देने होंगे?
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#94A3B8', margin: 0, lineHeight: '1.6' }}>
                उ. बिल्कुल नहीं। Carpenterwala पर कारीगरों के लिए रजिस्ट्रेशन 100% फ्री है। हम किसी भी तरह की जॉइनिंग फीस या सब्सक्रिप्शन चार्ज नहीं लेते।
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.4rem' }}>
                प्र. ग्राहक से पैसे कैसे मिलेंगे?
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#94A3B8', margin: 0, lineHeight: '1.6' }}>
                उ. ग्राहक आपको सीधे कैश देता है या आपके व्यक्तिगत क्यूआर कोड (PhonePe, Google Pay, Paytm) पर पेमेंट करता है। सारा पैसा तुरंत आपके पास आता है।
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.4rem' }}>
                प्र. अगर कोई सहायता चाहिए हो तो किससे संपर्क करें?
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#94A3B8', margin: 0, lineHeight: '1.6' }}>
                उ. आप हमारे हेल्पलाइन नंबर <strong>+91-809-555-1001</strong> पर कॉल कर सकते हैं या थानिसांद्रा मेन रोड स्थित हमारे ऑफिस में संपर्क कर सकते हैं।
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.4)',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '1rem' }}>
            आज ही Carpenterwala परिवार से जुड़ें!
          </h2>
          <p style={{ color: '#CBD5E1', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            अपने हुनर की पूरी कद्र पाएं। अपनी मेहनत की 100% कमाई सीधे अपनी जेब में रखें।
          </p>
          <Link
            href="/pro/login?lang=hi"
            style={{
              background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
              color: '#FFFFFF',
              padding: '1.1rem 2.5rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1.2rem',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.5)',
            }}
          >
            फ्री रजिस्ट्रेशन शुरू करें →
          </Link>
        </div>
      </div>
    </div>
  );
}
