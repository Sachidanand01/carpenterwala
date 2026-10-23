export default function robots() {
  const baseUrl = 'https://carpenterwala.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/api/mcp',
        ],
        disallow: [
          '/pro/dashboard',
          '/admin',
          '/bookings',
          '/api/',
        ],
      },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'CCBot',
          'Bytespider',
        ],
        allow: [
          '/',
          '/api/mcp',
        ],
        disallow: [
          '/pro/dashboard',
          '/admin',
          '/bookings',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
