import { NextResponse } from 'next/server';

function cleanAndEnforceLimit(text, maxChars = 350) {
  let cleaned = text
    .replace(/^["']|["']$/g, '') // strip surrounding quotes
    .replace(/\*\*/g, '') // strip markdown bold
    .replace(/[\r\n]+/g, ' ') // single line
    .trim();

  if (cleaned.length > maxChars) {
    // Truncate at word boundary with a period
    const sub = cleaned.slice(0, maxChars - 1);
    const lastSpace = sub.lastIndexOf(' ');
    cleaned = (lastSpace > 50 ? sub.slice(0, lastSpace) : sub).trim() + '.';
  }

  return cleaned;
}

// Local heuristic fallback in case all external APIs are unreachable
function fallbackHeuristicPolish(text, trade, experience, maxChars = 350) {
  let polished = text.trim();

  // Common Indian English trade draft fixes
  polished = polished
    .replace(/^am\s+a\b/i, 'I am a')
    .replace(/\bam\b/gi, 'I am')
    .replace(/\bhave\s+been\b/i, 'with proven expertise')
    .replace(/\ban\s+as\b/gi, 'and as')
    .replace(/\bcontractor\b/gi, 'contractors')
    .replace(/\bexperience\s+of\b/i, 'years of experience in')
    .replace(/\s+/g, ' ');

  // Ensure first character capitalized and ends with period
  if (polished.length > 0) {
    polished = polished.charAt(0).toUpperCase() + polished.slice(1);
    if (!/[.!?]$/.test(polished)) polished += '.';
  }

  return cleanAndEnforceLimit(polished, maxChars);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, trade, experience } = body;

    if (!text || typeof text !== 'string' || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please enter at least 50 characters to use AI Rephrase.' },
        { status: 400 }
      );
    }

    const trimmedInput = text.trim();
    const tradeHint = trade ? `Profession / Trade: ${trade}. ` : '';
    const expHint = experience ? `Experience: ${experience}. ` : '';

    const systemPrompt = `You are a professional profile copywriter for Carpenterwala, a premium home services marketplace in Bengaluru.
Rephrase the user's rough description into a polished, trustworthy, first-person overview for a verified service professional.
Rules:
1. Write in clear, professional first-person (e.g. "I am a skilled...", "I specialize in...").
2. Fix all grammar, spelling, and phrasing errors.
3. Keep it warm, polite, and customer-focused.
4. STRICT LIMIT: Must NOT exceed 320 characters (under 50 words) so it fits the profile card without overflowing.
5. Output ONLY the rephrased text. Do NOT add greetings, quotes, or markdown formatting.

${tradeHint}${expHint}
Input:
${trimmedInput}`;

    // ── Tier 1: Google Gemini Flash (if API key available) ──
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: {
                maxOutputTokens: 120,
                temperature: 0.4
              }
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate && candidate.trim()) {
            const result = cleanAndEnforceLimit(candidate.trim());
            return NextResponse.json({ rephrased: result, source: 'gemini' });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini rephrase failed, falling back to Pollinations:', geminiErr);
      }
    }

    // ── Tier 2: Free Public LLM (Pollinations.ai - No API key required) ──
    try {
      const pollUrl = `https://text.pollinations.ai/${encodeURIComponent(systemPrompt)}?model=openai&seed=${Date.now() % 10000}`;
      const pollRes = await fetch(pollUrl, {
        headers: { 'User-Agent': 'Carpenterwala/1.0' }
      });

      if (pollRes.ok) {
        const pollText = await pollRes.text();
        if (pollText && pollText.trim().length > 20) {
          const result = cleanAndEnforceLimit(pollText.trim());
          return NextResponse.json({ rephrased: result, source: 'pollinations' });
        }
      }
    } catch (pollErr) {
      console.warn('Pollinations rephrase failed, using local heuristic:', pollErr);
    }

    // ── Tier 3: Local Heuristic Fallback ──
    const localResult = fallbackHeuristicPolish(trimmedInput, trade, experience);
    return NextResponse.json({ rephrased: localResult, source: 'heuristic' });
  } catch (error) {
    console.error('Rephrase API error:', error);
    return NextResponse.json(
      { error: 'Failed to rephrase description. Please try again.' },
      { status: 500 }
    );
  }
}
