const https = require('https');
const HNStory = require('../models/HNStory');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function fetchTopStories(limit = 10) {
  try {
    const ids = await fetchJSON('https://hacker-news.firebaseio.com/v0/topstories.json');
    const top = ids.slice(0, limit);
    const promises = top.map(id => fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
    const items = await Promise.all(promises);

    for (const item of items) {
      if (!item || !item.id) continue;
      await HNStory.findOneAndUpdate(
        { hnId: item.id },
        {
          hnId: item.id,
          title: item.title || '',
          by: item.by || '',
          url: item.url || '',
          time: item.time || 0,
          score: item.score || 0,
          descendants: item.descendants || 0,
          text: item.text || '',
          fetchedAt: new Date()
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`[hnfetcher] updated top ${items.length} stories`);
  } catch (err) {
    console.error('[hnfetcher] fetch error', err);
  }
}

let intervalHandle = null;

function start(pollIntervalMs = 5 * 60 * 1000) { // default every 5 minutes
  // initial fetch
  fetchTopStories().catch(() => {});
  // periodic
  if (intervalHandle) clearInterval(intervalHandle);
  intervalHandle = setInterval(() => fetchTopStories().catch(() => {}), pollIntervalMs);
  console.log('[hnfetcher] started (interval ms):', pollIntervalMs);
}

module.exports = { start, fetchTopStories };