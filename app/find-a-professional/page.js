import DirectoryClient from "@/components/DirectoryClient";

export async function generateMetadata({ searchParams }) {
  // In Next.js 15+, searchParams is a Promise that must be awaited
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category;
  const location = resolvedParams?.location;

  const baseUrl = 'https://carpenterwala.com/find-a-professional';
  const params = [];
  if (category) params.push(`category=${category}`);
  if (location) params.push(`location=${location}`);
  const canonical = params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;

  let title = "Find a Professional | Carpenterwala";
  let description = "Browse verified local handymen, carpenters, painters, plumbers, and electricians in Bangalore.";

  if (category) {
    const pluralCategory = category.endsWith('s') || category.toLowerCase() === 'clergy' ? category : `${category}s`;
    title = `Verified Local ${pluralCategory} | Carpenterwala`;
    description = `Find and book top-rated verified local ${pluralCategory.toLowerCase()} in Bangalore for your home repairs.`;
  }

  return {
    title,
    description,
    alternates: {
      canonical,
    },
  };
}

export default function FindAProfessionalPage() {
  return <DirectoryClient />;
}
