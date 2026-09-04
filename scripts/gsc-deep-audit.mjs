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

async function checkSitemaps(accessToken, siteUrl) {
  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps`;
  const res = await fetch(url, { headers: { 'Authorization': `Bearer ${accessToken}` } });
  return await res.json();
}

async function getPagesPerformance(accessToken, siteUrl) {
  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`;
  const endDate = new Date().toISOString().split('T')[0];
  const startDateObj = new Date();
  startDateObj.setDate(startDateObj.getDate() - 90);
  const startDate = startDateObj.toISOString().split('T')[0];

  const body = {
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: 50,
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

async function getDevicePerformance(accessToken, siteUrl) {
  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`;
  const endDate = new Date().toISOString().split('T')[0];
  const startDateObj = new Date();
  startDateObj.setDate(startDateObj.getDate() - 90);
  const startDate = startDateObj.toISOString().split('T')[0];

  const body = {
    startDate,
    endDate,
    dimensions: ['device'],
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

async function main() {
  const keyPath = path.resolve('.agents/google-service-account.json');
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
  const token = await getAccessToken(serviceAccount);
  const siteUrl = 'sc-domain:carpenterwala.com';

  console.log('=== 1. SITEMAPS STATUS IN GOOGLE SEARCH CONSOLE ===');
  const sitemaps = await checkSitemaps(token, siteUrl);
  console.log(JSON.stringify(sitemaps, null, 2));

  console.log('\n=== 2. DEVICE BREAKDOWN (MOBILE VS DESKTOP) ===');
  const devices = await getDevicePerformance(token, siteUrl);
  console.log(JSON.stringify(devices, null, 2));

  console.log('\n=== 3. TOP PAGES BY IMPRESSIONS & CTR (LAST 90 DAYS) ===');
  const pages = await getPagesPerformance(token, siteUrl);
  const rows = pages.rows || [];
  rows.sort((a, b) => b.impressions - a.impressions);
  rows.forEach(r => {
    console.log(`- Page: ${r.keys[0]}`);
    console.log(`  Impressions: ${r.impressions} | Clicks: ${r.clicks} | CTR: ${(r.ctr * 100).toFixed(2)}% | Avg Pos: ${r.position.toFixed(1)}`);
  });
}

main();
