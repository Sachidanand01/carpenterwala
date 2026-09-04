import fs from 'fs';
import crypto from 'crypto';

const DEFAULT_PROPERTY_ID = '545007379';

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
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

async function runReport(accessToken, propertyId, requestBody) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  return await res.json();
}

async function main() {
  const propertyId = process.argv[2] || process.env.GA4_PROPERTY_ID || DEFAULT_PROPERTY_ID;

  const keyPath = './.agents/google-service-account.json';
  if (!fs.existsSync(keyPath)) {
    console.error('Error: Service account file not found at', keyPath);
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  console.log(`Connecting to GA4 Property: properties/${propertyId}`);
  console.log(`Using Service Account: ${serviceAccount.client_email}`);

  const accessToken = await getAccessToken(serviceAccount);

  console.log('\n======================================================');
  console.log(' 📊 GOOGLE ANALYTICS 4 (GA4) PERFORMANCE REPORT');
  console.log('======================================================');

  // 1. Overview Metrics (Last 30 Days)
  const overview = await runReport(accessToken, propertyId, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'totalUsers' },
      { name: 'newUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'engagementRate' },
      { name: 'averageSessionDuration' }
    ]
  });

  if (overview.error) {
    console.error('\n❌ GA4 API Error:', overview.error.message);
    return;
  }

  if (overview.rows && overview.rows.length > 0) {
    const vals = overview.rows[0].metricValues;
    console.log('\n📈 [Last 30 Days Summary]');
    console.log(`  • Total Users:              ${vals[0].value}`);
    console.log(`  • New Users:                ${vals[1].value}`);
    console.log(`  • Total Sessions:           ${vals[2].value}`);
    console.log(`  • Page Views:               ${vals[3].value}`);
    console.log(`  • Engagement Rate:          ${(parseFloat(vals[4].value) * 100).toFixed(1)}%`);
    console.log(`  • Avg Session Duration:     ${parseFloat(vals[5].value).toFixed(1)}s (${(parseFloat(vals[5].value) / 60).toFixed(1)} min)`);
  }

  // 2. Traffic Acquisition Channels
  const channels = await runReport(accessToken, propertyId, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'engagementRate' }
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10
  });

  if (channels.rows && channels.rows.length > 0) {
    console.log('\n🚦 [Top Traffic Acquisition Channels]');
    channels.rows.forEach(r => {
      const channel = r.dimensionValues[0].value;
      const sessions = r.metricValues[0].value;
      const users = r.metricValues[1].value;
      const engRate = (parseFloat(r.metricValues[2].value) * 100).toFixed(1);
      console.log(`  • ${channel.padEnd(22)} | Sessions: ${sessions.padStart(5)} | Users: ${users.padStart(5)} | Eng: ${engRate}%`);
    });
  }

  // 3. Top Visited Pages
  const topPages = await runReport(accessToken, propertyId, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'totalUsers' },
      { name: 'averageSessionDuration' }
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 15
  });

  if (topPages.rows && topPages.rows.length > 0) {
    console.log('\n📄 [Top 15 Most Visited Pages]');
    topPages.rows.forEach(r => {
      const page = r.dimensionValues[0].value;
      const views = r.metricValues[0].value;
      const users = r.metricValues[1].value;
      const duration = parseFloat(r.metricValues[2].value).toFixed(0);
      console.log(`  • ${page.padEnd(45)} | Views: ${views.padStart(5)} | Users: ${users.padStart(5)} | Avg: ${duration}s`);
    });
  }

  // 4. Geographic Distribution (Top Cities)
  const geo = await runReport(accessToken, propertyId, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'city' }, { name: 'country' }],
    metrics: [
      { name: 'totalUsers' },
      { name: 'sessions' }
    ],
    orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    limit: 10
  });

  if (geo.rows && geo.rows.length > 0) {
    console.log('\n📍 [Top 10 Cities by Traffic]');
    geo.rows.forEach(r => {
      const city = r.dimensionValues[0].value;
      const country = r.dimensionValues[1].value;
      const users = r.metricValues[0].value;
      const sessions = r.metricValues[1].value;
      console.log(`  • ${`${city} (${country})`.padEnd(30)} | Users: ${users.padStart(5)} | Sessions: ${sessions.padStart(5)}`);
    });
  }

  // 5. User Interaction Events
  const events = await runReport(accessToken, propertyId, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [
      { name: 'eventCount' },
      { name: 'totalUsers' }
    ],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 10
  });

  if (events.rows && events.rows.length > 0) {
    console.log('\n⚡ [User Interaction Events]');
    events.rows.forEach(r => {
      const event = r.dimensionValues[0].value;
      const count = r.metricValues[0].value;
      const users = r.metricValues[1].value;
      console.log(`  • ${event.padEnd(25)} | Count: ${count.padStart(6)} | Users: ${users.padStart(4)}`);
    });
  }

  // 6. Device Category Breakdown
  const devices = await runReport(accessToken, propertyId, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [
      { name: 'totalUsers' },
      { name: 'screenPageViews' }
    ],
    orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }]
  });

  if (devices.rows && devices.rows.length > 0) {
    console.log('\n📱 [Device Categories]');
    devices.rows.forEach(r => {
      const device = r.dimensionValues[0].value;
      const users = r.metricValues[0].value;
      const views = r.metricValues[1].value;
      console.log(`  • ${device.padEnd(12)} | Users: ${users.padStart(5)} | PageViews: ${views.padStart(5)}`);
    });
  }

  console.log('\n======================================================\n');
}

main().catch(console.error);
