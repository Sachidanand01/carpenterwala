import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/webmasters.readonly',
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

async function submitSitemap(accessToken, siteUrl, sitemapUrl) {
  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const encodedSitemapUrl = encodeURIComponent(sitemapUrl);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps/${encodedSitemapUrl}`;
  
  console.log(`Submitting sitemap ${sitemapUrl} to ${siteUrl}...`);
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (res.status === 204 || res.status === 200) {
    console.log('✅ Sitemap successfully submitted to Google Search Console!');
  } else {
    const errorText = await res.text();
    console.log(`Response (${res.status}): ${errorText}`);
  }
}

async function main() {
  const keyPath = path.resolve('.agents/google-service-account.json');
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
  const token = await getAccessToken(serviceAccount);
  
  await submitSitemap(token, 'sc-domain:carpenterwala.com', 'https://carpenterwala.com/sitemap.xml');
}

main();
