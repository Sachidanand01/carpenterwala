import JoinClient from './JoinClient';

export const metadata = {
  title: 'Join as a Verified Pro (0% Commission) | Carpenterwala AI Onboarding',
  description:
    'Join Carpenterwala as a verified carpenter, painter, plumber, or electrician. Zero commission, direct customer phone calls, 2-minute voice AI registration.',
  alternates: {
    canonical: 'https://carpenterwala.com/join'
  },
  openGraph: {
    title: 'Join Carpenterwala as a Verified Service Professional',
    description:
      '0% commission platform for home service professionals across India. Register your trade in 2 minutes via voice or chat.',
    url: 'https://carpenterwala.com/join',
    siteName: 'Carpenterwala',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function JoinPage() {
  return <JoinClient />;
}
