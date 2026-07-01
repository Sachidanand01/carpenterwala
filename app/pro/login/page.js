import ProLogin from './ProLoginClient';
 
export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const lang = resolvedParams.lang;
 
  let title = 'Pro Portal - Register as a Service Pro | Carpenterwala';
  let description = 'Join Carpenterwala as a Carpenter, Plumber, Painter, or Electrician. Get direct leads with zero commission and zero platform charges.';
  let ogImage = '/images/pro-campaign-kn-fb.jpg';
  let altText = 'Carpenterwala Pro Registration';
 
  if (lang === 'hi') {
    title = 'Pro Portal - रजिस्टर करें और ग्राहक पाएं | Carpenterwala';
    description = 'बिना किसी कमीशन के सीधे ग्राहकों से जुड़ने के लिए आज ही रजिस्टर करें। रजिस्ट्रेशन बिल्कुल FREE है!';
    ogImage = '/images/pro-campaign-hi-fb.jpg';
    altText = 'Carpenterwala Pro Registration Hindi';
  } else if (lang === 'kn') {
    title = 'Pro Portal - ನೋಂದಾಯಿಸಿ ಗ್ರಾಹಕರನ್ನು ಪಡೆಯಿರಿ | Carpenterwala';
    description = 'ಯಾವುದೇ ಕಮಿಷನ್ ಇಲ್ಲದೆ ನೇರವಾಗಿ ಗ್ರಾಹಕರನ್ನು ಸಂಪರ್ಕಿಸಲು ಇಂದೇ ಜಾಯಿನ್ ಆಗಿ. ರಿಜಿಸ್ಟ್ರೇಷನ್ ಸಂಪೂರ್ಣ FREE!';
    ogImage = '/images/pro-campaign-kn-fb.jpg';
    altText = 'Carpenterwala Pro Registration Kannada';
  } else if (lang === 'ta') {
    title = 'Pro Portal - பதிவு செய்து வாடிக்கையாளர்களைப் பெறுங்கள் | Carpenterwala';
    description = 'எந்தவொரு கமிஷனும் இல்லாமல் வாடிக்கையாளர்களுடன் நேரடியாக இணையுங்கள். பதிவு முற்றிலும் இலவசம்!';
    ogImage = '/images/pro-campaign-kn-fb.jpg';
    altText = 'Carpenterwala Pro Registration Tamil';
  } else if (lang === 'te') {
    title = 'Pro Portal - నమోదు చేసుకోండి కస్టమర్లను పొందండి | Carpenterwala';
    description = 'ఎటువంటి కమిషన్ లేకుండా నేరుగా కస్టమర్లతో కనెక్ట్ అవ్వండి. రిజిస్ట్రేషన్ పూర్తిగా ఉచితం!';
    ogImage = '/images/pro-campaign-kn-fb.jpg';
    altText = 'Carpenterwala Pro Registration Telugu';
  }
 
  const locales = {
    hi: 'hi_IN',
    kn: 'kn_IN',
    ta: 'ta_IN',
    te: 'te_IN',
    en: 'en_IN'
  };
 
  return {
    metadataBase: new URL('https://carpenterwala.com'),
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://carpenterwala.com/pro/login',
      siteName: 'Carpenterwala',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: altText,
        },
      ],
      locale: locales[lang] || 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: ['hi', 'kn', 'ta', 'te'].includes(lang) ? `https://carpenterwala.com/pro/login?lang=${lang}` : 'https://carpenterwala.com/pro/login',
    },
  };
}
 
export default async function Page({ searchParams }) {
  const resolvedParams = await searchParams;
  const lang = resolvedParams.lang;
  return <ProLogin lang={lang} />;
}
