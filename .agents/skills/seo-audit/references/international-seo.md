# International SEO: Evidence & Sources

Detailed evidence backing the International SEO & Localization section of the SEO Audit skill. Organized by topic with source URLs and key quotes.

---

## Hreflang

### Placement Methods

Google supports three equivalent methods: HTML `<link>` in `<head>`, HTTP `Link` headers, and XML sitemap `<xhtml:link>` elements. Google confirmed no method is prioritized over another.

Google combines signals from both HTML and sitemaps. If the same language-region pair points to different URLs across methods, Google drops that pair rather than guessing.

- [Google Search Central: Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [SEJ: Google Combines Hreflang Signals](https://www.searchenginejournal.com/google-combines-hreflang-signals-from-html-sitemaps/389219/)

### Reciprocal Requirement

Google's docs: "If page X links to page Y, page Y must link back to page X. If not, those annotations may be ignored or not interpreted correctly."

Every page must include itself (self-referencing) in the hreflang set. Missing self-referencing is the #1 error found by Semrush audits. A study of 374,756 domains found 67% of hreflang implementations had issues.

- [Google Search Central: Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Semrush: 9 Common Hreflang Errors](https://www.semrush.com/blog/hreflang-errors/)
- [SE Land: 31% of International Websites Contain Hreflang Errors](https://searchengineland.com/study-31-of-international-websites-contain-hreflang-errors-395161)

### x-default

Introduced April 2013. Designates the fallback page for users whose language/region matches no declared variant. Can point to the same URL as one of the language-specific alternates. Must be included in the complete set of annotations on every variant page.

- [Google Blog: x-default hreflang](https://developers.google.com/search/blog/2013/04/x-default-hreflang-for-international-pages)
- [Google Blog: How x-default can help you (2023)](https://developers.google.com/search/blog/2023/05/x-default)

### Language & Region Codes

Language: ISO 639-1 (2-letter). Region: ISO 3166-1 Alpha 2 (2-letter). Format: `language[-script][-region]`.

You cannot specify a region code alone. Common mistakes: `en-UK` (should be `en-GB`), `es-419` (not ISO 3166-1). A study found 8.9% of sites using hreflang contain invalid language codes.

- [Google Search Central: Localized Versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [SE Land: 31% Study](https://searchengineland.com/study-31-of-international-websites-contain-hreflang-errors-395161)

### Hreflang at Scale (20+ locales)

With 20 locales, HTML `<head>` hreflang adds ~1.5KB per page for zero user benefit. Sitemap-based hreflang has zero runtime performance impact. `<xhtml:link>` child elements do NOT count toward the 50,000 URL sitemap limit (only `<loc>` elements count).

John Mueller recommends focusing hreflang on pages receiving wrong-language traffic, not every page: "I wouldn't do it for any of the other pages of the site because it's so complex & hard to manage."

- [SERoundtable: Child Elements Don't Count](https://www.seroundtable.com/google-child-elements-dont-count-towards-sitemap-url-limit-34377.html)
- [SERoundtable: Where To Focus Hreflang](https://www.seroundtable.com/using-hreflang-34127.html)
- [Yoast: hreflang Ultimate Guide](https://yoast.com/hreflang-ultimate-guide/)

### Google vs Bing

Bing treats hreflang as a "weak signal." Bing relies on `content-language` meta tag, HTML `lang` attribute, ccTLDs, and server location. Yandex supports hreflang like Google.

For both engines: implement hreflang (Google/Yandex) + `<html lang="...">` + `<meta http-equiv="content-language">` (Bing).

- [Digital Ready Marketing: Bing Doesn't Use Hreflang](https://digitalreadymarketing.com/bing-doesnt-use-hreflang-annotation-what-does-it-use/)
- [Yoast: hreflang Ultimate Guide](https://yoast.com/hreflang-ultimate-guide/)

---

## Canonicalization & i18n

### Self-Referencing Canonicals

Each locale page must canonical to itself. John Mueller: "Don't use a rel=canonical across languages/countries, only use it on a per-country/language basis."

Google's docs: "Specify a canonical page in the same language, or the best possible substitute language if a canonical doesn't exist for the same language."

- [John Mueller: hreflang canonical](https://johnmu.com/hreflang-canonical/)
- [Google: Consolidate Duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

### Canonical Overrides Hreflang

Mueller: "If your canonical is pointing somewhere else, Google will follow that and ignore your hreflang annotation." The canonical URL must be one of the URLs in the hreflang set, or all hreflang markup is ignored.

Google also states: "Google prefers URLs that are part of hreflang clusters for canonicalization" -- when signals align, hreflang strengthens canonical selection.

- [John Mueller: hreflang canonical](https://johnmu.com/hreflang-canonical/)
- [SEJ: Hreflang Tags Are Hints](https://www.searchenginejournal.com/google-reminds-hreflang-hints-canonical-directives/)
