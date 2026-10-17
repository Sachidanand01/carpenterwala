import { generateProCode, toUrlSlug, toTradeSlug, getProUrl, getProShortUrl, normalizeProCode } from '../lib/pro-slug.js';

console.log('🧪 Running Pro URL & Collision Architecture Tests...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Pro Code generation format
const code1 = generateProCode();
assert(/^CW-[2-9A-HJ-NP-Z]{4}$/.test(code1), `generateProCode format is CW-XXXX without ambiguous chars (${code1})`);

// 2. Uniqueness test across 1000 generations
const codes = new Set();
for (let i = 0; i < 1000; i++) {
  codes.add(generateProCode());
}
assert(codes.size >= 995, `1000 generated codes have high entropy & minimal collision (${codes.size}/1000 unique)`);

// 3. Slug normalization
assert(toUrlSlug('Ram Singh') === 'ram-singh', `toUrlSlug normalizes "Ram Singh" to "ram-singh"`);
assert(toUrlSlug('  Arjun Kumar & Sons  ') === 'arjun-kumar-sons', `toUrlSlug trims and sanitizes special characters`);
assert(toUrlSlug('') === 'pro', `toUrlSlug handles empty string fallback`);

// 4. Trade slug normalization
assert(toTradeSlug('Welder') === 'welder', `toTradeSlug normalizes "Welder" to "welder"`);
assert(toTradeSlug('Interior Designer') === 'interior-designer', `toTradeSlug normalizes multi-word trade`);

// 5. Canonical URL generation
const mockPro1 = {
  name: 'Ram Singh',
  trade: 'Welder',
  pro_code: 'CW-7K92',
};
const mockPro2 = {
  name: 'Ram Singh',
  trade: 'Welder',
  pro_code: 'CW-3V5X',
};
const url1 = getProUrl(mockPro1);
const url2 = getProUrl(mockPro2);

assert(url1 === '/pro/welder/cw-7k92/ram-singh', `getProUrl produces expected hierarchical path: ${url1}`);
assert(url2 === '/pro/welder/cw-3v5x/ram-singh', `getProUrl produces expected hierarchical path: ${url2}`);
assert(url1 !== url2, `Two pros named "Ram Singh" in the same trade have distinct, non-colliding URLs`);

// 6. Vanity short-link generation
const short1 = getProShortUrl(mockPro1);
assert(short1 === '/pro/cw-7k92', `getProShortUrl produces concise vanity link: ${short1}`);

// 7. Pro Code normalization
assert(normalizeProCode('cw-7k92') === 'CW-7K92', `normalizeProCode converts lowercase to uppercase`);
assert(normalizeProCode('cw7k92') === 'CW-7K92', `normalizeProCode inserts hyphen if missing`);
assert(normalizeProCode('7k92') === 'CW-7K92', `normalizeProCode adds CW- prefix if omitted`);

console.log(`\n================================`);
console.log(`Results: ${passed} passed, ${failed} failed.`);
console.log(`================================\n`);

if (failed > 0) {
  process.exit(1);
}
