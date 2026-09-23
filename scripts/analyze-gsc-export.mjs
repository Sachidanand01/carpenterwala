import fs from 'fs';
import path from 'path';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseGscCSV(content) {
  // Strip BOM if present
  const cleanContent = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
  const lines = cleanContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/["']/g, ''));
  const queryCol = headers.findIndex(h => h.includes('quer') || h.includes('top quer'));
  const pageCol = headers.findIndex(h => h.includes('page') || h.includes('top page') || h.includes('url'));
  const clicksCol = headers.findIndex(h => h.includes('click'));
  const impressionsCol = headers.findIndex(h => h.includes('impression'));
  const ctrCol = headers.findIndex(h => h.includes('ctr'));
  const positionCol = headers.findIndex(h => h.includes('position'));

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]).map(c => c.replace(/^["']|["']$/g, ''));
    if (cols.length < 2) continue;

    const query = queryCol !== -1 ? cols[queryCol] : (pageCol === -1 ? cols[0] : '');
    const page = pageCol !== -1 ? cols[pageCol] : '';
    const clicks = clicksCol !== -1 ? parseInt(cols[clicksCol].replace(/,/g, ''), 10) || 0 : 0;
    const impressions = impressionsCol !== -1 ? parseInt(cols[impressionsCol].replace(/,/g, ''), 10) || 0 : 0;
    
    let ctr = 0;
    if (ctrCol !== -1 && cols[ctrCol]) {
      const ctrStr = cols[ctrCol].replace(/%/g, '').trim();
      ctr = parseFloat(ctrStr) || 0;
    } else if (impressions > 0) {
      ctr = (clicks / impressions) * 100;
    }

    const position = positionCol !== -1 ? parseFloat(cols[positionCol]) || 0 : 0;

    rows.push({
      query,
      page,
      clicks,
      impressions,
      ctr,
      position
    });
  }

  return rows;
}

function analyzeData(rows) {
  const isQueryData = rows.some(r => r.query && r.query.length > 0);

  console.log(`\n======================================================`);
  console.log(`📊 GOOGLE SEARCH CONSOLE EXPORT ANALYSIS (${rows.length} ROWS)`);
  console.log(`======================================================\n`);

  if (isQueryData) {
    // 1. Quick wins (Pos 3.5 - 15)
    const quickWins = rows
      .filter(r => r.position >= 3.5 && r.position <= 15.0 && r.impressions >= 1)
      .sort((a, b) => b.impressions - a.impressions);

    console.log(`🎯 STRIKING DISTANCE OPPORTUNITIES (Position 3.5 – 15.0):`);
    console.log(`These keywords already have Google traction. On-page optimization can push them to Top 3:\n`);
    quickWins.slice(0, 15).forEach((r, idx) => {
      console.log(`  ${idx + 1}. "${r.query}" | Pos: ${r.position.toFixed(1)} | Imp: ${r.impressions} | Clicks: ${r.clicks} | CTR: ${r.ctr.toFixed(1)}%`);
    });

    // 2. High Impressions, Low CTR (Position <= 10, CTR < 2%)
    const lowCTR = rows
      .filter(r => r.position <= 10 && r.ctr < 2.0 && r.impressions >= 5)
      .sort((a, b) => b.impressions - a.impressions);

    console.log(`\n🚨 HIGH IMPRESSIONS / LOW CTR (Underperforming Titles/Snippets):`);
    console.log(`Already on Page 1, but losing clicks. Upgrade title tag and add brackets/price hooks:\n`);
    lowCTR.slice(0, 10).forEach((r, idx) => {
      console.log(`  ${idx + 1}. "${r.query}" | Pos: ${r.position.toFixed(1)} | Imp: ${r.impressions} | CTR: ${r.ctr.toFixed(2)}% | Clicks: ${r.clicks}`);
    });

    // 3. Bangalore & Locality Intent
    const bangaloreKeywords = rows
      .filter(r => /bangalore|bengaluru|hennur|thanisandra|kothanur|whitefield|koramangala|indiranagar|hsr|jayanagar|yelahanka|marathahalli|bellandur|electronic city|jigani/i.test(r.query))
      .sort((a, b) => b.impressions - a.impressions);

    console.log(`\n📍 BANGALORE LOCALITY INTENT KEYWORDS:`);
    bangaloreKeywords.forEach((r, idx) => {
      console.log(`  ${idx + 1}. "${r.query}" | Pos: ${r.position.toFixed(1)} | Imp: ${r.impressions} | Clicks: ${r.clicks}`);
    });

    // 4. Commercial & Pricing Intent
    const pricingKeywords = rows
      .filter(r => /cost|price|rate|charges|per sq|per day|contractor|hire/i.test(r.query))
      .sort((a, b) => b.impressions - a.impressions);

    console.log(`\n💰 HIGH-COMMERCIAL PRICING KEYWORDS:`);
    pricingKeywords.slice(0, 15).forEach((r, idx) => {
      console.log(`  ${idx + 1}. "${r.query}" | Pos: ${r.position.toFixed(1)} | Imp: ${r.impressions} | Clicks: ${r.clicks}`);
    });
  } else {
    // Top Pages
    const topPages = rows.sort((a, b) => b.impressions - a.impressions);
    console.log(`📑 TOP PAGES BY IMPRESSIONS:`);
    topPages.slice(0, 20).forEach((r, idx) => {
      console.log(`  ${idx + 1}. ${r.page} | Imp: ${r.impressions} | Clicks: ${r.clicks} | CTR: ${r.ctr.toFixed(2)}% | Pos: ${r.position.toFixed(1)}`);
    });
  }

  console.log(`\n======================================================\n`);
}

function findGscFiles(dir) {
  const candidates = [];
  const exportDir = path.join(dir, 'gsc-export');
  if (fs.existsSync(exportDir)) {
    const qFile = path.join(exportDir, 'Queries.csv');
    if (fs.existsSync(qFile)) candidates.push(qFile);
    const pFile = path.join(exportDir, 'Pages.csv');
    if (fs.existsSync(pFile)) candidates.push(pFile);
  }

  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.endsWith('.csv') && !f.includes('blogs_export')) {
      candidates.push(path.join(dir, f));
    }
  }
  return candidates;
}

function main() {
  const args = process.argv.slice(2);
  let targetFile = args[0];

  if (!targetFile) {
    const candidates = findGscFiles(process.cwd());
    if (candidates.length > 0) {
      targetFile = candidates[0];
      console.log(`ℹ️ Automatically detected GSC export file: ${targetFile}`);
    }
  }

  if (!targetFile || !fs.existsSync(targetFile)) {
    console.log(`\n🔍 No specific CSV file provided or found in root directory.`);
    console.log(`Usage:`);
    console.log(`  node scripts/analyze-gsc-export.mjs <path-to-gsc-csv-file>`);
    console.log(`\nOr place 'Queries.csv' or 'gsc_export.csv' in the project root directory and run:`);
    console.log(`  npm run gsc:analyze\n`);
    return;
  }

  const content = fs.readFileSync(targetFile, 'utf-8');
  const rows = parseGscCSV(content);
  if (rows.length === 0) {
    console.error(`❌ Could not parse any valid rows from: ${targetFile}`);
    return;
  }

  analyzeData(rows);
}

main();
