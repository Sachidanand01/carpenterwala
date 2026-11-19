import { getProfileByProCode } from '@/lib/supabase';
import { getProUrl } from '@/lib/pro-slug';
import { redirect, notFound } from 'next/navigation';

// Segment uses [trade] so Next.js App Router matches the sibling [trade]/[proCode]/[name] dynamic folder name;
// for single-segment /pro/<proCode> short links, `params.trade` holds the proCode.
export async function generateMetadata({ params }) {
  const { trade: proCode } = await params;
  const reserved = ['dashboard', 'hindi', 'login'];
  if (reserved.includes(proCode?.toLowerCase())) return {};

  const profile = await getProfileByProCode(proCode);
  if (!profile) return { title: 'Professional Not Found | Carpenterwala' };

  return {
    title: `${profile.name} - Verified ${profile.trade} | Carpenterwala`,
    alternates: {
      canonical: `https://carpenterwala.com${getProUrl(profile)}`,
    },
  };
}

export default async function ProShortLinkPage({ params }) {
  const { trade: proCode } = await params;

  const reserved = ['dashboard', 'hindi', 'login'];
  if (reserved.includes(proCode?.toLowerCase())) {
    notFound();
  }

  const profile = await getProfileByProCode(proCode);
  if (!profile) {
    notFound();
  }

  // 301 Permanent Redirect to canonical hierarchical SEO URL
  redirect(getProUrl(profile));
}
