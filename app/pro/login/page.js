import ProLogin from './ProLoginClient';

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const lang = resolvedParams.lang;

  let title = 'Pro Portal - Register as a Service Professional | Carpenterwala';
  let description = 'Join Carpenterwala as a Carpenter, Plumber, Painter, or Electrician. Get direct leads with zero commission and zero platform charges.';
  let ogImage = '/images/pro-campaign-kn-fb.jpg';
  let altText = 'Carpenterwala Pro Registration';

  if (lang === 'hi') {
    title = 'CarpenterWala Pro Portal - रजिस्टर करें और नए ग्राहक पाएं';
    description = 'बिना किसी कमीशन के सीधे ग्राहकों से जुड़ने के लिए आज ही रजिस्टर करें। रजिस्ट्रेशन बिल्कुल FREE है!';
    ogImage = '/images/pro-campaign-hi-fb.jpg';
    altText = 'Carpenterwala Pro Registration Hindi';
  } else if (lang === 'kn') {
    title = 'CarpenterWala Pro Portal - ನೋಂದಾಯಿಸಿ ಮತ್ತು ಗ್ರಾಹಕರನ್ನು ಪಡೆಯಿರಿ';
    description = 'ಯಾವುದೇ ಕಮಿಷನ್ ಇಲ್ಲದೆ ನೇರವಾಗಿ ಗ್ರಾಹಕರನ್ನು ಸಂಪರ್ಕಿಸಲು ಇಂದೇ ಜಾಯಿನ್ ಆಗಿ. ರಿಜಿಸ್ಟ್ರೇಷನ್ ಸಂಪೂರ್ಣ FREE!';
    ogImage = '/images/pro-campaign-kn-fb.jpg';
    altText = 'Carpenterwala Pro Registration Kannada';
  } else {
    // If not specified, default to English/Kannada general meta
    title = 'Pro Portal - Register as a Service Professional | Carpenterwala';
    description = 'Join Carpenterwala as a Carpenter, Plumber, Painter, or Electrician. Get direct leads with zero commission and zero platform charges.';
    ogImage = '/images/pro-campaign-kn-fb.jpg';
    altText = 'Carpenterwala Pro Registration';
  }

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
      locale: lang === 'hi' ? 'hi_IN' : (lang === 'kn' ? 'kn_IN' : 'en_IN'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: (lang === 'hi' || lang === 'kn') ? `https://carpenterwala.com/pro/login?lang=${lang}` : 'https://carpenterwala.com/pro/login',
    },
  };
}

export default async function Page({ searchParams }) {
  const resolvedParams = await searchParams;
  const lang = resolvedParams.lang || 'kn';
  return <ProLogin lang={lang} />;
}
