import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters',
    aud: serviceAccount.token_uri,
    exp: now + 3600,
    iat: now
  };

  const encodeBase64Url = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const unsignedToken = `${encodeBase64Url(header)}.${encodeBase64Url(claimSet)}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  sign.end();
  const signature = sign.sign(serviceAccount.private_key, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const jwt = `${unsignedToken}.${signature}`;

  const res = await fetch(serviceAccount.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const data = await res.json();
  return data.access_token;
}

async function queryGSC(accessToken, siteUrl, days = 90) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDateObj = new Date();
  startDateObj.setDate(startDateObj.getDate() - days);
  const startDate = startDateObj.toISOString().split('T')[0];

  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`;

  const body = {
    startDate,
    endDate,
    dimensions: ['query', 'page'],
    rowLimit: 250,
    aggregationType: 'auto'
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return await res.json();
}

async function run() {
  const keyPath = path.resolve('.agents/google-service-account.json');
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
  const token = await getAccessToken(serviceAccount);
  const data = await queryGSC(token, 'sc-domain:carpenterwala.com', 90);

  const rows = data.rows || [];
  
  // Categorize
  const strikingDistance = rows.filter(r => r.position >= 3.5 && r.position <= 20).sort((a, b) => a.position - b.position);
  const localityQueries = rows.filter(r => /bangalore|bengaluru|hennur|thanisandra|kothanur|solur|banashank|kolur/i.test(r.keys[0]));
  const pricingQueries = rows.filter(r => /cost|price|rate|charges/i.test(r.keys[0]));

  console.log('\n========================================');
  console.log(`TOTAL ACTIVE QUERIES DISCOVERED: ${rows.length}`);
  console.log('========================================\n');

  console.log('🎯 TOP STRIKING-DISTANCE QUERIES (Position 3.5 – 20):');
  strikingDistance.forEach(r => {
    console.log(`  - [Pos ${r.position.toFixed(1)}] "${r.keys[0]}" -> ${r.keys[1]} (Imp: ${r.impressions}, Clicks: ${r.clicks})`);
  });

  console.log('\n📍 LOCALITY & BANGALORE INTENT QUERIES:');
  localityQueries.forEach(r => {
    console.log(`  - [Pos ${r.position.toFixed(1)}] "${r.keys[0]}" -> ${r.keys[1]} (Imp: ${r.impressions})`);
  });

  console.log('\n💰 PRICING & COST ESTIMATION QUERIES:');
  pricingQueries.forEach(r => {
    console.log(`  - [Pos ${r.position.toFixed(1)}] "${r.keys[0]}" -> ${r.keys[1]} (Imp: ${r.impressions})`);
  });
}

run();
